import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Profile = ({ user, handleAuthentication, navigateBack }) => {
  console.log(user);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My App</Text>
      {user ? (
        <>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoText}>{user.name}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoText}>{user.email}</Text>
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleAuthentication}
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
    width: windowWidth,
    height: windowHeight,
    margin: 10,
    backgroundColor: "#343a40",
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
    textAlign: "center",
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
