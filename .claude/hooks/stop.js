#!/usr/bin/env node
/**
 * Bug2Build — Claude Hook: stop
 * Runs when Claude finishes a task and is about to stop.
 * Use this to run final checks, summaries, or cleanup tasks
 * after Claude completes its work for the session.
 *
 * Location: .claude/hooks/stop.js
 * Docs: https://docs.anthropic.com/claude-code/hooks
 */

const input = JSON.parse(process.argv[2] || '{}');

// ─── Final Checks ─────────────────────────────────────────────────────────────

const checks = [

  // 1. Remind to verify the production build still passes
  {
    always: true,
    message:
      '✅ SESSION END — Reminder: Run `cd client && npm run build` before ' +
      'any deployment to confirm the Vite production build is clean.',
  },

  // 2. Remind to check .env.example is up to date if new env vars were added
  {
    always: true,
    message:
      '📋 SESSION END — If any new environment variables were added, update ' +
      'server/.env.example with the key name (no value) so the deployment team ' +
      'knows what to set.',
  },

  // 3. Remind to verify no console.log was left in backend files
  {
    always: true,
    message:
      '🔍 SESSION END — Check server/controllers/ and server/routes/ for any ' +
      'console.log() debug statements left in before handoff.',
  },

  // 4. Remind about the seed script if this looks like a DB session
  {
    always: false,
    condition: () => {
      // Only fire if this session involved DB-related env hints (best-effort)
      try {
        const sessionHints = process.env.B2B_SESSION_TAGS || '';
        return /database|seed|model|schema/i.test(sessionHints);
      } catch (_) {
        return false;
      }
    },
    message:
      '🗄️  SESSION END — If new Mongoose models were added, verify server/scripts/seed.js ' +
      'is updated and test it on a clean local database.',
  },

  // 5. Remind to keep auth guards intact
  {
    always: true,
    message:
      '🔐 SESSION END — Verify all /admin and /superadmin routes are still wrapped ' +
      'in <ProtectedRoute> with the correct requiredRole prop.',
  },

  // 6. Remind about activity logger coverage
  {
    always: true,
    message:
      '📝 SESSION END — If new admin CRUD endpoints were added, confirm the ' +
      'activityLogger middleware is attached so all mutations appear in the audit log.',
  },

];

// ─── Runner ───────────────────────────────────────────────────────────────────

console.error('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.error('  Bug2Build — End of Claude Session Checklist');
console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

for (const check of checks) {
  try {
    const shouldRun = check.always || (check.condition && check.condition());
    if (shouldRun) console.error(check.message + '\n');
  } catch (_) {}
}

console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Stop hooks are always advisory
process.exit(0);