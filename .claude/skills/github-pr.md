---
name: github-pr
description: Use this skill when creating a pull request, writing a PR description, preparing a feature branch for review, or summarizing changes made during a session. Trigger it at the end of any feature or fix work before pushing to the main branch.
---

# Skill: GitHub Pull Request — B2B Standard

## Before you start

Run the `frontend-scout` subagent on any pages you changed to confirm no convention violations exist before the PR goes up. Run `auth-guard-checker` if any routes were added or modified.

---

## Step 1 — Branch Naming

```bash
# Feature
git checkout -b feat/short-description
# e.g. feat/add-sponsors-module, feat/chatbot-partner-context

# Bug fix
git checkout -b fix/short-description
# e.g. fix/gallery-cover-not-saving

# Content / CMS
git checkout -b content/short-description
# e.g. content/add-hero-subtitle-key

# Chore / refactor
git checkout -b chore/short-description
# e.g. chore/remove-react-hot-toast
```

---

## Step 2 — Pre-PR Checklist (run before committing)

**Backend:**
- [ ] `npm start` runs without errors from `server/`
- [ ] No `.env` or `.env.local` files staged — check with `git status`
- [ ] New routes have correct middleware (`authMiddleware`, `roleMiddleware`)
- [ ] Activity logging added to all mutating actions
- [ ] Image fields store Cloudinary URL strings — not binary

**Frontend:**
- [ ] `npm run build` completes without errors from `client/`
- [ ] No `react-hot-toast` imports — custom `ToastNotification` only
- [ ] No hardcoded hex colors — CSS tokens from `index.css`
- [ ] No raw `fetch` or standalone `axios` — everything through `api.js`
- [ ] Toast on every success and error state
- [ ] Icons from `react-icons` HiOutline — no emojis

**Both:**
- [ ] No `console.log` statements left in production code
- [ ] No commented-out code blocks

---

## Step 3 — Commit Message Format

```
type(scope): short description

# Types: feat | fix | content | chore | refactor | docs
# Scope: backend | frontend | auth | chatbot | db | ui

# Examples:
feat(backend): add sponsors CRUD routes and controller
feat(frontend): add sponsors tab to admin dashboard
fix(backend): clean up multer temp file after cloudinary upload
content(db): add hero_subtitle sitecontent key
chore(frontend): remove react-hot-toast, use custom toast system
```

---

## Step 4 — PR Description Template

Use this template when opening the PR on GitHub:

```md
## What does this PR do?
<!-- One paragraph. What feature or fix does this introduce? -->

## Changes made
<!-- Backend -->
- 

<!-- Frontend -->
- 

## How to test
1. 
2. 
3. 

## Checklist
- [ ] `npm start` works (backend)
- [ ] `npm run build` works (frontend)
- [ ] No `.env` files committed
- [ ] Follows toast, icon, color, and api.js conventions
- [ ] Activity logging added for mutating actions (if applicable)
- [ ] No console.log left in code

## Screenshots (if UI changed)
<!-- Paste before/after screenshots here -->

## Related issue
<!-- Closes #issue_number (if applicable) -->
```

---

## Step 5 — What NOT to put in a PR

- Do not commit `server/.env` or `client/.env.local` — both are in `.gitignore`
- Do not open a PR directly to `main` for large features — use a `dev` or `staging` branch first
- Do not include unrelated fixes in the same PR — one concern per PR
- Do not merge your own PR without a second review if the team has more than one developer