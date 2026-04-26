<p align="center">
  <img src="https://img.shields.io/badge/status-production--ready-00C896?style=for-the-badge&labelColor=0D1120" alt="Status" />
  <img src="https://img.shields.io/badge/version-4.0-5B5FEF?style=for-the-badge&labelColor=0D1120" alt="Version" />
  <img src="https://img.shields.io/badge/node-20+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white&labelColor=0D1120" alt="Node" />
  <img src="https://img.shields.io/badge/react-19-61DAFB?style=for-the-badge&logo=react&logoColor=black&labelColor=0D1120" alt="React" />
  <img src="https://img.shields.io/badge/express-5-ffffff?style=for-the-badge&logo=express&logoColor=black&labelColor=0D1120" alt="Express" />
  <img src="https://img.shields.io/badge/mongodb-atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white&labelColor=0D1120" alt="MongoDB" />
  <img src="https://img.shields.io/badge/license-All%20Rights%20Reserved-EF4444?style=for-the-badge&labelColor=0D1120" alt="License" />
</p>

<br/>

<div align="center">

```
╔══════════════════════════════════════════════════════╗
║                                                      ║
║   ██████╗ ██╗   ██╗ ██████╗ ██████╗ ██████╗         ║
║   ██╔══██╗██║   ██║██╔════╝ ╚════██╗██╔══██╗        ║
║   ██████╔╝██║   ██║██║  ███╗ █████╔╝██████╔╝        ║
║   ██╔══██╗██║   ██║██║   ██║██╔═══╝ ██╔══██╗        ║
║   ██████╔╝╚██████╔╝╚██████╔╝███████╗██████╔╝        ║
║   ╚═════╝  ╚═════╝  ╚═════╝ ╚══════╝╚═════╝         ║
║                                                      ║
║         Community Platform  ·  v4.0                  ║
╚══════════════════════════════════════════════════════╝
```

</div>

<p align="center">
  <strong>A fully dynamic, CMS-driven community platform where admins manage<br/>100% of site content from a browser dashboard — zero code changes post-deploy.</strong>
</p>

<p align="center">
  Built on the <strong>MERN stack</strong> · Powered by <strong>LLaMA 3 via Groq</strong> · Secured with <strong>JWT + bcrypt</strong>
</p>

<br/>

<p align="center">
  <a href="https://bug2build.in"><strong>🌐 Live Site</strong></a>
  &nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="https://api.bug2build.in/api/health"><strong>📡 API Health</strong></a>
  &nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="#-quick-start"><strong>🚀 Quick Start</strong></a>
  &nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="#-api-reference"><strong>🔌 API Docs</strong></a>
</p>

---

## ✦ What is Bug2Build?

Bug2Build is a production-ready, content-managed community platform built for developer communities. Every section — events, team, partners, contributors, chatbot context, and all page copy — is editable from a secure admin dashboard with no redeployments needed.

> Admins log in, make changes, and the live site updates instantly. Developers never touch production again.

---

## ✨ Feature Highlights

<table>
<tr>
<td width="50%">

**🖥️ Content Management**
- 100% CMS-driven — zero code post-deploy
- Key-value `SiteContent` store for all page text
- Rich event management with multi-image galleries
- Cover selection + drag-and-drop image ordering

</td>
<td width="50%">

**🤖 AI Chatbot**
- LLaMA 3 70B via Groq API
- Site-aware: live DB context injected per query
- Full-page `/chat` route + floating widget
- Graceful offline fallback

</td>
</tr>
<tr>
<td width="50%">

**🔐 Auth & Roles**
- JWT + bcrypt (salt: 12) authentication
- `admin` / `superadmin` role-based guards
- No public signup — accounts created by SuperAdmin only
- Activity audit trail on all mutating actions

</td>
<td width="50%">

**🎨 Premium UI**
- 3D mouse-tracking login card with particle background
- Glassmorphic floating navbar with animated pill indicator
- Two-phase loader: 3D CSS cube → shimmer skeleton
- Custom toast system (4 types, progress bars, glassmorphic)

</td>
</tr>
<tr>
<td width="50%">

**🛡️ Security**
- Helmet CSP (Cloudinary + Google Fonts whitelisted)
- Rate limiting on all sensitive endpoints
- `express-validator` input sanitization
- Multer MIME-type enforcement for uploads

</td>
<td width="50%">

**🌗 UX Polish**
- Dark / Light mode with `localStorage` persistence
- Keyboard-navigable image gallery on event pages
- Framer Motion micro-animations throughout
- Fully responsive across all breakpoints

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

### Backend

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^5.2 | HTTP server & routing |
| `mongoose` | ^9.5 | MongoDB ODM |
| `bcryptjs` | ^3.0 | Password hashing (salt rounds: 12) |
| `jsonwebtoken` | ^9.0 | JWT authentication (7-day expiry) |
| `multer` | ^2.1 | File upload handling |
| `cloudinary` | ^1.41 | Image CDN hosting |
| `groq-sdk` | ^1.1 | LLaMA 3 AI inference |
| `helmet` | ^8.1 | Security headers + CSP |
| `express-rate-limit` | ^8.3 | Endpoint rate limiting |
| `express-validator` | ^7.3 | Input validation & sanitization |
| `nodemailer` | ^8.0 | SMTP email sending |
| `compression` | ^1.8 | Gzip response compression |
| `morgan` | ^1.10 | HTTP request logging |
| `cors` | ^2.8 | CORS header management |
| `he` | ^1.2 | HTML entity decoding |
| `vitest` | ^4.1 | Testing framework *(dev)* |
| `supertest` | ^7.2 | HTTP assertion testing *(dev)* |

### Frontend

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.2 | UI framework |
| `vite` | ^8.0 | Build tool & dev server |
| `react-router-dom` | ^7.13 | Routing + protected route guards |
| `axios` | ^1.13 | HTTP client with JWT interceptor |
| `framer-motion` | ^12.38 | Animations & 3D transforms |
| `tailwindcss` | ^3.4 | Utility-first CSS |
| `react-icons` | ^5.6 | Icon library (HiOutline set) |
| `react-dropzone` | ^15.0 | Drag-and-drop image uploads |
| `react-markdown` | ^10.1 | Chatbot markdown rendering |
| `react-type-animation` | ^3.2 | Typewriter text effect |
| `@dnd-kit/core` | ^6.3 | Drag-and-drop framework |
| `@dnd-kit/sortable` | ^10.0 | Sortable list interactions |

---

## 📋 Prerequisites

| Tool | Minimum Version | Notes |
|------|----------------|-------|
| **Node.js** | 18+ *(20 LTS recommended)* | Required |
| **npm** | 9+ | Required |
| **MongoDB Atlas** | Free tier or higher | Required |
| **Cloudinary** | Free account | Required |
| **Groq API Key** | — | Free at [console.groq.com](https://console.groq.com) |
| **Git** | 2.x+ | Required |

---

## 🚀 Quick Start

```bash
# ── 1. Clone ──────────────────────────────────────────
git clone https://github.com/Bug2Build-code/B2B.git
cd B2B

# ── 2. Install dependencies ───────────────────────────
cd server && npm install
cd ../client && npm install

# ── 3. Configure environment ──────────────────────────
cd ../server
cp .env.example .env
# Edit .env and fill in all required values (see Configuration below)

# ── 4. Create client environment ──────────────────────
echo "VITE_API_URL=http://localhost:5000" > ../client/.env.local

# ── 5. Seed the database (run once) ───────────────────
node scripts/seed.js
# Creates SuperAdmin account + populates all SiteContent keys

# ── 6. Start dev servers ──────────────────────────────

# Terminal 1 — Backend (Express on :5000)
cd server && npm run dev

# Terminal 2 — Frontend (Vite on :5173)
cd client && npm run dev
```

### Available Scripts

**Server** (`server/`)

```bash
npm start        # Production server (node server.js)
npm run dev      # Development with nodemon auto-reload
npm run seed     # Seed DB with SuperAdmin + CMS defaults
npm test         # Run test suite (vitest)
```

**Client** (`client/`)

```bash
npm run dev      # Vite dev server with HMR
npm run build    # Production build → client/dist/
npm run preview  # Preview production build locally
```

---

## ⚙️ Configuration

### Server — `server/.env`

| Variable | Required | Description |
|----------|:--------:|-------------|
| `NODE_ENV` | — | `development` or `production` |
| `PORT` | — | Server port *(default: 5000)* |
| `MONGO_URI` | ✅ | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ | 64-byte random hex secret for signing JWTs |
| `CLOUDINARY_CLOUD_NAME` | ✅ | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✅ | Cloudinary API secret |
| `CLIENT_URL` | ✅ | Frontend origin for CORS *(e.g. `http://localhost:5173`)* |
| `GROQ_API_KEY` | ✅ | Groq API key — **server-side only, never in client bundle** |
| `SMTP_HOST` | — | SMTP server *(default: `smtp.gmail.com`)* |
| `SMTP_PORT` | — | SMTP port *(default: `465`)* |
| `SMTP_USER` | — | SMTP email address |
| `SMTP_PASS` | — | SMTP app password |
| `PARTNERSHIP_EMAIL` | — | Recipient for partnership form inquiries |
| `SUPERADMIN_EMAIL` | ✅ | SuperAdmin login email *(used by seed script)* |
| `SUPERADMIN_PASSWORD` | ✅ | SuperAdmin password *(used by seed script)* |

Generate a secure `JWT_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Client — `client/.env.local`

| Variable | Required | Description |
|----------|:--------:|-------------|
| `VITE_API_URL` | ✅ | Backend API URL *(e.g. `http://localhost:5000`)* |

> ⚠️ **Never commit `.env` or `.env.local`** — both are in `.gitignore`.

---

## 📁 Project Structure

```
B2B/
├── .claude/                          # AI assistant configuration
│   ├── settings.json                 # Hook registration
│   ├── hooks/                        # Convention enforcement scripts
│   │   ├── pre-tool-use.js           # Blocks dangerous commands
│   │   ├── post-tool-use.js          # Audits code for violations
│   │   ├── user-prompt-submit.js     # Filters unsafe prompts
│   │   ├── notification.js           # Build/DB event alerts
│   │   └── stop.js                   # Session-end checklist
│   ├── agents/                       # Specialized analysis subagents
│   │   ├── api-mapper.md             # Route surface analysis
│   │   ├── auth-guard-checker.md     # Auth pattern verification
│   │   ├── cloudinary-upload-checker.md
│   │   ├── db-explorer.md            # Schema & data flow analysis
│   │   └── frontend-scout.md        # Component tree analysis
│   └── skills/                       # Reusable task templates
│       ├── add-admin-module.md       # New CRUD module guide
│       ├── add-sitecontent-key.md    # New CMS key guide
│       ├── github-pr.md              # PR workflow & checklist
│       └── groq-chatbot-context.md  # Chatbot extension guide
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                    # Tests + client build on push/PR
│   │   ├── deploy.yml                # cPanel + PM2 deploy via SSH
│   │   ├── lint.yml                  # Convention enforcement on PRs
│   │   └── dependency-review.yml    # Vulnerability scan on PRs
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.yml
│   │   ├── feature_request.yml
│   │   └── config.yml
│   ├── PULL_REQUEST_TEMPLATE.md     # 12-item PR checklist
│   ├── CONTRIBUTING.md
│   ├── CODE_OF_CONDUCT.md
│   ├── SECURITY.md
│   ├── SUPPORT.md
│   ├── CODEOWNERS
│   └── dependabot.yml               # Weekly dependency updates
│
├── server/
│   ├── server.js                    # Express entry point
│   ├── .env.example
│   ├── config/
│   │   ├── db.js                    # MongoDB Atlas connection
│   │   └── cloudinary.js
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verification
│   │   ├── roleMiddleware.js        # Role-based route guards
│   │   ├── activityLogger.js        # Audit trail logging
│   │   ├── rateLimiters.js
│   │   └── errorHandler.js          # Centralized error responses
│   ├── models/                      # 10 Mongoose schemas
│   │   ├── User.js                  # Admin / SuperAdmin accounts
│   │   ├── Event.js                 # Events + gallery sub-documents
│   │   ├── TeamMember.js
│   │   ├── Partner.js
│   │   ├── Brand.js
│   │   ├── Contributor.js
│   │   ├── SiteContent.js           # Key-value CMS store
│   │   ├── ContactSubmission.js
│   │   ├── ActivityLog.js
│   │   └── ChatSession.js
│   ├── controllers/                 # 11 controllers
│   ├── routes/
│   │   ├── authRoutes.js            # POST /api/auth/login
│   │   ├── publicRoutes.js          # Public GETs + POSTs
│   │   ├── adminRoutes.js           # Admin CRUD (JWT)
│   │   ├── superAdminRoutes.js      # SuperAdmin mgmt (JWT + role)
│   │   └── chatRoutes.js            # POST /api/chat
│   └── scripts/
│       └── seed.js
│
└── client/
    └── src/
        ├── App.jsx                  # Router + provider tree
        ├── main.jsx
        ├── index.css                # Design system (CSS custom properties)
        ├── components/common/
        │   ├── Navbar.jsx           # Floating glassmorphic nav
        │   ├── Footer.jsx
        │   ├── B2BLoader.jsx        # 3D cube loader
        │   ├── SkeletonLoader.jsx   # Shimmer skeletons
        │   ├── ProtectedRoute.jsx   # JWT + role route guard
        │   ├── AIChatbot.jsx        # Floating chat widget
        │   ├── ToastNotification.jsx
        │   └── ErrorBoundary.jsx
        ├── context/
        │   ├── AuthContext.jsx
        │   ├── ThemeContext.jsx
        │   └── LoaderContext.jsx
        ├── pages/                   # 13 pages
        └── services/
            └── api.js               # Axios instance + JWT interceptor
```

---

## 🖥️ Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | **Home** | Hero with typewriter, timeline, events grid, team preview, partners marquee, stats |
| `/about` | **About** | Mission & vision cards, animated scroll sections |
| `/events` | **Events** | Cards with status badges, search, and filters |
| `/events/:id` | **Event Detail** | Full page with keyboard-navigable image gallery |
| `/team` | **Team** | Category-filtered grid with animated avatar rings |
| `/contributors` | **Contributors** | GitHub-linked contributor cards |
| `/partnership` | **Partnership** | Benefits grid + inquiry form |
| `/contact` | **Contact** | Contact cards + message form with Google Maps |
| `/chat` | **AI Chat** | Full-page chatbot interface |
| `/login` | **Login** | 3D tilt card with particle background |
| `/admin` | **Admin** | 7-module CRUD dashboard *(JWT required)* |
| `/superadmin` | **SuperAdmin** | 5-module management panel *(JWT + superadmin role)* |
| `*` | **404** | Branded not-found page |

---

## 🔌 API Reference

### Public Endpoints

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|:----------:|
| `GET` | `/api/content/:key` | Get a site content value | — |
| `GET` | `/api/content/bulk?keys=...` | Get multiple values in one call | — |
| `GET` | `/api/events` | All published events (paginated) | — |
| `GET` | `/api/events/:id` | Single event with gallery | — |
| `GET` | `/api/team` | All active team members | — |
| `GET` | `/api/partners` | All partner logos | — |
| `GET` | `/api/brands` | All brand logos | — |
| `GET` | `/api/contributors` | All contributors | — |
| `POST` | `/api/contact` | Submit contact form | 5 / 15 min |
| `POST` | `/api/partnership` | Submit partnership inquiry | 3 / 15 min |
| `POST` | `/api/chat` | AI chatbot message | 20 / min |
| `GET` | `/api/health` | API health check | — |

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Login → returns JWT *(5 attempts / 15 min)* |

### Admin Endpoints *(JWT required)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/events` | All events including unpublished |
| `POST` | `/api/admin/events` | Create event with gallery upload |
| `PUT` | `/api/admin/events/:id` | Update event |
| `DELETE` | `/api/admin/events/:id` | Delete event + all Cloudinary images |
| `DELETE` | `/api/admin/events/:id/images/:imageId` | Remove single gallery image |
| `PUT` | `/api/admin/events/:id/cover` | Set gallery cover image |
| `GET/POST/PUT/DELETE` | `/api/admin/team[/:id]` | Team CRUD + photo upload |
| `GET/POST/PUT/DELETE` | `/api/admin/partners[/:id]` | Partners CRUD + logo upload |
| `GET/POST/PUT/DELETE` | `/api/admin/brands[/:id]` | Brands CRUD + logo upload |
| `GET/POST/PUT/DELETE` | `/api/admin/contributors[/:id]` | Contributors CRUD |
| `GET` | `/api/admin/contacts` | Contact submissions (paginated) |
| `PATCH` | `/api/admin/contacts/:id/read` | Toggle read/unread status |
| `PUT` | `/api/admin/profile` | Update own profile + photo |

### SuperAdmin Endpoints *(JWT + superadmin role)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/superadmin/admins` | List all admin accounts |
| `POST` | `/api/superadmin/admins` | Create new admin |
| `PUT` | `/api/superadmin/admins/:id` | Edit admin details |
| `DELETE` | `/api/superadmin/admins/:id` | Delete admin account |
| `PATCH` | `/api/superadmin/admins/:id/password` | Reset admin password |
| `PATCH` | `/api/superadmin/admins/:id/activate` | Toggle active/suspended |
| `GET` | `/api/superadmin/content` | All SiteContent keys |
| `PUT` | `/api/superadmin/content/:key` | Update site text value |
| `GET` | `/api/superadmin/logs` | Activity audit logs (paginated) |

---

## 🔐 Auth & Security

### Role System

| Role | Access Level | Created By |
|------|-------------|------------|
| `superadmin` | Full access — content, admins, logs, chatbot config | Seed script only |
| `admin` | Events, Team, Partners, Brands, Contributors, own profile | SuperAdmin via dashboard |

> **No public signup.** All admin accounts are created exclusively by the SuperAdmin from the dashboard.

### Security Layers

- **Passwords** hashed with `bcryptjs` at salt rounds: 12
- **JWTs** expire in 7 days, stored client-side in `localStorage`
- **Helmet** configured with a strict CSP (Cloudinary + Google Fonts whitelisted)
- **CORS** restricted to the `CLIENT_URL` environment variable
- **Rate limiting** on all auth and form submission endpoints
- **Input validation** via `express-validator` on every mutating route
- **Multer** restricted to image MIME types — no arbitrary file uploads
- **Groq API key** is server-side only and never included in the client bundle
- **Activity logging** records every admin action for the audit trail
- **Graceful shutdown** handles `SIGTERM`/`SIGINT` cleanly

---

## 🤖 AI Chatbot Architecture

**Model:** `llama3-70b-8192` via Groq API

```
User message
  └─→ POST /api/chat
        └─→ Fetch live context from DB
        │     · Upcoming events
        │     · Active team members
        │     · SiteContent key: chatbot_system_context
        └─→ Inject context into system prompt
        └─→ groq.chat.completions.create()
        └─→ Markdown response
              └─→ Rendered via react-markdown in client
```

> If the Groq API is unreachable, the chatbot responds with a friendly offline message — no unhandled errors.

---

## 🎨 Design System

Dual-mode CSS custom properties defined in `client/src/index.css`:

| Token | Dark Mode | Light Mode | Usage |
|-------|-----------|------------|-------|
| `--bg-primary` | `#080B14` | `#F8FAFC` | Page background |
| `--bg-surface` | `#0D1120` | `#FFFFFF` | Cards, panels |
| `--accent-primary` | `#5B5FEF` | `#4F46E5` | Buttons, CTAs |
| `--accent-blue` | `#00C2FF` | `#0284C7` | Highlights, links |
| `--text-primary` | `#F1F5F9` | `#0F172A` | Body text |
| `--text-secondary` | `#94A3B8` | `#64748B` | Muted text, labels |

**Typography:** `Outfit` (headings) + `Inter` (body) — Google Fonts

**UI Patterns:** Glassmorphism (`backdrop-filter: blur(28px)`), gradient headings, CSS 3D perspective transforms, Framer Motion micro-animations throughout

---

## 🧪 Testing

```bash
# Run the full test suite
cd server && npm test

# Run with coverage report
cd server && npx vitest run --coverage

# Run a specific test file
cd server && npx vitest run tests/auth.test.js
```

The server uses **Vitest** with **Supertest** for HTTP integration testing.

---

## 📤 Deployment

| Service | URL |
|---------|-----|
| Frontend | [https://bug2build.in](https://bug2build.in) |
| Backend | [https://api.bug2build.in](https://api.bug2build.in) |

### Frontend (cPanel)

```bash
cd client && npm run build    # Output → client/dist/
# Upload dist/ contents to public_html
```

Add `.htaccess` for SPA client-side routing:
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

### Backend (cPanel + PM2)

```bash
npm install --production
pm2 start server.js --name b2b-api
pm2 save
```

### CI/CD via GitHub Actions

| Workflow | Trigger | Action |
|----------|---------|--------|
| `ci.yml` | Push / PR to any branch | Run server tests + build client |
| `deploy.yml` | Push to `main` | Deploy to production via SSH |
| `lint.yml` | PR | Enforce code conventions (console.log, react-hot-toast, etc.) |
| `dependency-review.yml` | PR | Flag vulnerable package versions |

---

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](.github/CONTRIBUTING.md) for the full workflow.

**Quick steps:**

1. Fork the repository
2. Create your branch: `git checkout -b feat/your-feature`
3. Follow the [code conventions](CLAUDE.md)
4. Commit with [Conventional Commits](https://www.conventionalcommits.org/): `feat(frontend): add sponsor carousel`
5. Open a PR using the [PR template](.github/PULL_REQUEST_TEMPLATE.md)

### Code Conventions

| Rule | Detail |
|------|--------|
| HTTP calls | Always via `client/src/services/api.js` — no raw `fetch()` |
| Notifications | Custom `ToastNotification` only — no `react-hot-toast` |
| Colors | CSS custom property tokens only — no hardcoded hex values |
| Icons | `react-icons` HiOutline set — no emojis in UI |
| Images | Cloudinary URLs only — no binary/base64 in MongoDB |
| AI keys | Groq key stays server-side — never in client bundle |

See [SECURITY.md](.github/SECURITY.md) for vulnerability reporting.

---

## 📄 License

**All Rights Reserved © Bug2Build**

---

<div align="center">

**Bug2Build Community Platform · v4.0**

*Built with care for the Bug2Build community*

[🌐 bug2build.in](https://bug2build.in) · [📡 API Status](https://api.bug2build.in/api/health)

</div>
