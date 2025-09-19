// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  "projectId": "studio-2339031565-456a7",
  "appId": "1:603483843033:web:85f15c7805484e034dd1c8",
  "apiKey": "AIzaSyB5E962eUNeFdJtgZSdi5S2IZ-RAyHm3Ro",
  "authDomain": "studio-2339031565-456a7.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "603483843033"
};

if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  firebaseConfig.authDomain = 'localhost';
}

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
