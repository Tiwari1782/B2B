# Bug2Build — Community Platform

Full-stack MERN app. CMS-driven — all content managed from admin dashboard, zero code changes post-deploy.

For full project context: @README.md

---

## Commands

```bash
# Install 
cd server && npm install
cd client && npm install

# Dev (run in separate terminals)
cd server && npm run dev       # Express on :5000
cd client && npm run dev       # Vite on :5173

# Seed DB (once on fresh setup)
cd server && node scripts/seed.js

# Production — always verify this works before handoff
cd server && npm start
```

---

## Stack

- **Backend:** Express 5, Mongoose, JWT + bcrypt, Cloudinary, Groq SDK
- **Frontend:** React 19, Vite, Tailwind, Framer Motion, Axios
- **Auth:** Two roles only — `admin` and `superadmin`. No public signup.

---

## Code Style

- All frontend HTTP calls go through `client/src/services/api.js` — never raw `fetch` or standalone `axios`
- Use CSS custom property tokens from `index.css` — never hardcode hex colors
- Animations via Framer Motion — not raw CSS `@keyframes` for interactive elements
- Icons via `react-icons` HiOutline set — no emojis in UI

---

## Critical Conventions

**Toasts:** Use the custom system — NOT `react-hot-toast` (still in package.json but deprecated):
```js
import toast from '../components/common/ToastNotification';
toast.success('Done!');
toast.error('Something went wrong.');
toast.warning('Check this field.');
toast.info('FYI...');
```

**Images:** Always Cloudinary via Multer. Never store binary data in MongoDB.

**Groq API key:** Server-side only. Never expose to client bundle.

**CORS:** Restricted to `CLIENT_URL` env var. Do not open to `*`.

---

## Environment

```bash
# server/.env  (never commit)
MONGO_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLIENT_URL=
GROQ_API_KEY=
PORT=5000

# client/.env.local  (never commit)
VITE_API_URL=http://localhost:5000
```

---

## Subagents

Before exploring the codebase yourself, delegate to the appropriate subagent to keep the main context clean:

| Task | Subagent |
|------|----------|
| Schema, model fields, DB relationships | `db-explorer` |
| Route existence, middleware chain, API surface | `api-mapper` |
| Frontend page structure, component tree, data fetching | `frontend-scout` |
| JWT, role guards, protected routes, auth bugs | `auth-guard-checker` |
| Any image upload or Cloudinary feature | `cloudinary-upload-checker` |

---

## Skills

Load the matching skill before writing any multi-step code:

| Task | Skill |
|------|-------|
| Adding a new content type with admin CRUD | `add-admin-module` |
| Adding a new piece of editable site text | `add-sitecontent-key` |
| Modifying or extending the AI chatbot | `groq-chatbot-context` |
| Opening a PR or preparing a branch for review | `github-pr` |

## IMPORTANT

Run `cd client && npm run build` to verify a clean production build before committing. Always run the server and client separately, and update README.md after any significant change.