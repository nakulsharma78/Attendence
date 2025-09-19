// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";

const firebaseConfig = {
  "projectId": "studio-2339031565-456a7",
  "appId": "1:603483843033:web:85f15c7805484e034dd1c8",
  "apiKey": "AIzaSyB5E962eUNeFdJtgZSdi5S2IZ-RAyHm3Ro",
  "authDomain": "studio-2339031565-456a7.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "603483843033"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

// Connect to Auth Emulator if running in a non-production environment
// This is a common practice for local development to avoid domain authorization issues.
if (typeof window !== 'undefined' && window.location.hostname === 'localhost' && process.env.NODE_ENV !== 'production') {
  // The default host and port for the auth emulator are localhost:9099
  // If your emulator is running on a different port, change it here.
  try {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
    console.log("Connected to Firebase Auth Emulator");
  } catch (e) {
    // This can happen if the page is hot-reloaded and we try to connect again.
    // It's safe to ignore in a development environment.
  }
}

export { app, auth };
