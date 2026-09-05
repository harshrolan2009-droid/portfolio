# Admin workspace access

See **ADMIN-GUIDE.md** for full day-to-day usage. This file is just the short version.

## Local preview

1. `npm run dev` (or `npm start`)
2. Open `http://localhost:3000/admin`
3. Enter the local password set in `js/admin.js` (`LOCAL_ADMIN_PASSWORD`)

Local preview only checks the password in the browser and only saves to that
browser's storage — it's for editing on your own machine, not a public link.

## Live site (Netlify)

Once deployed to Netlify with `ADMIN_PASSWORD` and `SESSION_SECRET` set as
environment variables (see ADMIN-GUIDE.md → "Locking the admin panel for
real"), `/admin` is protected by a real server-side check:

1. Open `/admin` on the deployed site.
2. You're redirected to `/admin-login.html` if you don't already have a
   valid session.
3. Enter the `ADMIN_PASSWORD` you configured in Netlify. A Netlify Function
   verifies it on the server and a signed, `HttpOnly` cookie is issued.
4. A Netlify Edge Function checks that cookie on every `/admin/*` request
   before the page is served — an unauthenticated visitor never receives
   the admin page or its JavaScript.

## Optional: Firebase production mode

If `js/firebase-config.js` is filled in with a real Firebase project, the
login screen also supports signing in with a Firebase Authentication
account (email + password), and content saves sync to Firestore for every
visitor instead of staying local to one browser. See ADMIN-GUIDE.md for the
step-by-step setup. This is independent of — and can be used alongside —
the Netlify-based lock above.

## What the panel controls

- Hero and about content
- Projects, skills, services, education, experience, and testimonials
- Contact messages
- Navigation
- Media library / image uploads
- Appearance tokens
- SEO metadata
- Resume settings
- General site settings

Each of these is its own page under `/admin/...` (e.g. `/admin/about`,
`/admin/education`) — the sidebar links and the browser's back/forward
buttons both work as you'd expect.
