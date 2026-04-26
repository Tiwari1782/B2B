---
name: add-admin-module
description: Step-by-step skill for adding a new CRUD module to the Bug2Build admin dashboard. Use when asked to add a new content type that needs both a backend API and a frontend admin panel tab.
---

# Skill: Add a New Admin CRUD Module

## Before you start

Run the `db-explorer` subagent to check if a similar model already exists.
Run the `api-mapper` subagent to confirm the route doesn't already exist.

---

## Step 1 — Create the Mongoose Model

`server/models/NewThing.js`

```js
const mongoose = require('mongoose');

const newThingSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  isActive:  { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // Add image field if needed — Cloudinary URL string only:
  // photo: String,
}, { timestamps: true });

module.exports = mongoose.model('NewThing', newThingSchema);
```

---

## Step 2 — Create the Controller

`server/controllers/newThingController.js`

Every mutating handler must:
1. Perform the DB operation
2. Log the action via `activityLogger`
3. Return the correct HTTP status

```js
const NewThing = require('../models/NewThing');

exports.getAll    = async (req, res) => { ... };
exports.create    = async (req, res) => { ... };
exports.update    = async (req, res) => { ... };
exports.remove    = async (req, res) => { ... };
```

If it needs image upload, run the `cloudinary-upload-checker` subagent first to match the existing Multer pattern.

---

## Step 3 — Add Admin Routes

In `server/routes/adminRoutes.js`, behind `authMiddleware`:

```js
const newThingController = require('../controllers/newThingController');

router.get   ('/newthings',     newThingController.getAll);
router.post  ('/newthings',     newThingController.create);
router.put   ('/newthings/:id', newThingController.update);
router.delete('/newthings/:id', newThingController.remove);
```

Run the `auth-guard-checker` subagent to confirm middleware is correctly applied.

---

## Step 4 — Add Public GET Route (if needed)

In `server/routes/publicRoutes.js`:

```js
router.get('/newthings', getAllPublic);
```

---

## Step 5 — Frontend: Add Tab to AdminDashboard

In `client/src/pages/AdminDashboard.jsx`:

1. Add tab entry with an HiOutline icon from `react-icons` — no emojis
2. Create the panel component with CRUD UI
3. All API calls go through `client/src/services/api.js` — no raw fetch/axios
4. Every success and error must trigger a toast:

```js
import toast from '../components/common/ToastNotification';

toast.success('Item added successfully.');
toast.error('Failed to add item.');
```

Run the `frontend-scout` subagent on `AdminDashboard.jsx` first to understand the existing tab pattern before adding a new one.

---

## Step 6 — Activity Logging

In every mutating controller method, follow the existing pattern in `activityLogger.js`. No mutating action should be silent.

---

## Final Checklist

- [ ] Model has `timestamps: true`
- [ ] Image fields are Cloudinary URL strings — never binary
- [ ] Routes are behind `authMiddleware`
- [ ] Activity logged on create, update, delete
- [ ] Frontend toast on every success and every error
- [ ] No hardcoded hex colors — use CSS tokens from `index.css`
- [ ] No `react-hot-toast` — custom `ToastNotification` only
- [ ] Icons from `react-icons` HiOutline set — no emojis
- [ ] All API calls through `api.js`
- [ ] Admin page/tab wrapped in `<ProtectedRoute>` with correct `requiredRole` prop