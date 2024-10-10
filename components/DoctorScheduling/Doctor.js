// app/index.js
import React from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "expo-router";

const Doctor = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to 360Care!</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("TopDoctors")}
      >
        <Text style={styles.buttonText}>Go to Top Doctors</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.adminButton]}
        onPress={() => navigation.navigate("AdminHome")}
      >
        <Text style={styles.buttonText}>Admin Page</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F8FF", // Light background
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000000", // Dark blue color for title
    marginBottom: 40, // Space below title
  },
  button: {
    backgroundColor: "#3498DB", // Primary button color
    padding: 15,
    borderRadius: 8,
    width: "80%", // Button takes 80% of width
    alignItems: "center", // Center text inside button
    marginBottom: 20, // Space between buttons
  },
  adminButton: {
    backgroundColor: "#3498DB", // Different color for Admin button
  },
  buttonText: {
    color: "#FFFFFF", // White text color
    fontSize: 18,
    fontWeight: "600", // Slightly bolder text
  },
});

export default Doctor;
