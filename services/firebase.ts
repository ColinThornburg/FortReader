import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration - API keys are safe to be public
const firebaseConfig = {
  apiKey: "AIzaSyBPf0T5Y44gisfOePDSudJ72Qwp21y2mHA",
  authDomain: "fortreader-97219.firebaseapp.com",
  projectId: "fortreader-97219",
  storageBucket: "fortreader-97219.firebasestorage.app",
  messagingSenderId: "870904457547",
  appId: "1:870904457547:web:1188c80e02610e367360ce"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
