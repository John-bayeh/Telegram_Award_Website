// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAdCHHgH0n221PF9H2BGqNnz_SkJ5cf7K4",
  authDomain: "telegramaward-222cb.firebaseapp.com",
  projectId: "telegramaward-222cb",
  storageBucket: "telegramaward-222cb.firebasestorage.app",
  messagingSenderId: "478662276590",
  appId: "1:478662276590:web:3b77345654f2cce636caff",
  measurementId: "G-SDBK56V438"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Export functions needed for phone authentication
export { RecaptchaVerifier, signInWithPhoneNumber };
