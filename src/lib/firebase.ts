// Minimal Firebase initializer used by the app.
// This file is intentionally permissive: if no VITE_FIREBASE_API_KEY is set,
// it will skip initialization so the dev server can run without secrets.

import { initializeApp, getApps } from 'firebase/app';

const env = import.meta.env as Record<string, unknown>;

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: env.VITE_FIREBASE_APP_ID as string | undefined,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID as string | undefined,
};

// Initialize only if we have at least an API key and no existing app.
if (firebaseConfig.apiKey) {
  try {
    if (!getApps().length) {
      initializeApp(firebaseConfig);
       
      console.log('[firebase] initialized');
    }
  } catch (err) {
     
    console.warn('[firebase] initialization failed:', err);
  }
} else {
   
  console.info('[firebase] VITE_FIREBASE_API_KEY not set — skipping firebase init');
}

export {};
