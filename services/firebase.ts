import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Default Firebase configuration for the FortReader production project
const defaultFirebaseConfig = {
  apiKey: "AIzaSyBPf0T5Y44gisfOePDSudJ72Qwp21y2mHA",
  authDomain: "fortreader-97219.firebaseapp.com",
  projectId: "fortreader-97219",
  storageBucket: "fortreader-97219.firebasestorage.app",
  messagingSenderId: "870904457547",
  appId: "1:870904457547:web:38eddbbdc6feba467360ce"
};

// Allow local overrides through Vite environment variables for personal Firebase projects
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || defaultFirebaseConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || defaultFirebaseConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || defaultFirebaseConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || defaultFirebaseConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || defaultFirebaseConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || defaultFirebaseConfig.appId,
};

if (!firebaseConfig.apiKey) {
  console.error('Firebase configuration is missing an apiKey. Check .env.local settings.');
  throw new Error('Missing Firebase apiKey');
}

if (import.meta.env.DEV) {
  console.info('Firebase initialized', {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain
  });
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
