import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmM5w7JJSAqAC3WCKCykrsdzkwhH-gIxQ",
  authDomain: "loginapp-1c095.firebaseapp.com",
  projectId: "loginapp-1c095",
  storageBucket: "loginapp-1c095.appspot.com",
  messagingSenderId: "398823817487",
  appId: "1:398823817487:web:d8327617a3fe4c8a05be7a",
  measurementId: "G-R03EJX5M8G",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app); // Firestore
export const storage = getStorage(app); // Storage
