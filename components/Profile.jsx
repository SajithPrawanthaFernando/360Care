import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Import Firestore

const Profile = ({ handleLogout, navigateBack }) => {
  const [userData, setUserData] = useState(null);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser; // Get current user
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data()); // Set user data if exists
        } else {
          console.log("No user data found!");
        }
      }
    };

    fetchUserData(); // Fetch data when Profile page loads
  }, [auth, db]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My App</Text>
      {userData ? (
        <>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoText}>{userData.name}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoText}>{userData.email}</Text>
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout} // Use handleLogout for logout
          >
            <Text style={styles.logoutButtonText}>Log out</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.infoText}>No user is logged in.</Text>
      )}
      <TouchableOpacity style={styles.backButton} onPress={navigateBack}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    color: "#fff",
    marginBottom: 20,
  },
  infoContainer: {
    width: "80%",
    height: 80,
    backgroundColor: "#495057",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 18,
    color: "#fff",
  },
  logoutButton: {
    height: 50,
    width: "80%",
    backgroundColor: "#ffc107",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
  },
  logoutButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#3498db",
    borderRadius: 5,
    height: 50,
    paddingVertical: 12,
    borderRadius: 10,
    width: "80%",
    marginBottom: 16,
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Profile;
