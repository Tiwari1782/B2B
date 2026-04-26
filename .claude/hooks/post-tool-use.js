#!/usr/bin/env node
/**
 * Bug2Build — Claude Hook: post-tool-use
 * Runs after every tool call Claude makes.
 * Audits side-effects, flags silent failures, and enforces project conventions
 * AFTER the action has already happened.
 *
 * Location: .claude/hooks/post-tool-use.js
 * Docs: https://docs.anthropic.com/claude-code/hooks
 */

const input = JSON.parse(process.argv[2] || '{}');
const { tool_name, tool_input, tool_output } = input;

const output     = tool_output?.output     || '';
const stderr     = tool_output?.stderr     || '';
const exitCode   = tool_output?.exit_code  ?? 0;
const filePath   = tool_input?.path        || '';
const fileContent= tool_input?.content     || '';
const command    = tool_input?.command     || '';

// ─── Auditors ─────────────────────────────────────────────────────────────────

const auditors = [

  // ── 1. Catch npm install that sneaked in react-hot-toast ──────────────────
  {
    match: () =>
      tool_name === 'run_bash' &&
      /npm install/i.test(command) &&
      /react-hot-toast/i.test(output + stderr),
    message:
      '⚠️  POST-INSTALL AUDIT: react-hot-toast appears to have been installed. ' +
      'This package is deprecated in Bug2Build. Remove it and use the custom ' +
      'ToastNotification system at client/src/components/common/ToastNotification.jsx.',
  },

  // ── 2. Detect if npm install introduced an unexpected package ──────────────
  {
    match: () =>
      tool_name === 'run_bash' &&
      /npm install/i.test(command) &&
      /added \d+ package/i.test(output) &&
      !/--save-dev|-D/i.test(command) &&
      // packages that have known client-safe alternatives in this project
      /(axios(?! is)|node-fetch|got|superagent)/i.test(command),
    message:
      '⚠️  POST-INSTALL AUDIT: A HTTP-client package was installed. ' +
      'All frontend HTTP calls must go through client/src/services/api.js (Axios + JWT interceptor). ' +
      'Do not create parallel HTTP clients.',
  },

  // ── 3. Warn if seed script ran and output suggests production DB ───────────
  {
    match: () =>
      tool_name === 'run_bash' &&
      /node scripts\/seed\.js|npm run seed/i.test(command) &&
      /mongodb\+srv:\/\//i.test(output + stderr) &&
      !/localhost|127\.0\.0\.1/i.test(output + stderr),
    message:
      '🚨 POST-SEED ALERT: The seed script appears to have run against a non-local ' +
      'MongoDB URI (Atlas cluster detected in output). Verify this was intentional — ' +
      'seed.js drops and repopulates the SuperAdmin and SiteContent collections.',
  },

  // ── 4. Detect hardcoded hex colors written into component files ───────────
  {
    match: () =>
      tool_name === 'write_file' &&
      /client\/src\/(pages|components)/i.test(filePath) &&
      /#([0-9a-fA-F]{3,6})\b/.test(fileContent) &&
      // allow comments and README-style lines
      !/\/\/.*#[0-9a-fA-F]/.test(fileContent),
    message:
      '⚠️  POST-WRITE AUDIT: Hardcoded hex color detected in a component or page file. ' +
      'Use CSS custom property tokens from index.css (e.g. var(--accent-primary), ' +
      'var(--bg-surface)) — never hardcode hex values in component files.',
  },

  // ── 5. Detect raw fetch() written into client source files ────────────────
  {
    match: () =>
      tool_name === 'write_file' &&
      /client\/src/i.test(filePath) &&
      /\bfetch\s*\(/i.test(fileContent),
    message:
      '⚠️  POST-WRITE AUDIT: Raw fetch() call detected in client source. ' +
      'All HTTP calls must go through client/src/services/api.js. ' +
      'Import the api instance and use api.get() / api.post() instead.',
  },

  // ── 6. Detect standalone axios.create() outside of api.js ────────────────
  {
    match: () =>
      tool_name === 'write_file' &&
      /client\/src/i.test(filePath) &&
      !/services\/api\.js$/i.test(filePath) &&
      /axios\.create\s*\(/i.test(fileContent),
    message:
      '⚠️  POST-WRITE AUDIT: axios.create() detected outside of services/api.js. ' +
      'Do not create secondary Axios instances. Use the shared api.js client ' +
      'which includes the JWT interceptor.',
  },

  // ── 7. Detect console.log left in backend controllers ────────────────────
  {
    match: () =>
      tool_name === 'write_file' &&
      /server\/(controllers|routes|middleware)/i.test(filePath) &&
      /console\.log\s*\(/i.test(fileContent),
    message:
      '⚠️  POST-WRITE AUDIT: console.log() found in server controller/route/middleware. ' +
      'Remove debug logs before handoff. Use the activityLogger middleware for ' +
      'audit trails, or morgan for request logging.',
  },

  // ── 8. Detect GROQ_API_KEY referenced in client bundle ───────────────────
  {
    match: () =>
      tool_name === 'write_file' &&
      /client\/(src|public)/i.test(filePath) &&
      /GROQ_API_KEY/i.test(fileContent),
    message:
      '🚫 POST-WRITE CRITICAL: GROQ_API_KEY reference found in client-side file. ' +
      'This key must NEVER be exposed in the client bundle. ' +
      'All Groq calls must go through POST /api/chat on the backend.',
  },

  // ── 9. Detect JWT_SECRET or MONGO_URI hardcoded anywhere in source ────────
  {
    match: () =>
      tool_name === 'write_file' &&
      !/\.env/i.test(filePath) &&
      /(JWT_SECRET\s*=\s*['"`][^'"` ]{6,}|mongodb(\+srv)?:\/\/[^'"` ]+['"`])/i.test(fileContent),
    message:
      '🚫 POST-WRITE CRITICAL: Hardcoded JWT_SECRET or MongoDB URI detected in source file. ' +
      'Secrets must only live in server/.env (never committed). ' +
      'Reference via process.env.JWT_SECRET and process.env.MONGO_URI.',
  },

  // ── 10. Detect if npm run build failed silently ───────────────────────────
  {
    match: () =>
      tool_name === 'run_bash' &&
      /npm run build/i.test(command) &&
      (exitCode !== 0 || /error/i.test(stderr)),
    message:
      '🚨 POST-BUILD ALERT: The Vite production build exited with errors. ' +
      'Do NOT hand off or deploy until `cd client && npm run build` completes cleanly. ' +
      'Check stderr above for the failing module.',
  },

  // ── 11. Warn if a new Mongoose model was added without a seed entry ───────
  {
    match: () =>
      tool_name === 'write_file' &&
      /server\/models\/[A-Z][a-zA-Z]+\.js$/.test(filePath) &&
      // new file (no content hint of "updating") — heuristic: no "module.exports" from prior content
      /mongoose\.model\s*\(/.test(fileContent),
    message:
      '⚠️  POST-WRITE AUDIT: New Mongoose model created. ' +
      'If this model needs default data (like SiteContent), add it to server/scripts/seed.js. ' +
      'Also verify the model is imported and used in the appropriate controller and route.',
  },

  // ── 12. Detect @keyframes added directly to a component file ─────────────
  {
    match: () =>
      tool_name === 'write_file' &&
      /client\/src\/(pages|components)/i.test(filePath) &&
      /@keyframes\s+\w+/i.test(fileContent),
    message:
      '⚠️  POST-WRITE AUDIT: @keyframes detected in a component file. ' +
      'Per project conventions, interactive animations must use Framer Motion. ' +
      'Static decorative keyframes belong in index.css, not component files.',
  },

  // ── 13. Detect emoji characters written into UI component files ───────────
  {
    match: () => {
      if (tool_name !== 'write_file') return false;
      if (!/client\/src\/(pages|components)/i.test(filePath)) return false;
      // Broad emoji unicode range check
      return /[\u{1F300}-\u{1FAFF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}]/u.test(fileContent);
    },
    message:
      '⚠️  POST-WRITE AUDIT: Emoji character detected in UI source file. ' +
      'Use react-icons (HiOutline set) for all icons — no emojis in the UI. ' +
      'Example: import { HiOutlineStar } from "react-icons/hi".',
  },

  // ── 14. Warn if a protected route was added without ProtectedRoute wrapper ─
  {
    match: () =>
      tool_name === 'write_file' &&
      /App\.jsx$/i.test(filePath) &&
      /path.*\/(admin|superadmin)/i.test(fileContent) &&
      !/ProtectedRoute/i.test(fileContent),
    message:
      '⚠️  POST-WRITE AUDIT: Admin or superadmin route detected in App.jsx without ' +
      'a ProtectedRoute wrapper. All /admin and /superadmin routes must be wrapped in ' +
      '<ProtectedRoute> with the appropriate requiredRole prop.',
  },

  // ── 15. Detect binary data stored in MongoDB (base64 in model/controller) ──
  {
    match: () =>
      tool_name === 'write_file' &&
      /server\/(models|controllers)/i.test(filePath) &&
      /base64|Buffer\.from|binary/i.test(fileContent) &&
      /image|photo|logo|avatar/i.test(fileContent),
    message:
      '🚫 POST-WRITE CRITICAL: Binary image data (base64/Buffer) detected in a model or ' +
      'controller. Images must be uploaded to Cloudinary via Multer — never store binary ' +
      'data in MongoDB. Store only the Cloudinary URL string.',
  },

];

// ─── Runner ───────────────────────────────────────────────────────────────────

for (const auditor of auditors) {
  try {
    if (auditor.match()) {
      console.error(auditor.message);
    }
  } catch (_) {
    // Never let a broken auditor crash the hook
  }
}

// post-tool-use hooks are advisory — always exit 0 (non-blocking)
process.exit(0);