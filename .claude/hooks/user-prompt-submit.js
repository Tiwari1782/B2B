#!/usr/bin/env node
/**
 * Bug2Build — Claude Hook: UserPromptSubmit
 * Runs every time the user submits a prompt to Claude.
 * Use this to inject context, block dangerous requests, or warn
 * before Claude even starts processing the message.
 *
 * Location: .claude/hooks/user-prompt-submit.js
 * Docs: https://docs.anthropic.com/claude-code/hooks
 */

const input = JSON.parse(process.argv[2] || '{}');
const { prompt } = input;

const p = (prompt || '').toLowerCase();

// ─── Rules ────────────────────────────────────────────────────────────────────

const rules = [

  // 1. Block any prompt asking to expose or log the Groq API key
  {
    match: () => /groq.*(key|secret|token)|api.*(key|secret).*groq/i.test(prompt),
    block: true,
    message:
      '🚫 BLOCKED: This prompt references the Groq API key. ' +
      'GROQ_API_KEY must stay server-side only (server/.env). ' +
      'Never log, print, or expose it to the client bundle.',
  },

  // 2. Block prompts asking to remove ProtectedRoute or auth guards
  {
    match: () =>
      /remove.*protectedroute|disable.*auth|bypass.*jwt|skip.*auth/i.test(prompt),
    block: true,
    message:
      '🚫 BLOCKED: This prompt asks to remove or bypass authentication guards. ' +
      'All /admin and /superadmin routes must remain wrapped in <ProtectedRoute>. ' +
      'Auth cannot be disabled even temporarily.',
  },

  // 3. Warn before any prompt that mentions wiping or resetting the database
  {
    match: () =>
      /wipe.*database|reset.*db|drop.*collection|delete.*all.*data/i.test(prompt),
    block: false,
    message:
      '⚠️  WARNING: This prompt involves wiping or resetting database data. ' +
      'Confirm you are targeting localhost — NOT your MongoDB Atlas production cluster.',
  },

  // 4. Block prompts asking to open CORS to wildcard
  {
    match: () => /cors.*\*|open.*cors|allow.*all.*origins/i.test(prompt),
    block: true,
    message:
      '🚫 BLOCKED: Opening CORS to * is not allowed in Bug2Build. ' +
      'CORS is restricted to CLIENT_URL env var. Update that variable instead.',
  },

  // 5. Warn when prompt asks to switch from the custom toast to react-hot-toast
  {
    match: () => /react-hot-toast|switch.*toast|replace.*toast/i.test(prompt),
    block: false,
    message:
      '⚠️  WARNING: react-hot-toast is deprecated in this project. ' +
      'Use the custom ToastNotification system at ' +
      'client/src/components/common/ToastNotification.jsx instead.',
  },

  // 6. Block prompts that ask Claude to commit secrets or .env files
  {
    match: () =>
      /git (add|commit).*(\.env|secret|password|api.?key)/i.test(prompt),
    block: true,
    message:
      '🚫 BLOCKED: This prompt asks to commit sensitive files or secrets to Git. ' +
      '.env, .env.local, and any file containing secrets must never be committed.',
  },

  // 7. Warn before creating a new admin role or superadmin account manually
  {
    match: () =>
      /create.*superadmin|add.*superadmin|new.*admin.*role/i.test(prompt),
    block: false,
    message:
      '⚠️  WARNING: SuperAdmin accounts should only be created via the seed script ' +
      '(node scripts/seed.js). Creating them manually risks inconsistent role assignments.',
  },

  // 8. Block storing images as base64 in MongoDB
  {
    match: () =>
      /store.*image.*mongo|save.*base64.*db|base64.*mongodb/i.test(prompt),
    block: true,
    message:
      '🚫 BLOCKED: Images must not be stored as base64 in MongoDB. ' +
      'Upload to Cloudinary via Multer and store only the returned URL string.',
  },

  // 9. Warn on any prompt asking to use fetch() directly in the frontend
  {
    match: () =>
      /use fetch\(\)|raw fetch|window\.fetch|fetch\s*\(\s*['"]/i.test(prompt),
    block: false,
    message:
      '⚠️  WARNING: All frontend HTTP calls must go through client/src/services/api.js. ' +
      'Do not use raw fetch() — use the shared Axios instance with the JWT interceptor.',
  },

  // 10. Catch prompts asking to hardcode any URL or port
  {
    match: () =>
      /localhost:5000|localhost:5173|hardcode.*url|hardcode.*port/i.test(prompt),
    block: false,
    message:
      '⚠️  WARNING: Do not hardcode localhost URLs or ports. ' +
      'Use VITE_API_URL (client) and PORT (server) from environment variables.',
  },

];

// ─── Runner ───────────────────────────────────────────────────────────────────

let blocked = false;

for (const rule of rules) {
  try {
    if (rule.match()) {
      console.error(rule.message);
      if (rule.block) blocked = true;
    }
  } catch (_) {}
}

process.exit(blocked ? 1 : 0);