import React, { useState, useEffect } from "react";
import { ScrollView, Text, View, StyleSheet, Alert } from "react-native";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore";
import LoginPage from "./LoginPage";
import SignUpPage from "./SignUpPage";
import Diet from "../components/DietPlanning/Diet";
import Profile from "./Profile";

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

const HomeScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [cpassword, setcPassword] = useState("");
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
  }, [auth]);

  const fetchUserData = async (uid) => {
    console.log("Fetching user data for UID:", uid); // Debugging
    const userDoc = await getDoc(doc(db, "users", uid));

    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log("User data found:", userData); // Debugging
      setUserData(userData); // Setting userData
      setUser(userData);
    } else {
      console.log("No such user document!");
    }
  };

  const handleAuthentication = async () => {
    try {
      if (user) {
        console.log("User logged out successfully!");
        await signOut(auth);
        setCurrentPage("login");
      } else {
        if (currentPage === "login") {
          await signInWithEmailAndPassword(auth, email, password);
          console.log("User signed in successfully!");
        } else if (currentPage === "signup") {
          if (password === cpassword) {
            const userCredential = await createUserWithEmailAndPassword(
              auth,
              email,
              password
            );
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
              name: name,
              email: email,
            });

            console.log("User created successfully!");
            setCurrentPage("login"); // Navigate to login after signup
          } else {
            Alert.alert("Error", "Passwords do not match.");
            return;
          }
        }
      }
    } catch (error) {
      console.error("Authentication error:", error.message);
      Alert.alert("Authentication Error", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      console.log("Attempting to log out..."); // Debugging
      await signOut(auth);
      console.log("User logged out successfully!");
      setCurrentPage("login");
    } catch (error) {
      console.error("Logout error:", error.message);
      Alert.alert("Logout Error", error.message);
    }
  };

  const handleNavigateToProfile = async () => {
    if (user) {
      await fetchUserData(user.uid);
    }
    setCurrentPage("profile");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {currentPage === "login" && (
        <LoginPage
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleAuthentication={handleAuthentication}
          setCurrentPage={setCurrentPage}
        />
      )}
      {currentPage === "signup" && (
        <SignUpPage
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          cpassword={cpassword}
          setcPassword={setcPassword}
          handleAuthentication={handleAuthentication}
          setCurrentPage={setCurrentPage}
        />
      )}
      {currentPage === "diet" && (
        <Diet user={user} handleAuthentication={handleAuthentication} />
      )}

      {currentPage === "profile" && (
        <Profile
          handleLogout={handleLogout}
          navigateBack={() => setCurrentPage("diet")}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  startScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#343a40",
  },
  appTitle: {
    fontSize: 24,
    color: "#fff",
  },
});

export default HomeScreen;
