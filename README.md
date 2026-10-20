# Edu Box Booking

A static booking app with Firebase Firestore storage and a Firebase Authentication-protected admin page.

## Firebase setup

1. Create a Firebase project at https://console.firebase.google.com/ and register a Web app.
2. Copy the web app configuration into `firebase-config.js`, replacing each `YOUR_...` value.
3. In Firebase Console, create a Firestore database.
4. Enable **Authentication → Sign-in method → Email/Password**. Create the admin account under **Authentication → Users**; do not add a public sign-up flow.
5. Edit `firestore.rules` and replace `REPLACE_WITH_ADMIN_EMAIL` with that exact admin email address. Publish the rules in **Firestore Database → Rules** (or deploy the rules file with Firebase CLI).
6. Serve or publish the site using an HTTP(S) host. ES modules and Firebase will not work if the page is opened as a `file://` URL.

The booking page writes booking records to Firestore. The admin dashboard at `/admin/` requires Firebase email/password sign-in and the Firestore rules limit reading/deleting records to the configured admin email. Keep the Firestore rules published; a hidden admin link is not security.

## Publish with GitHub Pages

1. Create a GitHub repository and upload/push the contents of this folder to its root (including the `admin` folder and Firebase files).
2. In the repository, open **Settings → Pages** and choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
3. After GitHub Pages finishes deploying, open the published repository URL. The admin page is at the same URL followed by `/admin/`.
4. In Firebase Authentication settings, add the GitHub Pages hostname under **Authorized domains** if it is not already listed.

Firebase web configuration is intended to be present in a public client app; security depends on Authentication and Firestore rules, not hiding the API key. Never put Firebase Admin SDK credentials or service-account JSON in this repository.

## Notes

- Booking documents are stored centrally in Firestore and can be searched/deleted from the admin page.
- The displayed remaining-slot count is currently browser-local and is not a cross-user inventory lock. Use a trusted Cloud Function or server-side transaction before relying on slot limits for real inventory.