import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAgy-4LZZDEzWCRdMJFkeumhABljKEDU4Q",
  authDomain: "curaai-27023.firebaseapp.com",
  projectId: "curaai-27023",
  storageBucket: "curaai-27023.firebasestorage.app",
  messagingSenderId: "721018161379",
  appId: "1:721018161379:web:3dbb3216d4b96fa2dc5dd6",
  measurementId: "G-KMGRTV7L04",
};
// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);
