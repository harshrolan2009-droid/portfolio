# Firebase connection

This portfolio is intentionally dependency-free in the browser. To enable the live CMS:

1. Create a Firebase Web App, enable Email/Password Authentication, Firestore, and Storage.
2. Copy its public web configuration into `js/firebase-config.js`.
3. Set the custom claim `{ "admin": true }` on the administrator account with a trusted server-side script or Firebase Admin tooling.
4. Deploy `firestore.rules` and `storage.rules`.

With a configured project, public pages load the latest published Firestore data, contact submissions are written to `messages`, and the workspace requires the `admin` custom claim. With blank config, the site stays usable as a local-first demo using browser storage; that fallback is not intended for production authentication.