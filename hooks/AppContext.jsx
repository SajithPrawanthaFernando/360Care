import React, { createContext, useState, useEffect, useContext } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmM5w7JJSAqAC3WCKCykrsdzkwhH-gIxQ",
  authDomain: "loginapp-1c095.firebaseapp.com",
  projectId: "loginapp-1c095",
  storageBucket: "loginapp-1c095.appspot.com",
  messagingSenderId: "398823817487",
  appId: "1:398823817487:web:d8327617a3fe4c8a05be7a",
  measurementId: "G-R03EJX5M8G",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Create Context
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [currentPage, setCurrentPage] = useState("login");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await fetchUserData(user.uid);
        setCurrentPage("diet");
      } else {
        setCurrentPage("login");
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid) => {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      setUserData(userDoc.data());
    }
  };

  const handleAuthentication = async () => {
    try {
      if (user) {
        await signOut(auth);
        setCurrentPage("login");
      } else {
        if (currentPage === "login") {
          await signInWithEmailAndPassword(auth, email, password);
        } else if (currentPage === "signup") {
          if (password === cpassword) {
            const userCredential = await createUserWithEmailAndPassword(
              auth,
              email,
              password
            );
            await setDoc(doc(db, "users", userCredential.user.uid), {
              name,
              email,
            });
            setCurrentPage("login");
          } else {
            alert("Passwords do not match.");
            return;
          }
        }
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <AppContext.Provider
      value={{
        email,
        setEmail,
        password,
        setPassword,
        name,
        setName,
        cpassword,
        setCPassword,
        user,
        userData,
        currentPage,
        setCurrentPage,
        handleAuthentication,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using context
export const useAppContext = () => {
  return useContext(AppContext);
};
