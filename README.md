<p align="center">
  <img src="https://img.shields.io/badge/status-production--ready-brightgreen?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/version-4.0-blue?style=for-the-badge" alt="Version" />
  <img src="https://img.shields.io/badge/node-20+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node" />
  <img src="https://img.shields.io/badge/react-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/express-5-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/mongodb-atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/license-All%20Rights%20Reserved-red?style=for-the-badge" alt="License" />
</p>

# 🐛 Bug2Build — Community Platform

> A fully dynamic, CMS-driven community website where **Admins and SuperAdmins manage 100% of site content from a browser dashboard — zero code changes needed after deployment.** Built on the MERN stack with an AI-powered chatbot (Groq/LLaMA 3), premium glassmorphic UI, 3D login effects, and a robust role-based access system.

---

## ✨ Features

| Category | Highlights |
|----------|-----------|
| **100% CMS-Driven** | Every piece of content managed from the admin panel — zero code changes post-deploy |
| **AI Chatbot** | Groq/LLaMA 3 site-aware assistant with live database context injection |
| **Role-Based Access** | JWT + bcrypt auth with admin/superadmin route guards, no public signup |
| **3D Login Page** | Mouse-tracking tilt card, floating particles, rotating conic border glow |
| **Custom Toast System** | Glassmorphic notifications with progress bars, 4 types (success/error/warning/info) |
| **Two-Phase Loader** | 3D CSS cube animation → page-specific shimmer skeleton transition |
| **Dark / Light Mode** | Full theme toggle with `localStorage` persistence |
| **Floating Glassmorphic Navbar** | Animated pill indicator, blur backdrop, admin shield button |
| **Multi-Image Gallery** | Drag-and-drop uploads with cover selection per event |
| **Security Hardened** | Helmet CSP, rate limiting, input sanitization, activity audit trail |

---

## 🛠 Tech Stack

### Backend

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^5.2 | HTTP server & routing |
| `mongoose` | ^9.5 | MongoDB ODM |
| `bcryptjs` | ^3.0 | Password hashing (salt: 12) |
| `jsonwebtoken` | ^9.0 | JWT authentication |
| `multer` | ^2.1 | File upload handling |
| `cloudinary` | ^1.41 | Image hosting CDN |
| `groq-sdk` | ^1.1 | LLaMA 3 AI inference |
| `helmet` | ^8.1 | Security headers + CSP |
| `express-rate-limit` | ^8.3 | Rate limiting |
| `express-validator` | ^7.3 | Input validation |
| `nodemailer` | ^8.0 | Email sending (SMTP) |
| `compression` | ^1.8 | Gzip response compression |
| `morgan` | ^1.10 | HTTP request logging |
| `cors` | ^2.8 | CORS headers |
| `he` | ^1.2 | HTML entity decoding |
| `vitest` | ^4.1 | Testing framework (dev) |
| `supertest` | ^7.2 | HTTP assertion testing (dev) |

### Frontend

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.2 | UI framework |
| `vite` | ^8.0 | Build tool & dev server |
| `react-router-dom` | ^7.13 | Routing + protected routes |
| `axios` | ^1.13 | HTTP client with JWT interceptor |
| `framer-motion` | ^12.38 | Animations & 3D transforms |
| `tailwindcss` | ^3.4 | Utility-first CSS |
| `react-icons` | ^5.6 | Icon library (HiOutline set) |
| `react-dropzone` | ^15.0 | Drag-and-drop image upload |
| `react-markdown` | ^10.1 | Chatbot markdown rendering |
| `react-type-animation` | ^3.2 | Typewriter effect |
| `@dnd-kit/core` | ^6.3 | Drag-and-drop framework |
| `@dnd-kit/sortable` | ^10.0 | Sortable list interactions |

---

## 📋 Prerequisites

| Tool | Version | Required |
|------|---------|----------|
| **Node.js** | 18+ (20 LTS recommended) | ✅ |
| **npm** | 9+ | ✅ |
| **MongoDB Atlas** | Free tier or higher | ✅ |
| **Cloudinary** | Free account | ✅ |
| **Groq API Key** | Free at [console.groq.com](https://console.groq.com) | ✅ |
| **Git** | 2.x+ | ✅ |

---

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Bug2Build-code/B2B.git
cd B2B

# 2. Install dependencies (server + client)
cd server && npm install
cd ../client && npm install

# 3. Configure environment
cd ../server
cp .env.example .env
# Fill in all values — see the Configuration section below

# 4. Create client environment
echo "VITE_API_URL=http://localhost:5000" > ../client/.env.local

# 5. Seed the database (run once)
node scripts/seed.js
# Creates the SuperAdmin account + populates SiteContent keys

# 6. Start dev servers (two terminals)

# Terminal 1 — Backend (Express on :5000)
cd server && npm run dev

# Terminal 2 — Frontend (Vite on :5173)
cd client && npm run dev
```

### Available Scripts

#### Server (`server/`)
```bash
npm start        # Production server (node server.js)
npm run dev      # Development server (nodemon with auto-reload)
npm run seed     # Seed database with SuperAdmin + CMS keys
npm test         # Run test suite (vitest)
```

#### Client (`client/`)
```bash
npm run dev      # Vite dev server with HMR
npm run build    # Production build → client/dist/
npm run preview  # Preview production build locally
```

---

## ⚙️ Configuration

### Server environment variables (`server/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | No | `development` | `development` or `production` |
| `PORT` | No | `5000` | Server port |
| `MONGO_URI` | **Yes** | — | MongoDB Atlas connection string |
| `JWT_SECRET` | **Yes** | — | Secret for signing JWTs (generate with `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`) |
| `CLOUDINARY_CLOUD_NAME` | **Yes** | — | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | **Yes** | — | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | **Yes** | — | Cloudinary API secret |
| `CLIENT_URL` | **Yes** | `http://localhost:5173` | Frontend origin for CORS |
| `GROQ_API_KEY` | **Yes** | — | Groq API key for LLaMA 3 chatbot |
| `SMTP_HOST` | No | `smtp.gmail.com` | SMTP server for emails |
| `SMTP_PORT` | No | `465` | SMTP port |
| `SMTP_USER` | No | — | SMTP email address |
| `SMTP_PASS` | No | — | SMTP app password |
| `PARTNERSHIP_EMAIL` | No | — | Recipient for partnership inquiries |
| `SUPERADMIN_EMAIL` | **Yes** | `superadmin@bug2build.in` | SuperAdmin login email (for seed) |
| `SUPERADMIN_PASSWORD` | **Yes** | — | SuperAdmin password (for seed) |

### Client environment variables (`client/.env.local`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | **Yes** | — | Backend API URL (e.g., `http://localhost:5000`) |

> ⚠️ **Never commit `.env` or `.env.local`** — both are in `.gitignore`.

---

## 📁 Project Structure

```
B2B/
├── .claude/                              # AI assistant configuration
│   ├── settings.json                     # Hook registration (5 hooks)
│   ├── hooks/                            # Convention enforcement scripts
│   │   ├── pre-tool-use.js               # Blocks dangerous commands
│   │   ├── post-tool-use.js              # Audits code for violations
│   │   ├── user-prompt-submit.js         # Filters unsafe prompts
│   │   ├── notification.js               # Build/DB event alerts
│   │   └── stop.js                       # Session-end checklist
│   ├── agents/                           # Specialized analysis subagents
│   │   ├── api-mapper.md                 # Route surface analysis
│   │   ├── auth-guard-checker.md         # Auth pattern verification
│   │   ├── cloudinary-upload-checker.md  # Upload pattern review
│   │   ├── db-explorer.md               # Schema & data flow analysis
│   │   └── frontend-scout.md            # Component tree analysis
│   └── skills/                           # Reusable task templates
│       ├── add-admin-module.md           # New CRUD module guide
│       ├── add-sitecontent-key.md        # New CMS key guide
│       ├── github-pr.md                 # PR workflow & checklist
│       └── groq-chatbot-context.md      # Chatbot extension guide
├── .github/                              # GitHub configuration
│   ├── workflows/
│   │   ├── ci.yml                        # CI: test server + build client
│   │   ├── deploy.yml                    # Deploy: cPanel + PM2 via SSH
│   │   ├── lint.yml                      # Lint: grep-based convention checks
│   │   └── dependency-review.yml         # PR dependency vulnerability scan
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.yml                # Structured bug report form
│   │   ├── feature_request.yml           # Feature request form
│   │   └── config.yml                    # Disable blank issues
│   ├── PULL_REQUEST_TEMPLATE.md          # 12-item PR checklist
│   ├── CONTRIBUTING.md                   # Fork/branch/commit/PR guide
│   ├── CODE_OF_CONDUCT.md               # Contributor Covenant v2.1
│   ├── SECURITY.md                       # Vulnerability reporting policy
│   ├── SUPPORT.md                        # Help & support channels
│   ├── CODEOWNERS                        # Review ownership
│   ├── FUNDING.yml                       # Sponsorship config (disabled)
│   └── dependabot.yml                    # Weekly dependency updates
├── server/
│   ├── server.js                         # Express entry point
│   ├── .env.example                      # Environment template
│   ├── config/
│   │   ├── db.js                         # MongoDB Atlas connection
│   │   └── cloudinary.js                 # Cloudinary SDK config
│   ├── middleware/
│   │   ├── authMiddleware.js             # JWT verification
│   │   ├── roleMiddleware.js             # Role-based guards
│   │   ├── activityLogger.js             # Audit trail logging
│   │   ├── rateLimiters.js               # Endpoint rate limiters
│   │   └── errorHandler.js               # Centralized error responses
│   ├── models/                           # 10 Mongoose models
│   │   ├── User.js                       # Admin/SuperAdmin accounts
│   │   ├── Event.js                      # Events + gallery sub-docs
│   │   ├── TeamMember.js                 # Team with categories
│   │   ├── Partner.js                    # Partner logos
│   │   ├── Brand.js                      # Brand logos
│   │   ├── Contributor.js                # Open-source contributors
│   │   ├── SiteContent.js                # Key-value CMS store
│   │   ├── ContactSubmission.js          # Contact form entries
│   │   ├── ActivityLog.js                # Admin action audit
│   │   └── ChatSession.js               # Chatbot conversations
│   ├── controllers/                      # 11 controllers
│   ├── routes/
│   │   ├── authRoutes.js                 # POST /api/auth/login
│   │   ├── publicRoutes.js               # Public GET + POST
│   │   ├── adminRoutes.js                # Admin CRUD (JWT)
│   │   ├── superAdminRoutes.js           # SuperAdmin mgmt (JWT + role)
│   │   └── chatRoutes.js                 # POST /api/chat
│   ├── scripts/
│   │   └── seed.js                       # Database seeder
│   └── uploads/                          # Temp Multer storage → Cloudinary
├── client/
│   └── src/
│       ├── App.jsx                       # Router + provider tree
│       ├── main.jsx                      # React DOM entry
│       ├── index.css                     # Design system (CSS vars)
│       ├── components/common/
│       │   ├── Navbar.jsx                # Floating glassmorphic nav
│       │   ├── Footer.jsx                # Gradient footer
│       │   ├── B2BLoader.jsx             # 3D cube loader
│       │   ├── SkeletonLoader.jsx        # Shimmer skeletons
│       │   ├── ProtectedRoute.jsx        # JWT + role route guard
│       │   ├── AIChatbot.jsx             # Floating chat widget
│       │   ├── ToastNotification.jsx     # Custom toast system
│       │   └── ErrorBoundary.jsx         # React error boundary
│       ├── context/
│       │   ├── AuthContext.jsx           # JWT auth state
│       │   ├── ThemeContext.jsx          # Dark/light toggle
│       │   └── LoaderContext.jsx         # Two-phase loader
│       ├── pages/                        # 13 pages
│       └── services/
│           └── api.js                    # Axios instance + JWT interceptor
├── CLAUDE.md                             # AI convention rules
├── README.md                             # This file
└── .gitignore
```

---

## 🖥️ Live Pages

| Page | Route | Description |
|------|-------|-------------|
| **Home** | `/` | Hero with typewriter, journey timeline, events grid, team preview, partners marquee, brands grid, stats |
| **About** | `/about` | Mission, vision cards, animated scroll sections |
| **Events** | `/events` | Event cards with status badges, search, filters |
| **Event Detail** | `/events/:id` | Full event page with keyboard-navigable image gallery |
| **Team** | `/team` | Category-filtered grid with animated avatar rings |
| **Contributors** | `/contributors` | GitHub-linked contributor cards |
| **Partnership** | `/partnership` | Benefits grid + inquiry form |
| **Contact** | `/contact` | Contact info cards + message form with Google Maps |
| **AI Chat** | `/chat` | Full-page AI chatbot interface |
| **Login** | `/login` | 3D tilt card with particle background |
| **Admin** | `/admin` | 7-module CRUD dashboard (JWT required) |
| **SuperAdmin** | `/superadmin` | 5-module management panel (JWT + superadmin role) |
| **404** | `*` | Branded not-found page |

---

## 🔌 API Reference

### Public endpoints (no auth)

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| `GET` | `/api/content/:key` | Get a site content value | — |
| `GET` | `/api/content/bulk?keys=...` | Get multiple content values | — |
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
| `POST` | `/api/auth/login` | Login → JWT (5 attempts / 15 min) |

### Admin endpoints (JWT required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/events` | All events (incl. unpublished) |
| `POST` | `/api/admin/events` | Create event with gallery |
| `PUT` | `/api/admin/events/:id` | Update event |
| `DELETE` | `/api/admin/events/:id` | Delete event + images |
| `DELETE` | `/api/admin/events/:id/images/:imageId` | Remove single gallery image |
| `PUT` | `/api/admin/events/:id/cover` | Set cover image |
| `GET/POST/PUT/DELETE` | `/api/admin/team[/:id]` | Team CRUD + photo upload |
| `GET/POST/PUT/DELETE` | `/api/admin/partners[/:id]` | Partners CRUD + logo |
| `GET/POST/PUT/DELETE` | `/api/admin/brands[/:id]` | Brands CRUD + logo |
| `GET/POST/PUT/DELETE` | `/api/admin/contributors[/:id]` | Contributors CRUD |
| `GET` | `/api/admin/contacts` | Contact submissions (paginated) |
| `PATCH` | `/api/admin/contacts/:id/read` | Toggle read status |
| `PUT` | `/api/admin/profile` | Update own profile + photo |

### SuperAdmin endpoints (JWT + superadmin role)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/superadmin/admins` | List all admins |
| `POST` | `/api/superadmin/admins` | Create new admin |
| `PUT` | `/api/superadmin/admins/:id` | Edit admin |
| `DELETE` | `/api/superadmin/admins/:id` | Delete admin |
| `PATCH` | `/api/superadmin/admins/:id/password` | Reset password |
| `PATCH` | `/api/superadmin/admins/:id/activate` | Toggle active |
| `GET` | `/api/superadmin/content` | All SiteContent keys |
| `PUT` | `/api/superadmin/content/:key` | Edit site text |
| `GET` | `/api/superadmin/logs` | Activity logs (paginated) |

---

## 🔐 Auth & Security

### Role system

| Role | Access | Created By |
|------|--------|------------|
| `superadmin` | Full site — content, admins, logs, chatbot config | Seed script only |
| `admin` | Events, Team, Partners, Brands, Contributors, own profile | SuperAdmin via dashboard |

> **No public signup exists.** Admin accounts are created exclusively by the SuperAdmin.

### Security measures

- Passwords hashed with **bcryptjs** (salt rounds: 12)
- JWT tokens expire in **7 days**, stored in `localStorage`
- **Helmet** with configured CSP (Cloudinary, Google Fonts whitelisted)
- **CORS** restricted to `CLIENT_URL` environment variable
- **Rate limiting** on all sensitive endpoints
- **Input validation** via `express-validator`
- **Multer** restricted to image MIME types only
- **Groq API key** stays server-side — never in client bundle
- **Activity logging** on every mutating admin action
- **Graceful shutdown** handler for SIGTERM/SIGINT

---

## 🤖 AI Chatbot

**Model:** LLaMA 3 70B via Groq API (`llama3-70b-8192`)

The chatbot is **site-aware** — it fetches live database context before every query:

```
User message → POST /api/chat
  → Fetch upcoming events, team members, site content from DB
  → Inject into system prompt alongside chatbot_system_context CMS key
  → Call groq.chat.completions.create()
  → Return markdown response → rendered via react-markdown
```

> If Groq API is unreachable, the chatbot responds with a friendly offline message.

---

## 🎨 Design System

Dual-mode CSS custom properties defined in `client/src/index.css`:

| Token | Dark Mode | Light Mode |
|-------|-----------|------------|
| `--bg-primary` | `#080B14` | `#F8FAFC` |
| `--bg-surface` | `#0D1120` | `#FFFFFF` |
| `--accent-primary` | `#5B5FEF` | `#4F46E5` |
| `--accent-blue` | `#00C2FF` | `#0284C7` |
| `--text-primary` | `#F1F5F9` | `#0F172A` |
| `--text-secondary` | `#94A3B8` | `#64748B` |

**Typography:** `Outfit` (headings) + `Inter` (body) from Google Fonts

**UI Patterns:** Glassmorphism (`backdrop-filter: blur(28px)`), gradient headings, 3D CSS perspective, Framer Motion micro-animations

---

## 🧪 Testing

```bash
# Run server test suite
cd server && npm test

# Run tests with coverage
cd server && npx vitest run --coverage

# Run a specific test file
cd server && npx vitest run tests/auth.test.js
```

The server uses **Vitest** with **Supertest** for HTTP assertion testing.

---

## 📤 Deployment

### Target URLs

| Service | URL |
|---------|-----|
| Frontend | https://bug2build.in |
| Backend | https://api.bug2build.in |

### Frontend (cPanel)

```bash
cd client && npm run build   # generates dist/
# Upload dist/ contents to public_html
```

Add `.htaccess` for SPA routing:
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

### Backend (cPanel + PM2)

```bash
# On the server
npm install --production
pm2 start server.js --name b2b-api
pm2 save
```

### CI/CD

GitHub Actions workflows handle this automatically:
- **`ci.yml`** — Runs server tests + client build on every push/PR
- **`deploy.yml`** — Deploys to production on push to `main` via SSH
- **`lint.yml`** — Convention enforcement on PRs (console.log, react-hot-toast, etc.)
- **`dependency-review.yml`** — Flags vulnerable packages on PRs

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](.github/CONTRIBUTING.md) for the full workflow.

**Quick version:**

1. Fork the repository
2. Create your branch: `git checkout -b feat/your-feature`
3. Follow the [code conventions](CLAUDE.md)
4. Commit using [Conventional Commits](https://www.conventionalcommits.org/): `feat(frontend): add sponsor carousel`
5. Open a PR using the [template](.github/PULL_REQUEST_TEMPLATE.md)

### Key conventions

- All HTTP calls through `client/src/services/api.js` — no raw `fetch()`
- Custom `ToastNotification` only — no `react-hot-toast`
- CSS custom property tokens — no hardcoded hex colors
- `react-icons` HiOutline set — no emojis
- Cloudinary URLs — no binary/base64 in MongoDB
- Groq API key server-side only

See [SECURITY.md](.github/SECURITY.md) for vulnerability reporting.

---

## 📄 License

All Rights Reserved © Bug2Build

---

<p align="center">
  <strong>Bug2Build — Community Platform v4.0</strong><br/>
  <em>Built for the Bug2Build community</em>
</p>