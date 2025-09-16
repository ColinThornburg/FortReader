import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || "AIzaSyB57hvabkTJ86itAQjwW6SlIIZtEDvwG1g"),
        'process.env.FIREBASE_API_KEY': JSON.stringify(env.FIREBASE_API_KEY || "AIzaSyBPf0T5Y44gisfOePDSudJ72Qwp21y2mHA"),
        'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(env.FIREBASE_AUTH_DOMAIN || "fortreader-97219.firebaseapp.com"),
        'process.env.FIREBASE_PROJECT_ID': JSON.stringify(env.FIREBASE_PROJECT_ID || "fortreader-97219"),
        'process.env.FIREBASE_STORAGE_BUCKET': JSON.stringify(env.FIREBASE_STORAGE_BUCKET || "fortreader-97219.firebasestorage.app"),
        'process.env.FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(env.FIREBASE_MESSAGING_SENDER_ID || "870904457547"),
        'process.env.FIREBASE_APP_ID': JSON.stringify(env.FIREBASE_APP_ID || "1:870904457547:web:38eddbbdc6feba467360ce")
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
