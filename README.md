#  Bug2Build — Community Platform

> **Full-Stack MERN Application · Production Ready**  
> Built by: **Prakash Tiwari**, Assistant Technical Head  
> Stack: **MongoDB · Express.js · React 19 · Node.js**  
> Version: **v4.0** | Status: ✅ Working

---

## 📌 What is Bug2Build?

Bug2Build is a fully dynamic, CMS-driven community website where **Admins and SuperAdmins manage 100% of site content from a browser dashboard — zero code changes needed after deployment.**

Every section — events, team members, partner logos, contributors, hero text — is stored in MongoDB and editable live. The site also features an **AI-powered chatbot** (Groq/LLaMA 3) aware of live database content, a **custom toast notification system**, and a premium UI with 3D effects, glassmorphism, and Framer Motion animations.

---

## ✨ Highlights

| Feature | Detail |
|---------|--------|
| **100% CMS-Driven** | Every piece of content managed from the admin panel — zero code changes post-deploy |
| **3D Login Page** | Mouse-tracking tilt card, floating particles, rotating conic border glow |
| **Custom Toast System** | Glassmorphic notifications with progress bars, 4 types (success/error/warning/info) |
| **AI Chatbot** | Groq/LLaMA 3 site-aware assistant with live database context injection |
| **Two-Phase Loader** | 3D CSS cube animation → shimmer skeleton transition |
| **Dark / Light Mode** | Full theme toggle with localStorage persistence |
| **Floating Glassmorphic Navbar** | Animated pill indicator, blur backdrop, admin shield button |
| **Multi-Image Gallery** | Drag-and-drop uploads with cover selection per event |
| **Role-Based Access** | JWT + bcrypt auth with admin/superadmin route guards |

---

## 🖥️ Live Pages

| Page | Route | Description |
|------|-------|-------------|
| **Home** | `/` | Hero with typewriter animation, journey timeline, events grid, team preview, partners marquee, brands grid, stats counter |
| **About** | `/about` | Mission statement, vision cards, animated scroll sections |
| **Events** | `/events` | Event cards with status badges, search, filters |
| **Event Detail** | `/events/:id` | Full event page with keyboard-navigable image gallery |
| **Team** | `/team` | Category-filtered team grid with animated avatar rings |
| **Contributors** | `/contributors` | GitHub-linked contributor cards |
| **Partnership** | `/partnership` | Benefits grid + inquiry submission form |
| **Contact** | `/contact` | Contact info cards + message form |
| **Login** | `/login` | 3D tilt card login with particle background |
| **Admin Dashboard** | `/admin` | 7-module CRUD panel with floating navbar |
| **SuperAdmin Dashboard** | `/superadmin` | 5-module management panel |
| **404** | `*` | Branded not-found page |

---

## 🎨 Design System

The UI uses a dual-mode design system with CSS custom properties.

### Dark Mode (Default)
```css
--bg-primary:     #080B14;     /* Deep Space */
--bg-surface:     #0D1120;     /* Dark Navy Card */
--bg-elevated:    #121828;     /* Elevated Surface */
--accent-primary: #5B5FEF;     /* Electric Indigo */
--accent-blue:    #00C2FF;     /* Neon Blue */
--accent-purple:  #8B5CF6;     /* Vivid Purple */
--gradient-hero:  linear-gradient(135deg, #5B5FEF, #00C2FF);
--gradient-title: linear-gradient(90deg, #FF6B8A, #8B5CF6);
--text-primary:   #F1F5F9;
--text-secondary: #94A3B8;
--border:         #1E293B;
```

### Light Mode
```css
--bg-primary:     #F8FAFC;
--bg-surface:     #FFFFFF;
--accent-primary: #4F46E5;
--accent-blue:    #0284C7;
--text-primary:   #0F172A;
--text-secondary: #64748B;
--border:         #E2E8F0;
```

### Typography
- **Headings**: `Outfit` (Google Fonts) — bold, modern display
- **Body**: `Inter` (Google Fonts) — clean, readable

### Key UI Patterns
- **Glassmorphism**: `backdrop-filter: blur(28px) saturate(190%)` on cards and nav
- **Gradient Headings**: `linear-gradient(90deg, #FF6B8A, #8B5CF6)` — brand signature
- **3D Effects**: CSS perspective + Framer Motion `rotateX`/`rotateY` transforms
- **Micro-Animations**: Hover scales, spring transitions, staggered entrance reveals

---

## 🗂️ Folder Structure

### Backend (`server/`)
```
server/
├── server.js                         # Express entry — mounts routes, middleware, DB
├── .env                              # Secrets — NEVER committed
├── .env.example                      # Template — key names only
├── config/
│   ├── db.js                         # MongoDB Atlas via Mongoose
│   └── cloudinary.js                 # Cloudinary SDK config
├── middleware/
│   ├── authMiddleware.js             # JWT verification from Authorization header
│   ├── roleMiddleware.js             # isAdmin / isSuperAdmin guards
│   ├── activityLogger.js             # Auto-logs every mutating action
│   └── errorHandler.js               # Centralized error responses
├── models/
│   ├── User.js                       # Admin/SuperAdmin accounts
│   ├── Event.js                      # Events with gallery sub-documents
│   ├── TeamMember.js                 # Team with category + ordering
│   ├── Partner.js                    # Community partner logos
│   ├── Brand.js                      # "Brands That Trust Us" logos
│   ├── Contributor.js                # Open-source contributors
│   ├── SiteContent.js                # Key-value CMS store
│   ├── ContactSubmission.js          # Form submissions with read status
│   ├── ActivityLog.js                # Admin action audit trail
│   └── ChatSession.js               # AI chatbot conversations
├── controllers/
│   ├── authController.js             # Login + JWT issuance
│   ├── eventController.js            # Full CRUD + multi-image gallery
│   ├── teamController.js             # CRUD + photo upload
│   ├── partnerController.js          # CRUD + logo upload
│   ├── brandController.js            # CRUD + logo upload
│   ├── contributorController.js      # CRUD
│   ├── contentController.js          # SiteContent get/update
│   ├── contactController.js          # Submissions + read toggle
│   ├── adminController.js            # Admin dashboard stats
│   ├── superAdminController.js       # User mgmt + logs
│   └── chatController.js             # Groq AI with live DB context
├── routes/
│   ├── authRoutes.js                 # POST /api/auth/login
│   ├── publicRoutes.js               # Public GET + POST endpoints
│   ├── adminRoutes.js                # Admin CRUD (JWT required)
│   ├── superAdminRoutes.js           # SuperAdmin mgmt (JWT + role)
│   └── chatRoutes.js                 # POST /api/chat
├── scripts/
│   └── seed.js                       # DB seed — SuperAdmin + SiteContent
└── uploads/                          # Temp Multer storage → Cloudinary
```

### Frontend (`client/src/`)
```
client/src/
├── App.jsx                            # Router + provider tree
├── main.jsx                           # React DOM entry
├── index.css                          # Full design system (CSS vars + utilities)
├── components/
│   └── common/
│       ├── Navbar.jsx                 # Floating glassmorphic nav + admin shield btn
│       ├── Footer.jsx                 # Gradient footer with social links
│       ├── B2BLoader.jsx              # 3D CSS cube loading animation
│       ├── SkeletonLoader.jsx         # Shimmer skeleton for page transitions
│       ├── ProtectedRoute.jsx         # JWT + role-based route guard
│       ├── AIChatbot.jsx              # Floating AI chat widget (Groq)
│       └── ToastNotification.jsx      # Custom glassmorphic toast system
├── context/
│   ├── AuthContext.jsx                # JWT login/logout + user state
│   ├── ThemeContext.jsx               # Dark/light toggle + persistence
│   └── LoaderContext.jsx              # Two-phase loader (cube → skeleton)
├── pages/
│   ├── Home.jsx                       # Hero, timeline, events, team, partners, brands
│   ├── About.jsx                      # Mission, vision, scroll animations
│   ├── Events.jsx                     # Event listing with filters
│   ├── EventDetail.jsx                # Full event + image gallery
│   ├── Team.jsx                       # Category-filtered team grid
│   ├── Contributors.jsx               # GitHub contributor cards
│   ├── Partnership.jsx                # Benefits + inquiry form
│   ├── Contact.jsx                    # Contact info + message form
│   ├── Login.jsx                      # 3D tilt card + particles
│   ├── AdminDashboard.jsx             # 7-module CRUD dashboard
│   ├── SuperAdminDashboard.jsx        # 5-module admin panel
│   └── NotFound.jsx                   # 404 page
└── services/
    └── api.js                         # Axios + JWT interceptor
```

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier)
- Cloudinary account (free tier)
- Groq API key — free at [console.groq.com](https://console.groq.com)

### Quick Start

```bash
# 1. Install dependencies
cd server && npm install
cd ../client && npm install

# 2. Configure environment
cd server
cp .env.example .env
# Fill in: MONGO_URI, JWT_SECRET, Cloudinary keys, GROQ_API_KEY

# Create client/.env.local
echo "VITE_API_URL=http://localhost:5000" > ../client/.env.local

# 3. Seed initial data (run once)
cd server
node scripts/seed.js    # Creates SuperAdmin + populates SiteContent keys

# 4. Run dev servers (two terminals)
# Terminal 1 — Backend
cd server && npm run dev   # nodemon on :5000

# Terminal 2 — Frontend
cd client && npm run dev   # Vite on :5173
```

### Server Scripts
```json
{
  "start": "node server.js",
  "dev":   "nodemon server.js",
  "seed":  "node scripts/seed.js"
}
```

> ⚠️ The deployment team runs `npm start`, not `npm run dev`. Ensure `npm start` works cleanly before handoff.

---

## 🗄️ MongoDB Schemas

### User
```js
{
  name: String,
  email: { type: String, unique: true },
  password: String,                    // bcrypt hashed, salt rounds: 12
  role: { type: String, enum: ['admin', 'superadmin'] },
  profilePicture: String,             // Cloudinary URL
  bio: String,
  isActive: { type: Boolean, default: true },
  createdAt: Date
}
```

### Event
```js
{
  title: String,
  date: Date,
  description: String,
  location: String,
  eventLink: String,
  coverImage: String,                  // Cloudinary URL
  gallery: [{                          // Multi-image gallery
    url: String,
    publicId: String,
    altText: String
  }],
  status: { type: String, enum: ['upcoming', 'ongoing', 'past'] },
  category: { type: String, enum: ['workshop', 'hackathon', 'meetup', 'webinar', 'conference', 'other'] },
  published: { type: Boolean, default: true },
  createdBy: { type: ObjectId, ref: 'User' },
  createdAt: Date
}
```

### TeamMember
```js
{
  name: String,
  role: String,
  photo: String,                       // Cloudinary URL
  linkedin: String,
  github: String,
  category: { type: String, enum: ['executive', 'tech', 'event', 'sponsors', 'digital_media', 'marketing', 'research'] },
  order: Number,
  isActive: Boolean
}
```

### Partner
```js
{
  name: String,
  logo: String,                        // Cloudinary URL
  website: String,
  category: String,
  isActive: Boolean
}
```

### Brand
```js
{
  name: String,
  logo: String,                        // Cloudinary URL
  website: String,
  isActive: Boolean
}
```

### Contributor
```js
{
  name: String,
  github: String,
  role: String,
  avatar: String,
  bio: String
}
```

### SiteContent
```js
{
  key: String,                         // e.g. "hero_title", "chatbot_system_context"
  value: String,
  updatedBy: { type: ObjectId, ref: 'User' },
  updatedAt: Date
}
```

### ContactSubmission
```js
{
  name: String,
  email: String,
  subject: String,
  message: String,
  isRead: { type: Boolean, default: false },
  createdAt: Date
}
```

### ActivityLog
```js
{
  user: { type: ObjectId, ref: 'User' },
  action: String,                      // e.g. "Added event: Hackathon 2026"
  ip: String,
  timestamp: Date
}
```

### ChatSession
```js
{
  sessionId: String,
  messages: [{ role: String, content: String, timestamp: Date }],
  createdAt: Date
}
```

---

## 🛣️ API Routes

### Public (No Auth)
```
GET  /api/content/:key            → Get a site content value
GET  /api/content/bulk?keys=...   → Get multiple content values
GET  /api/events                  → All published events (paginated)
GET  /api/events/:id              → Single event with gallery
GET  /api/team                    → All active team members
GET  /api/partners                → All partner logos
GET  /api/brands                  → All brand logos
GET  /api/contributors            → All contributors
POST /api/contact                 → Submit contact form
POST /api/partnership             → Submit partnership inquiry
POST /api/chat                    → AI chatbot (rate-limited: 20 req/min)
```

### Admin (JWT Required)
```
GET    /api/admin/events              → All events (incl. unpublished)
POST   /api/admin/events              → Create event with gallery upload
PUT    /api/admin/events/:id          → Update event
DELETE /api/admin/events/:id          → Delete event + images
DELETE /api/admin/events/:id/images/:imageId  → Remove single gallery image
PUT    /api/admin/events/:id/cover    → Set cover image

GET    /api/admin/team/all            → All team members
POST   /api/admin/team                → Add team member + photo
PUT    /api/admin/team/:id            → Update team member
DELETE /api/admin/team/:id            → Delete team member

GET    /api/admin/partners/all        → All partners
POST   /api/admin/partners            → Add partner + logo
PUT    /api/admin/partners/:id        → Update partner
DELETE /api/admin/partners/:id        → Remove partner

GET    /api/admin/brands/all          → All brands
POST   /api/admin/brands              → Add brand + logo
PUT    /api/admin/brands/:id          → Update brand
DELETE /api/admin/brands/:id          → Remove brand

GET    /api/admin/contributors/all    → All contributors
POST   /api/admin/contributors        → Add contributor
PUT    /api/admin/contributors/:id    → Update contributor
DELETE /api/admin/contributors/:id    → Delete contributor

GET    /api/admin/contacts            → Contact submissions (paginated)
PATCH  /api/admin/contacts/:id/read   → Toggle read status

PUT    /api/admin/profile             → Update own profile + photo
```

### SuperAdmin (JWT + superadmin role)
```
GET    /api/superadmin/admins             → List all admins
POST   /api/superadmin/admins             → Create new admin
PUT    /api/superadmin/admins/:id         → Edit admin
DELETE /api/superadmin/admins/:id         → Delete admin
PATCH  /api/superadmin/admins/:id/password    → Reset password
PATCH  /api/superadmin/admins/:id/activate    → Toggle active

GET    /api/superadmin/content            → All SiteContent keys
PUT    /api/superadmin/content/:key       → Edit site text

GET    /api/superadmin/logs               → Activity logs (paginated)
```

---

## 🤖 AI Chatbot — Groq Integration

**Model:** LLaMA 3 70B via Groq API (`llama3-70b-8192`) — ultra-fast inference.

The chatbot is **site-aware**: it fetches live database context before every query.

| Step | Action |
|------|--------|
| 1 | User clicks floating chat button (bottom-right) |
| 2 | `POST /api/chat` with `{ message, sessionId }` |
| 3 | Backend fetches live DB context (upcoming events, team, about text) |
| 4 | Injects context + `chatbot_system_context` into system prompt |
| 5 | Calls `groq.chat.completions.create()` |
| 6 | Response rendered via `react-markdown` in chat widget |

> ⚠️ Fallback: If Groq API is unreachable, chatbot responds with a friendly offline message.

---

## 🔐 Auth & Role System

### Two Roles
| Role | Access | Created By |
|------|--------|-----------|
| `superadmin` | Full site — content, admins, logs, chatbot config | Seed script |
| `admin` | Events, Team, Partners, Brands, Contributors, own Profile | SuperAdmin |

### Login Flow
```
/login   →  Email + Password
         →  bcrypt verify (salt rounds: 12)
         →  JWT issued (expires 7d)
         →  Stored in localStorage
         →  Role-based redirect → /admin or /superadmin
         →  toast.success('Welcome back!') on success
         →  toast.error('Invalid credentials.') on failure
```

### Security Measures
- Passwords hashed with bcryptjs (salt rounds: 12)
- JWT tokens expire in 7 days
- `express-validator` sanitizes all inputs
- Multer limits uploads to image MIME types
- CORS restricted to `CLIENT_URL` env variable
- Groq API key stays server-side only
- Rate limiting: `/api/auth/login` → 5 attempts/15 min | `/api/chat` → 20 req/min
- Activity log on every mutating action
- No public signup — zero attack surface

---

## 🧑‍💼 Admin Dashboard (`/admin`)

Floating glassmorphic top navbar with pill-style animated tab indicator.

| Module | Icon | Capabilities |
|--------|------|-------------|
| **Events** | `HiOutlineCalendar` | Add/Edit/Delete events, drag-and-drop gallery upload (`react-dropzone`), cover image selection, status/category/visibility toggles |
| **Team** | `HiOutlineUsers` | Add/Edit/Delete members, photo upload, 7 category types |
| **Partners** | `HiOutlineGlobe` | Add/Remove partner logos |
| **Brands** | `HiOutlineBriefcase` | Add/Remove brand logos |
| **Contributors** | `HiOutlineCode` | Add/Edit/Delete with GitHub links |
| **Messages** | `HiOutlineMail` | View submissions, expandable cards, read/unread toggle |
| **Profile** | `HiOutlineUser` | Edit own name, bio, email, password |

---

## 👑 SuperAdmin Dashboard (`/superadmin`)

| Module | Icon | Capabilities |
|--------|------|-------------|
| **Content Editor** | `HiOutlinePencil` | Edit all SiteContent key-value pairs |
| **Admin Manager** | `HiOutlineUserGroup` | Create/Edit/Delete admins, reset passwords, toggle active |
| **Activity Logs** | `HiOutlineClipboardList` | Paginated audit trail with user, action, timestamp, IP |
| **Chatbot Config** | `HiOutlineChatAlt2` | Edit chatbot system context |
| **Site Settings** | `HiOutlineCog` | SEO and social link configuration |

---

## 🎭 UI Components

### Custom Toast Notification System
Replaced `react-hot-toast` with a custom-built system matching the B2B design:
- **4 types**: Success (green), Error (red), Warning (amber), Info (blue)
- **Glassmorphism**: Blurred backdrop with semi-transparent backgrounds
- **Animated progress bar**: Visual countdown with gradient accent
- **Auto-dismiss**: Configurable duration (default 4s)
- **Framer Motion**: Slide-in/out with spring physics
- **Standalone API**: `import toast from './ToastNotification'` — drop-in replacement

### Two-Phase Loading System
1. **Phase 1 — 3D Cube**: CSS-only rotating cube with gradient faces (1 second)
2. **Phase 2 — Skeleton**: Shimmer skeleton matching page layout (until content loads)

### Floating Glassmorphic Navbar
- `backdrop-filter: blur(28px) saturate(190%)`
- Animated pill indicator on active tab
- Compact on scroll (dynamic height)
- Admin shield icon button → `/login`
- Dark/Light theme toggle
- Mobile hamburger with slide-in drawer

### AI Chatbot Widget
- Floating button (bottom-right)
- Expandable chat panel with message history
- Typing indicator during AI response
- Markdown rendering via `react-markdown`
- Session persistence

### 3D Login Page
- **TiltCard**: Mouse-tracking 3D perspective transform
- **Particle Background**: 24 animated particles + 6 floating geometric shapes
- **Mouse Spotlight**: Radial gradient follows cursor
- **Floating Code Snippets**: Decorative code blocks (desktop)
- **Conic Border Glow**: Rotating gradient border animation
- **Shimmer Button**: Animated light sweep on submit

---

## 📦 Tech Stack

### Backend
| Package | Purpose |
|---------|---------|
| `express` ^5.2 | HTTP server & routing |
| `mongoose` ^9.5 | MongoDB ODM |
| `bcryptjs` ^3.0 | Password hashing |
| `jsonwebtoken` ^9.0 | JWT auth |
| `multer` ^2.1 | File upload handling |
| `cloudinary` ^1.41 | Image hosting CDN |
| `multer-storage-cloudinary` ^4.0 | Cloudinary storage engine |
| `groq-sdk` ^1.1 | Groq/LLaMA 3 AI inference |
| `cors` ^2.8 | CORS headers |
| `dotenv` ^17.4 | Environment variables |
| `morgan` ^1.10 | HTTP request logging |
| `express-validator` ^7.3 | Input validation |
| `express-rate-limit` ^8.3 | Rate limiting |
| `helmet` ^8.1 | Security headers |
| `compression` ^1.8 | Gzip compression |
| `nodemailer` ^8.0 | Email sending |
| `nodemon` (dev) | Auto-restart on changes |

### Frontend
| Package | Purpose |
|---------|---------|
| `react` ^19.2 + `vite` ^8.0 | UI framework + dev server |
| `react-router-dom` ^7.13 | Routing + protected routes |
| `axios` ^1.13 | HTTP client with JWT interceptor |
| `framer-motion` ^12.38 | Animations, 3D transforms, page transitions |
| `tailwindcss` ^3.4 | Utility-first CSS framework |
| `react-icons` ^5.6 | Icon library (HiOutline set) |
| `react-dropzone` ^15.0 | Drag-and-drop image upload |
| `react-markdown` ^10.1 | Render chatbot markdown |
| `react-type-animation` ^3.2 | Typewriter effect on hero |
| `@dnd-kit/core` ^6.3 | Drag-and-drop reordering |
| `@dnd-kit/sortable` ^10.0 | Sortable lists |

> **Note:** `react-hot-toast` is still in `package.json` but all pages now use the custom `ToastNotification` system.

---

## 🖥️ Environment Variables

```bash
# server/.env — NEVER commit this file
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_long_random_secret
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
CLIENT_URL=http://localhost:5173
GROQ_API_KEY=gsk_...
PORT=5000
```

```bash
# client/.env.local — NEVER commit this file
VITE_API_URL=http://localhost:5000
```

---

## 📤 Deployment

### Target URLs
| | URL |
|--|--|
| Frontend | https://bug2build.in |
| Backend | https://api.bug2build.in |

### Frontend (cPanel)
1. `cd client && npm run build` → generates `/dist`
2. Upload `/dist` contents to `public_html`
3. Add `.htaccess` for SPA routing:
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

### Backend (cPanel)
1. Upload `/server` folder to `api.bug2build.in`
2. Set `.env` values via cPanel
3. Install and start:
```bash
npm install
pm2 start server.js --name b2b-api
pm2 save
```

---

## ✅ Delivery Checklist

### Backend
- [x] All 10 Mongoose models created with validation and timestamps
- [x] bcrypt password hashing on user creation (salt rounds: 12)
- [x] JWT auth middleware on all protected routes
- [x] Role middleware (`isAdmin`, `isSuperAdmin`) implemented
- [x] All public GET/POST routes working
- [x] All admin CRUD routes — events, team, partners, brands, contributors
- [x] Multi-image gallery upload with cover image selection
- [x] Cloudinary integration for all image uploads
- [x] SuperAdmin routes — content editing, admin management, activity logs
- [x] Groq chatbot endpoint with live DB context injection
- [x] Activity logging on every mutating action
- [x] Rate limiting on login + chat endpoints
- [x] CORS restricted to CLIENT_URL
- [x] `.env.example` complete and up to date

### Frontend
- [x] Custom `ToastNotification` system — glassmorphic, animated, themed
- [x] Every CMS action produces toast — no silent operations
- [x] Two-phase loader: 3D cube → skeleton shimmer
- [x] ThemeContext dark/light toggle with localStorage persistence
- [x] All icons use `react-icons` — zero emojis
- [x] Floating glassmorphic navbar with admin shield button
- [x] All 8 public pages built and connected to backend
- [x] Events page with status badges and search
- [x] Event detail page with keyboard-navigable gallery
- [x] Team page with category tabs and animated rings
- [x] Contributors page with GitHub cards
- [x] Partnership page with benefits grid + form
- [x] AI chatbot widget functional with Groq backend
- [x] 3D tilt login page with particles and animations
- [x] Admin dashboard — all 7 modules with floating navbar
- [x] SuperAdmin dashboard — all 5 modules
- [x] ProtectedRoute blocks unauthenticated access
- [x] 404 page with branding
- [x] Full mobile responsiveness (320px–1920px)
- [x] `npm run build` completes without errors

### Handoff
- [x] `server/.env.example` committed with all keys
- [x] `client/.env.local` in `.gitignore`
- [x] `server/.env` in `.gitignore`
- [x] Seed script documented and tested
- [x] Production build verified

---

*Bug2Build — Community Platform v4.0*  
*Built by Prakash Tiwari, Assistant Technical Head*  
*All Rights Reserved*