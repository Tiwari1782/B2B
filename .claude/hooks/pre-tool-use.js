#!/usr/bin/env node
/**
 * Bug2Build — Claude Hook: pre-tool-use
 * Runs before every tool call Claude makes.
 * Blocks or warns on dangerous patterns specific to this project.
 *
 * Location: .claude/hooks/pre-tool-use.js
 * Docs: https://docs.anthropic.com/claude-code/hooks
 */

const input = JSON.parse(process.argv[2] || '{}');
const { tool_name, tool_input } = input;

// ─── Rules ────────────────────────────────────────────────────────────────────

const rules = [

  // 1. Never let Claude drop the entire MongoDB database
  {
    match: () =>
      tool_name === 'run_bash' &&
      /mongoose\.connection\.dropDatabase|db\.dropDatabase/i.test(tool_input?.command || ''),
    block: true,
    message: '🚫 BLOCKED: dropDatabase() is not allowed. Drop individual collections manually if needed.',
  },

  // 2. Never commit .env or .env.local files
  {
    match: () =>
      tool_name === 'run_bash' &&
      /git add.*(\.env|\.env\.local)/i.test(tool_input?.command || ''),
    block: true,
    message: '🚫 BLOCKED: Attempted to stage .env or .env.local. These must never be committed.',
  },

  // 3. Never write the Groq API key into any client-side file
  {
    match: () =>
      tool_name === 'write_file' &&
      /client\/src/i.test(tool_input?.path || '') &&
      /GROQ_API_KEY/i.test(tool_input?.content || ''),
    block: true,
    message: '🚫 BLOCKED: GROQ_API_KEY must never appear in client-side code. Keep it server-side only.',
  },

  // 4. Warn before running the seed script (destructive if run in production)
  {
    match: () =>
      tool_name === 'run_bash' &&
      /node scripts\/seed\.js|npm run seed/i.test(tool_input?.command || ''),
    block: false,
    message: '⚠️  WARNING: You are about to run the seed script. This is safe locally but destructive in production. Confirm you are on localhost.',
  },

  // 5. Warn if Claude tries to install react-hot-toast (deprecated in this project)
  {
    match: () =>
      tool_name === 'run_bash' &&
      /npm install.*react-hot-toast/i.test(tool_input?.command || ''),
    block: true,
    message: '🚫 BLOCKED: react-hot-toast is deprecated in this project. Use the custom ToastNotification system in client/src/components/common/ToastNotification.jsx.',
  },

  // 6. Never delete the uploads/ folder entirely (Multer temp dir)
  {
    match: () =>
      tool_name === 'run_bash' &&
      /rm -rf.*server\/uploads/i.test(tool_input?.command || ''),
    block: true,
    message: '🚫 BLOCKED: Do not delete server/uploads/. This is the Multer temp directory. Individual files are cleaned up after Cloudinary upload.',
  },

  // 7. Warn on any direct MongoDB connection string in source files
  {
    match: () =>
      tool_name === 'write_file' &&
      /mongodb(\+srv)?:\/\//i.test(tool_input?.content || '') &&
      !/\.env/i.test(tool_input?.path || ''),
    block: true,
    message: '🚫 BLOCKED: Hardcoded MongoDB URI detected in source file. Use process.env.MONGO_URI instead.',
  },

];

// ─── Runner ───────────────────────────────────────────────────────────────────

let blocked = false;

for (const rule of rules) {
  if (rule.match()) {
    console.error(rule.message);
    if (rule.block) blocked = true;
  }
}

process.exit(blocked ? 1 : 0);