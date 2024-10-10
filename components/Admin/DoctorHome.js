// app/AdminHome.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "expo-router";

const DoctorHome = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("AddDoctor")}
      >
        <Text style={styles.buttonText}>Add New Doctor</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.viewListButton]}
        onPress={() => navigation.navigate("DoctorList")}
      >
        <Text style={styles.buttonText}>View Doctors List</Text>
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
  viewListButton: {
    backgroundColor: "#3498DB", // Different color for View Doctors List button
  },
  buttonText: {
    color: "#FFFFFF", // White text color
    fontSize: 18,
    fontWeight: "600", // Slightly bolder text
  },
});

export default DoctorHome;
