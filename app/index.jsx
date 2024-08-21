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
import LoginPage from "../components/LoginPage";
import SignUpPage from "../components/SignUpPage";
import AuthenticatedScreen from "../components/CharactersPage";
import Profile from "../components/Profile";

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
  const [showStartScreen, setShowStartScreen] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await fetchUserData(user.uid);
        setCurrentPage("characters");
      } else {
        setCurrentPage("login");
      }
    });

    setTimeout(() => {
      setShowStartScreen(false);
    }, 3000);

    return () => unsubscribe();
  }, [auth]);

  const fetchUserData = async (uid) => {
    console.log("Fetching user data for UID:", uid);
    const userDoc = await getDoc(doc(db, "users", uid));

    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log("User data found:", userData);
      setUserData(userData);
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

  const handleNavigateToProfile = async () => {
    if (user) {
      await fetchUserData(user.uid);
    }
    setCurrentPage("profile");
  };

  if (showStartScreen) {
    return (
      <View style={styles.startScreen}>
        <Text style={styles.appTitle}>My App</Text>
      </View>
    );
  }

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
      {currentPage === "characters" && (
        <AuthenticatedScreen
          user={user}
          handleAuthentication={handleAuthentication}
          navigateToProfile={handleNavigateToProfile}
        />
      )}
      {currentPage === "profile" && (
        <Profile
          user={userData}
          handleAuthentication={handleAuthentication}
          navigateBack={() => setCurrentPage("characters")}
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
