import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

/* =========================
   SIGN UP
========================= */

export async function signUpUsingEmailAndPassword(email, password, name) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    // Set display name ONLY (safe)
    await updateProfile(userCredential.user, {
      displayName: name,
    });

    // Firestore user document is created by Cloud Function
    return {
      success: true,
      data: userCredential.user,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message,
    };
  }
}

/* =========================
   SIGN IN
========================= */

export async function signInUsingEmailAndPassword(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    return {
      success: true,
      data: userCredential.user,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message,
    };
  }
}

/* =========================
   SIGN OUT
========================= */

export async function signOutUser() {
  try {
    await signOut(auth);
    return {
      success: true,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/* =========================
   AUTH LISTENER
========================= */

export function listenToAuthChanges(callback) {
  return onAuthStateChanged(auth, callback);
}

/* =========================
   SAVE USER DATA
========================= */

export async function saveUserData(uid, email, profileData) {
  try {
    const userDocRef = doc(db, "users", uid);

    await setDoc(
      userDocRef,
      {
        email,
        ...profileData,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function CreateDefaultSettings() {
  try {
    // using import.meta.env for Vite instead of process.env setup
    const ipAddress =
      import.meta.env.VITE_PUBLIC_IP_ADDRESS || "localhost:3000";
    const res = await fetch(`${ipAddress}/create-default-settings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: auth.currentUser?.uid,
      }),
    });
    return res;
  } catch (error) {
    console.log(error);
  }
}
