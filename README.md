# 🚀 Harsh's Portfolio

A modern, fast personal portfolio website — built entirely in vanilla HTML, CSS, and JavaScript, with a full no-code admin dashboard to manage every part of the site. Firebase-ready for real-time sync across visitors.

🔗 **Live site:** _add your Netlify URL here_

---

## ✨ Features

### 🖥️ Public Site
- Dashboard-style animated homepage
- Dedicated pages: About, Projects, Skills, Services, Education, Experience, Testimonials, Contact, Resume
- Smooth page-transition animations and motion effects
- Fully responsive, mobile-first design
- Custom favicon and branding
- SEO-friendly structure (`robots.txt` included)

### 🔐 Admin CMS (`/admin`)
- Secure server-side gated login (Netlify Edge Function + session-based auth)
- Grouped sidebar navigation: **Dashboard · Content · Media & Messages · Site**
- No-code content editing for:
  - Hero / About section
  - Projects
  - Skills
  - Services
  - Education
  - Experience
  - Testimonials
  - Navigation
- **Media library** with image uploads (via imgbb link-hosting)
- **Backup system** — export/import all site data as JSON
- **Danger zone** — reset or delete all content safely

### ⚙️ Tech & Architecture
- Pure vanilla JS — no frontend framework, no build-heavy bloat
- Optional **Firebase** backend (Auth + Firestore + Storage) for multi-visitor sync — currently runs in local/demo mode by default
- Data adapter pattern (`data-adapter.js` / `firebase-adapter.js`) so it works with or without Firebase configured
- Netlify Edge Functions for admin route protection
- Netlify Functions for login/logout handling
- Clean build pipeline (`build.js`) outputting to `dist/`

---

## 🛠️ Tech Stack

`HTML5` `CSS3` `JavaScript (ES Modules)` `Firebase` `Netlify Functions` `Netlify Edge Functions` `Node.js`

---

## 📦 Getting Started

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Build for production
npm run build
```

See `ADMIN-GUIDE.md` for admin login setup and `FIREBASE_SETUP.md` for connecting a real Firebase project.

---

## 📁 Project Structure

```
├── admin.html / admin-login.html   # Admin CMS
├── index.html, about.html, ...     # Public pages
├── js/                             # App logic, data adapters, admin logic
├── css/                            # Styles
├── assets/                         # Images & icons
├── netlify/functions/              # Serverless functions
├── netlify/edge-functions/         # Admin route gating
├── build.js                        # Build script → dist/
└── netlify.toml                    # Deployment config
```

---

## 📄 License

Personal project — feel free to explore the code for learning purposes.
