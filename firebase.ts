// firebase.ts
//
// This module initialises Firebase services for the app.  The configuration
// values are pulled from environment variables so that secrets are not
// checked into version control.  See the `.env` file in the project root
// for an example of the required keys.  When using Expo, only variables
// prefixed with `EXPO_PUBLIC_` are automatically exposed to the client.

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Read Firebase configuration from environment variables.  Using
// non‑null assertion (`!`) here will cause a runtime error if a variable
// is missing, helping you catch misconfiguration early.  In production you
// could provide sensible defaults or throw a custom error instead.
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID!,
};

// Initialise Firebase only once.  If you reload the app in development
// (fast refresh) the existing instance will be reused.
const app = initializeApp(firebaseConfig);

// Export Firebase services used in the app.  You can add more exports
// (e.g. Analytics, Remote Config) as your needs grow.
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;