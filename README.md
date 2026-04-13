# 🐛 Bug2Build — MERN Stack Website Implementation Plan
> **Author:** Prakash Tiwari | Assistant Technical Head  
> **Stack:** MongoDB • Express.js • React.js • Node.js  
> **Goal:** Fully dynamic website where Admins/SuperAdmins manage ALL content from a browser — zero code changes needed ever again.

---

## 👁️ Current Site Analysis

| Section | Current State | New State |
|---------|--------------|-----------|
| Navbar | Hardcoded links | Dynamic, editable |
| About | Hardcoded text | Editable via Admin panel |
| Team / Executive Council | Hardcoded cards | Admin adds/edits/deletes members |
| Events & Happenings | Hardcoded cards | Admin creates events from dashboard |
| Collaborations (Orbital animation) | Hardcoded logos | Admin adds/removes partner logos |
| Brands That Trust Us | Hardcoded logo grid | Admin manages brand logos |
| Contact / Map | Hardcoded | Admin can update contact info |
| Contributors | Hardcoded | Dynamic from DB |
| Partnership | Hardcoded | Admin manages partner data |

---

## 🎨 Premium Color System

Based on the B2B logo — dark navy, electric indigo/blue, puzzle-piece identity.

### Dark Mode (Default)
```css
--bg-primary:     #080B14;   /* Deep Space */
--bg-surface:     #0D1120;   /* Dark Navy Card */
--bg-elevated:    #121828;   /* Elevated Surface */
--accent-primary: #5B5FEF;   /* Electric Indigo */
--accent-blue:    #00C2FF;   /* Neon Blue */
--accent-purple:  #8B5CF6;   /* Vivid Purple */
--gradient-hero:  linear-gradient(135deg, #5B5FEF, #00C2FF);
--gradient-title: linear-gradient(90deg, #FF6B8A, #8B5CF6); /* matches current pink-purple headings */
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

> 💡 Keep the **pink-to-purple gradient** on section headings — it matches the current brand and looks premium.

---

## 💫 B2B Loader Design

**Concept:** The B2B puzzle logo assembles piece by piece with a glowing indigo trail, then fades out.

```
[  Puzzle pieces fly in from corners  ]
[  Assemble into B2B logo             ]
[  "Bug2Build" types out below        ]
[  Glowing pulse → fade out           ]
```

**Show loader when:**
- Any page first loads
- Route changes (React Router transitions)
- Any API call is pending (global loading state via Context)
- Any button is clicked that triggers a backend action

**Tech:** Framer Motion + custom SVG path animation

```jsx
// Global usage via Context
const { setLoading } = useLoader();

const handleSubmit = async () => {
  setLoading(true);
  await axios.post('/api/events', data);
  setLoading(false);
};
```

---

## 🗂️ Full Folder Structure

```
bug2build/
│
├── client/                          # React + Vite Frontend
│   └── src/
│       ├── assets/                  # Logo, images
│       ├── components/
│       │   ├── common/
│       │   │   ├── Navbar.jsx
│       │   │   ├── Footer.jsx
│       │   │   ├── B2BLoader.jsx    # THE signature loader
│       │   │   ├── ThemeToggle.jsx
│       │   │   └── ProtectedRoute.jsx
│       │   ├── home/
│       │   │   ├── HeroSection.jsx
│       │   │   ├── AboutSnapshot.jsx
│       │   │   ├── EventsPreview.jsx
│       │   │   ├── TeamPreview.jsx
│       │   │   ├── OrbitalCollaborations.jsx  # Keep the cool orbit!
│       │   │   ├── BrandsGrid.jsx
│       │   │   └── ContactSection.jsx
│       │   ├── admin/               # Admin dashboard UI
│       │   └── superadmin/          # SuperAdmin dashboard UI
│       │
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   ├── ThemeContext.jsx
│       │   └── LoaderContext.jsx    # Global loader state
│       │
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── About.jsx
│       │   ├── Events.jsx
│       │   ├── Team.jsx
│       │   ├── Contributors.jsx
│       │   ├── Partnership.jsx
│       │   ├── Contact.jsx
│       │   ├── Login.jsx            # Admin-only login
│       │   ├── AdminDashboard.jsx
│       │   └── SuperAdminDashboard.jsx
│       │
│       ├── services/
│       │   └── api.js               # All axios calls in one place
│       └── App.jsx
│
├── server/                          # Node + Express Backend
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   ├── teamController.js
│   │   ├── partnerController.js
│   │   ├── contributorController.js
│   │   ├── contentController.js     # About, hero, contact text
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── authMiddleware.js        # Verify JWT
│   │   └── roleMiddleware.js        # isAdmin / isSuperAdmin
│   ├── models/
│   │   ├── User.js
│   │   ├── Event.js
│   │   ├── TeamMember.js
│   │   ├── Partner.js               # Collaboration logos (orbital)
│   │   ├── Brand.js                 # "Brands That Trust Us" logos
│   │   ├── Contributor.js
│   │   └── SiteContent.js          # Key-value store for editable text
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── publicRoutes.js
│   │   ├── adminRoutes.js
│   │   └── superAdminRoutes.js
│   ├── uploads/                     # Multer local storage (or Cloudinary)
│   ├── .env
│   └── server.js
```

---

## 🌐 Pages & What Admin Controls on Each

### 🏠 Home Page
| Section | Admin Can Edit |
|---------|---------------|
| Hero title, subtitle, CTA button text | ✅ SuperAdmin |
| Hero background image/gradient | ✅ SuperAdmin |
| About snapshot text | ✅ Admin |
| Events preview (shows latest 3) | ✅ Auto from Events DB |
| Team preview (shows top members) | ✅ Auto from Team DB |
| Orbital collaborations | ✅ Admin adds/removes logos |
| Brands That Trust Us logos | ✅ Admin adds/removes logos |
| Contact info & map location | ✅ SuperAdmin |

### 📅 Events Page
- Admin can **Add / Edit / Delete** events
- Fields: Title, Date, Description, Location, Event Link, Image, Status (Upcoming/Past)
- "More Events" button shows all from DB, paginated

### 👥 Team Page (Executive Council + Others)
- Admin can **Add / Edit / Delete** team members
- Fields: Name, Role, Photo, LinkedIn, GitHub, Category (Executive/Core/Contributor)
- SuperAdmin can edit any member's photo

### 🤝 Partnership / Collaborations
- Admin manages partner logos (the orbital animation logos)
- Fields: Name, Logo image, Website URL, Category

### 🏷️ Brands That Trust Us
- Admin manages brand logos grid
- Fields: Brand name, Logo image, Website URL

### 👨‍💻 Contributors
- Admin can add/edit contributors
- Fields: Name, GitHub, Role, Photo

### 📞 Contact
- SuperAdmin can update: email, phone, address, Google Maps embed link
- All contact form submissions saved to DB — visible in Admin dashboard

---

## 🔐 Auth & Role System

### Two Roles Only
```
superadmin  →  Full control of everything
admin       →  Content management (events, team, partners, brands)
```

### Login Flow
```
/admin/login  →  Email + Password
              →  bcrypt verify
              →  JWT issued (expires in 7d)
              →  Stored in localStorage
              →  Role decoded on every protected API call
```

### No Public Signup — SuperAdmin creates Admin accounts only.

---

## 🛡️ SuperAdmin Dashboard — Full Feature List

```
Route: /superadmin
```

| Feature | What It Does |
|---------|-------------|
| 📝 Edit Hero Section | Change title, subtitle, CTA, background |
| 📝 Edit About Text | Update About Bug2Build description |
| 📝 Edit Contact Info | Email, phone, address, map link |
| 👥 Manage Admins | Create new admin, edit their info, delete, change their photo |
| 🔑 Reset Admin Password | Change any admin's password |
| 📊 Activity Log | See who changed what and when |
| ⚙️ Site Settings | SEO title/description, social media links |
| 🗑️ Delete Any Content | Full override on all content |

---

## 🧑‍💼 Admin Dashboard — Full Feature List

```
Route: /admin
```

| Feature | What It Does |
|---------|-------------|
| 📅 Events Manager | Add / Edit / Delete events with image upload |
| 👥 Team Manager | Add / Edit / Delete team members with photo upload |
| 🔵 Orbital Partners | Add / Remove collaboration logos (the orbit section) |
| 🏷️ Brands Manager | Add / Remove "Brands That Trust Us" logos |
| 👨‍💻 Contributors | Add / Edit / Delete contributors |
| 📬 Contact Submissions | View all messages sent via contact form |
| 🖼️ Edit Own Profile | Update own name, bio, photo |

---

## 🗄️ MongoDB Schemas

### User
```js
{
  name: String,
  email: { type: String, unique: true },
  password: String,           // bcrypt hashed
  role: { type: String, enum: ['admin', 'superadmin'] },
  profilePicture: String,     // Cloudinary or local URL
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
  image: String,
  status: { type: String, enum: ['upcoming', 'past'] },
  createdBy: { type: ObjectId, ref: 'User' },
  createdAt: Date
}
```

### TeamMember
```js
{
  name: String,
  role: String,
  photo: String,
  linkedin: String,
  github: String,
  category: { type: String, enum: ['executive', 'core', 'contributor'] },
  order: Number,              // for sorting display order
  isActive: Boolean
}
```

### Partner (Orbital Collaborations)
```js
{
  name: String,
  logo: String,
  website: String,
  category: String,           // e.g. "university", "company"
  isActive: Boolean
}
```

### Brand (Brands That Trust Us)
```js
{
  name: String,
  logo: String,
  website: String,
  isActive: Boolean
}
```

### SiteContent (Key-Value for editable text)
```js
{
  key: String,        // e.g. "hero_title", "about_description", "contact_email"
  value: String,
  updatedBy: { type: ObjectId, ref: 'User' },
  updatedAt: Date
}
```

### ActivityLog
```js
{
  user: { type: ObjectId, ref: 'User' },
  action: String,     // e.g. "Added event: IIT Roorkee Hackathon"
  timestamp: Date
}
```

---

## 🛣️ API Routes

### Public (No Auth)
```
GET  /api/content/:key          → Get a site content value (hero, about etc.)
GET  /api/events                → All events
GET  /api/team                  → All team members
GET  /api/partners              → All orbital collaboration logos
GET  /api/brands                → All brand logos
GET  /api/contributors          → All contributors
POST /api/contact               → Submit contact form
```

### Admin (JWT Required)
```
POST   /api/admin/events              → Create event
PUT    /api/admin/events/:id          → Update event
DELETE /api/admin/events/:id          → Delete event

POST   /api/admin/team               → Add team member
PUT    /api/admin/team/:id            → Update team member
DELETE /api/admin/team/:id            → Delete team member

POST   /api/admin/partners            → Add partner logo
DELETE /api/admin/partners/:id        → Remove partner logo

POST   /api/admin/brands              → Add brand logo
DELETE /api/admin/brands/:id          → Remove brand logo

POST   /api/admin/contributors        → Add contributor
PUT    /api/admin/contributors/:id    → Update contributor
DELETE /api/admin/contributors/:id    → Delete contributor

PUT    /api/admin/profile             → Update own profile + photo
GET    /api/admin/contacts            → View contact form submissions
```

### SuperAdmin (JWT + superadmin role)
```
PUT    /api/superadmin/content/:key   → Edit any site text (hero, about, contact)
GET    /api/superadmin/admins         → List all admins
POST   /api/superadmin/admins         → Create new admin
PUT    /api/superadmin/admins/:id     → Edit admin (name, role, photo)
DELETE /api/superadmin/admins/:id     → Delete admin
PUT    /api/superadmin/admins/:id/password → Reset admin password
GET    /api/superadmin/logs           → View activity logs
PUT    /api/superadmin/settings       → SEO, social links
```

---

## 📦 Libraries & Tech

### Frontend
| Package | Why |
|---------|-----|
| `react` + `vite` | Fast dev setup |
| `react-router-dom v6` | Routing + protected routes |
| `axios` | API calls |
| `framer-motion` | B2B Loader + page transitions |
| `tailwindcss` | Utility-first styling |
| `react-hot-toast` | Success/error notifications |
| `react-quill` | Rich text editor for descriptions |
| `react-icons` | Icons throughout |
| `react-dropzone` | Drag & drop image uploads in admin |

### Backend
| Package | Why |
|---------|-----|
| `express` | Server |
| `mongoose` | MongoDB ODM |
| `bcryptjs` | Password hashing |
| `jsonwebtoken` | Auth tokens |
| `multer` | File/image upload handling |
| `cloudinary` + `multer-storage-cloudinary` | Image hosting |
| `cors` | Allow frontend requests |
| `dotenv` | Environment variables |
| `morgan` | HTTP request logging |
| `express-validator` | Input validation |

---

## 🗓️ Development Phases

### Phase 1 — Foundation (Days 1–3)
- [ ] Init React (Vite) + Node/Express
- [ ] Connect MongoDB Atlas
- [ ] Setup Tailwind + CSS variables (dark/light)
- [ ] Build B2BLoader component with Framer Motion
- [ ] Build LoaderContext (global loading state)
- [ ] Build ThemeContext + toggle button
- [ ] Build Navbar (with mobile hamburger menu)
- [ ] Build Footer

### Phase 2 — Public Pages (Days 4–8)
- [ ] Home page — Hero, About snapshot, Events preview, Team preview
- [ ] Rebuild Orbital Collaborations section (keep the animation, make it dynamic)
- [ ] Brands That Trust Us grid (dynamic)
- [ ] Events page — list + detail
- [ ] Team page — Executive Council + others
- [ ] Contributors page
- [ ] Partnership page
- [ ] Contact page + form

### Phase 3 — Backend APIs (Days 9–12)
- [ ] All MongoDB models
- [ ] All public GET routes
- [ ] Auth system (login, JWT, middleware)
- [ ] Admin CRUD routes (events, team, partners, brands)
- [ ] SuperAdmin routes (content editing, admin management)
- [ ] Image upload with Cloudinary
- [ ] Activity logging middleware

### Phase 4 — Admin Dashboard (Days 13–17)
- [ ] Admin login page
- [ ] Admin dashboard layout (sidebar + header)
- [ ] Events Manager (add/edit/delete with image)
- [ ] Team Manager (add/edit/delete with photo)
- [ ] Partners & Brands Manager
- [ ] Contributors Manager
- [ ] Contact submissions viewer
- [ ] Own profile editor

### Phase 5 — SuperAdmin Dashboard (Days 18–21)
- [ ] SuperAdmin dashboard layout
- [ ] Site Content Editor (edit hero, about, contact info via form — no code)
- [ ] Admin Manager (create, edit, delete, change photo)
- [ ] Activity Logs viewer
- [ ] Site Settings (SEO, social links)

### Phase 6 — Polish & Handoff (Days 22–25)
- [ ] Full mobile responsiveness check
- [ ] Loading states on every action
- [ ] 404 page
- [ ] Error boundaries
- [ ] Environment variables finalized
- [ ] `npm run build` → `/dist` folder ready
- [ ] Handoff to team for cPanel deployment

---

## 🖥️ Admin Dashboard UI Preview (What It Looks Like)

```
┌─────────────────────────────────────────────────┐
│  🐛 Bug2Build Admin          [🌙] [Logout]       │
├──────────────┬──────────────────────────────────┤
│              │                                  │
│  📅 Events   │   Events Manager                 │
│  👥 Team     │   ┌─────────────────────────┐    │
│  🔵 Partners │   │ + Add New Event          │    │
│  🏷️ Brands  │   ├─────────────────────────┤    │
│  👨‍💻 Contrib │   │ IIT Roorkee Hackathon   │    │
│  📬 Messages │   │ Feb 21, 2026  [Edit][🗑] │    │
│  🖼️ Profile  │   │ GenAI Hackathon 2025    │    │
│              │   │ Dec 20, 2025  [Edit][🗑] │    │
│  (SuperAdmin)│   └─────────────────────────┘    │
│  ⚙️ Content  │                                  │
│  👑 Admins   │                                  │
│  📊 Logs     │                                  │
└──────────────┴──────────────────────────────────┘
```

---

## 📤 Deployment Handoff (For B2B Team — cPanel)

Since the team handles hosting, you just deliver the build:

**Frontend:**
1. Run `npm run build` inside `/client`
2. Upload contents of `/dist` → `public_html` on cPanel

**Backend:**
1. Use cPanel's **Node.js App** feature OR set up on a subdomain: `api.bug2build.in`
2. Upload `/server` folder
3. Set Environment Variables in cPanel:
```
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
CLIENT_URL=https://bug2build.in
PORT=5000
```
4. Run `npm install` and start with `node server.js` or use PM2

---

## ✅ Final Checklist

- [x] Existing site sections fully analysed
- [x] Every hardcoded section mapped to a DB model
- [x] Admin can manage: Events, Team, Partners, Brands, Contributors
- [x] SuperAdmin can edit: Hero, About, Contact Info, Manage Admins
- [x] No code changes ever needed after deployment
- [x] B2B Loader on every action
- [x] Dark / Light mode toggle
- [x] Premium color palette defined
- [x] Orbital animation preserved and made dynamic
- [x] Image uploads via Cloudinary
- [x] JWT auth with role-based access
- [x] cPanel deployment handoff guide ready
- [x] 25-day development timeline set