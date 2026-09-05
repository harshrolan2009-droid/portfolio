# Admin panel — how to use it

## Logging in

1. Go to `yoursite.com/admin`
2. Type anything in the email box (it's not checked yet — see "About the password" below)
3. Password: `demo` (demo password — change this before sharing the site publicly, see "Locking the admin panel for real" below)
4. Click "Enter workspace"

## Editing text

Every section in the left sidebar is a form — change the text, click Save. No code involved:

- **Hero & settings** — your name, title, homepage description, availability line, contact email
- **About** — the about page copy
- **Projects / Skills / Services / Education / Experience / Testimonials** — add, edit, delete, publish/unpublish entries
- **Navigation** — the menu labels and links
- **Appearance / SEO / Settings** — colors, site title, meta description, etc.
- **Messages** — anything submitted through your contact form shows up here

## Uploading & changing images

This is new. Anywhere you see an image box with an "Upload image" button:

1. Click **Upload image**
2. Pick a photo from your phone
3. Wait for "Uploaded ✓" — the image box updates automatically, and the URL field next to it fills in by itself

You can do this for:
- Your **homepage portrait** and **contact page illustration** (Hero & settings)
- A project's **cover image** (Projects → edit a project)
- Extra project **gallery photos** (same screen, "Add photo to gallery" button)
- **Media library** (left sidebar) — a general upload spot. Upload anything here, copy its URL, and paste that URL into any other image field on the site (e.g. a testimonial photo) that doesn't have its own upload button yet

You can also just paste a URL directly into the text field if you already have one hosted somewhere (Imgur, Firebase, GitHub, etc.) — the upload button is a shortcut, not a requirement.

## Image hosting — the easy way (recommended)

You don't need Firebase just to make image links real. **imgbb** has a free API built exactly for this — sign up, grab one key, paste it into one file, done. About 2 minutes:

1. Go to [api.imgbb.com](https://api.imgbb.com/) → sign in (Google account works) → it hands you an API key on that page
2. Open `js/image-host-config.js` and paste it in:
   ```js
   window.IMAGE_HOST_CONFIG = {
     imgbbApiKey: "your-key-here"
   };
   ```
3. Redeploy. From now on, every "Upload image" button sends straight to imgbb and comes back with a real `https://i.ibb.co/...` link — works for any visitor, on any device, permanently. The Media library page will tell you which hosting mode is currently active.

This only handles images. Your text content still needs Firebase (below) if you want it to sync across devices too — but for photos alone, imgbb is the fastest path to "it just works."

## How image hosting actually works right now

Your site currently runs in **local-only mode** — there's no Firebase project connected yet (`js/firebase-config.js` has empty keys). That affects images:

- When you upload a photo, the admin panel tries, in order: **Firebase Storage** (if you've connected it) → **imgbb** (if you've filled in `js/image-host-config.js`) → and only if neither is set up, it shrinks the photo and saves it as embedded data in **this browser's local storage, on this device only**.
- The Media library page always tells you which of the three is currently active.
- Local-only mode is fine for editing and previewing, but it is **not** how your live, public site should serve images to visitors long-term — see the imgbb steps above for the fast fix, or Firebase below for the full solution.

### To make uploads real, shared, and permanent: connect Firebase (~15 minutes, free tier)

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → **Create a project**
2. In the project, enable:
   - **Firestore Database** (for your text content)
   - **Storage** (for images)
   - **Authentication** → Email/Password (for your login)
3. Add a web app to the project (the `</>` icon) — it'll give you a config object with `apiKey`, `authDomain`, `projectId`, etc.
4. Paste those values into `js/firebase-config.js`, replacing the empty strings
5. In **Authentication**, add yourself as a user (your email + a strong password)
6. Give that user the admin claim (`admin: true`) using a one-off Cloud Function or the Firebase Admin SDK — this is the one step that needs a tiny bit of setup help; ask me when you get there and I'll write the exact script for your project
7. In **Storage** and **Firestore rules**, restrict writes to admin-only, public reads to published content (I can generate these rules for you once your project exists)

Once that's connected:
- The "EMAIL" field on the login screen becomes real (Firebase Auth), and the password above stops being used at all
- Every image you upload goes to Firebase Storage and gets a real `https://` URL any visitor, on any device, can load
- All your text edits sync the same way (they already have a sync path built in — `save()` calls `HarshFirebase.saveData()` automatically once configured)

## Locking the admin panel for real (do this before you share the link)

By default `/admin` is only protected by a password check that runs in the browser (`demo`, in `js/admin.js`). That's fine for building on your own machine, but anyone who views the page source can read that password, and anyone can bypass the check from the browser console — it isn't real security.

This project ships with a real, server-side lock that works once it's deployed to Netlify, on the free tier, no Firebase required:

1. Deploy the site to Netlify (see "Upload / deploy" below) at least once, so the site exists.
2. In the Netlify dashboard: **Site settings → Environment variables → Add a variable**, and add two:
   - `ADMIN_PASSWORD` — the password you want to log in with (pick something only you know; it replaces `CHANGE_ME_BEFORE_USE`)
   - `SESSION_SECRET` — any long random string (e.g. generate one at [1password.com/password-generator](https://1password.com/password-generator/) or run `openssl rand -hex 32` on your computer) — this is just used to sign the login session, you never type it in
3. Redeploy the site (Netlify → **Deploys → Trigger deploy**) so the new variables take effect.
4. Visit `/admin` — you'll be sent to a real login page (`/admin-login.html`). Enter the `ADMIN_PASSWORD` you set. A Netlify Function checks it on the server and hands back a signed, `HttpOnly` cookie; a Netlify Edge Function then checks that cookie on every request to `/admin/*` before the page is even sent to the browser. There's nothing to find in the JavaScript and nothing to bypass from devtools, because an unauthenticated browser never receives the protected page at all.
5. Sessions last 12 hours, then you'll need to log in again. Use "Sign out" in the sidebar to end one early.

If you ever deploy somewhere other than Netlify (or run it locally with `npm run dev`), the Edge Function isn't available, so the site quietly falls back to the old in-browser password (`demo`, changeable in `js/admin.js`) — good enough for local editing, not for a public link.

Once Firebase Auth is wired up (see the Firebase section above), that becomes a second, independent layer of real authentication for the admin data itself — the Netlify lock above and Firebase Auth aren't mutually exclusive, and using both is the strongest setup.

## Upload / deploy

This is a static site with two small serverless pieces (a Netlify Function and an Edge Function) for the admin lock, so the easiest host is Netlify:

1. Go to [app.netlify.com](https://app.netlify.com) → **Add new site → Deploy manually**, and drag the whole project folder (the one with `netlify.toml` in it) onto the page. Netlify reads `netlify.toml`, runs `npm run build`, and publishes `dist/public` automatically.
   - Or, if the project is in a GitHub repo: **Add new site → Import an existing project**, and pick the repo — same build settings apply automatically.
2. Right after the first deploy, follow "Locking the admin panel for real" above to set `ADMIN_PASSWORD` and `SESSION_SECRET`, then trigger a redeploy.
3. That's it — `yoursite.netlify.app` is live, and `yoursite.netlify.app/admin` is real, server-checked, password-protected.

You can also add a custom domain later from **Site settings → Domain management**.

## Quick reference

| Want to... | Where |
|---|---|
| Change your name/title/bio | Hero & settings |
| Change the about page | About |
| Add a project | Projects → Add Project |
| Swap your homepage photo | Hero & settings → Homepage portrait |
| Swap the contact page illustration | Hero & settings → Contact page illustration |
| Upload any image for later use | Media (sidebar) |
| See contact form submissions | Messages |
| Change the real (server-checked) admin password | Netlify → Site settings → Environment variables → `ADMIN_PASSWORD`, then redeploy |
| Change the local-only fallback password | `js/admin.js` → find `LOCAL_ADMIN_PASSWORD` |
