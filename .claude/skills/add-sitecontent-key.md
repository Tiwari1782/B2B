---
name: add-sitecontent-key
description: Use this skill when adding a new piece of editable site text that admins or superadmins should be able to change without touching code. Examples include hero text, section subtitles, chatbot prompts, or any CMS-managed string.
---

# Skill: Add a New SiteContent Key

SiteContent is the key-value CMS store. All editable text lives here — never hardcoded in components.

## Before you start

Run the `db-explorer` subagent and ask it to list all existing SiteContent keys from `seed.js` so you don't create a duplicate.

---

## Step 1 — Add to Seed Script

In `server/scripts/seed.js`, add a new upsert entry:

```js
await SiteContent.findOneAndUpdate(
  { key: 'your_new_key' },
  { key: 'your_new_key', value: 'Default value here' },
  { upsert: true, new: true }
);
```

**Key naming rules:**
- `snake_case` only
- Descriptive and section-scoped (e.g., `hero_subtitle`, `about_mission_text`, `contact_email`)
- Never reuse or rename existing keys — SuperAdmins may have already customised them

---

## Step 2 — Re-run Seed

```bash
cd server && node scripts/seed.js
```

The seed uses upsert — it will **not** overwrite values already edited by admins in production.

---

## Step 3 — Fetch in Frontend

Single key:
```js
// api.js baseURL already includes /api, so paths here are relative to that
const res = await api.get('/content/your_new_key');
const value = res.data.value;
```

Multiple keys in one request (preferred — fewer round trips):
```js
const res = await api.get('/content/bulk?keys=hero_title,hero_subtitle,your_new_key');
```

---

## Step 4 — SuperAdmin Dashboard (automatic)

The SuperAdmin Content Editor reads all SiteContent keys via `GET /api/superadmin/content`. No additional wiring needed — the new key appears in the dashboard immediately after seeding.

---

## Checklist

- [ ] Key is `snake_case` and unique — checked against existing seed entries
- [ ] Default value is meaningful (not empty or placeholder)
- [ ] Seed re-run locally to confirm upsert works
- [ ] Frontend fetches via `api.js` — not raw fetch
- [ ] Using bulk fetch if pulling multiple keys on the same page