/**
 * Firebase Admin SDK initialization
 *
 * Credentials loaded from environment variables (set in Vercel project settings
 * or .env.local for local dev). NEVER commit the actual service account JSON.
 *
 * The service account has these scopes:
 *   - Firestore: read/write documents
 *   - Authentication: verify user tokens
 *   - Cloud Storage: read/write files
 */

import admin from "firebase-admin";

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (projectId && clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      projectId: "crazysmp",
    });
  } else {
    // During build (no env vars) or local dev without credentials, skip init.
    // API routes that need Firebase will return a friendly error.
    console.warn("[firebase-admin] Missing env vars — Firebase not initialized");
  }
}

export const db = admin.apps.length ? admin.firestore() : null;
export const auth = admin.apps.length ? admin.auth() : null;

export default admin;
