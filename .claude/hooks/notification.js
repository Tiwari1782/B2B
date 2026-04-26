#!/usr/bin/env node
/**
 * Bug2Build — Claude Hook: notification
 * Runs when Claude sends a notification to the user.
 * Used to log, filter, or react to Claude's notification events.
 *
 * Location: .claude/hooks/notification.js
 * Docs: https://docs.anthropic.com/claude-code/hooks
 */

const input = JSON.parse(process.argv[2] || '{}');
const { message, title } = input;

const msg   = (message || '').toLowerCase();
const ttl   = (title   || '').toLowerCase();

// ─── Notification Watchers ────────────────────────────────────────────────────

const watchers = [

  // 1. Alert if Claude notifies about a build failure
  {
    match: () => /build failed|vite error|compilation error/i.test(msg),
    log: () => console.error(
      '🚨 BUILD FAILURE NOTIFICATION: Claude detected a build error. ' +
      'Run `cd client && npm run build` manually and fix all errors before deploying.'
    ),
  },

  // 2. Alert on any notification mentioning .env files
  {
    match: () => /\.env|environment variable|api key|secret/i.test(msg),
    log: () => console.error(
      '⚠️  SECRETS NOTIFICATION: Claude is referencing environment variables or secrets. ' +
      'Ensure nothing sensitive is being logged or written to source files.'
    ),
  },

  // 3. Log deployment-related notifications
  {
    match: () => /deploy|production|pm2|cpanel|public_html/i.test(msg),
    log: () => console.error(
      '🚀 DEPLOY NOTIFICATION: Claude is working on deployment tasks. ' +
      'Verify server/.env is set correctly on the production server before proceeding.'
    ),
  },

  // 4. Flag any notification about database operations
  {
    match: () => /database|mongodb|mongoose|seed|drop/i.test(msg),
    log: () => console.error(
      '🗄️  DATABASE NOTIFICATION: Claude is performing a database operation. ' +
      'Confirm you are on the correct environment (local vs Atlas cluster).'
    ),
  },

  // 5. Catch notifications about installing packages
  {
    match: () => /npm install|yarn add|installing/i.test(msg),
    log: () => console.error(
      '📦 PACKAGE NOTIFICATION: Claude is installing packages. ' +
      'Verify no deprecated packages (react-hot-toast) or duplicate HTTP clients are being added.'
    ),
  },

];

// ─── Runner ───────────────────────────────────────────────────────────────────

for (const watcher of watchers) {
  try {
    if (watcher.match()) watcher.log();
  } catch (_) {}
}

// Notification hooks are always advisory — never block
process.exit(0);