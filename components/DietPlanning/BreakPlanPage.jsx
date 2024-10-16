import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import d from "../../assets/images/d.png"; // Local image for Diet Plan
import w from "../../assets/images/w.png"; // Local image for Workout Plan

const BreakPlanPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Page Title */}
      <Text style={styles.pageTitle}>Meal Break Plans</Text>

      {/* First box: Workout Plan */}
      <TouchableOpacity
        style={styles.box}
        onPress={() => navigation.navigate("WorkoutPlanPage")} // Navigate to WorkoutPage
      >
        <Image
          source={w} // Local workout image
          style={styles.image}
        />
        <Text style={styles.boxText}>Workout Plan</Text>
        <Text style={styles.descriptionText}>
          A structured workout routine to achieve your fitness goals.
        </Text>
      </TouchableOpacity>

      {/* Second box: Meal Plan */}
      <TouchableOpacity
        style={styles.box}
        onPress={() => navigation.navigate("MealPage")} // Navigate to MealPage
      >
        <Image
          source={d} // Local diet image
          style={styles.image}
        />
        <Text style={styles.boxText}>Meal Plan</Text>
        <Text style={styles.descriptionText}>
          A balanced meal plan tailored to your dietary needs.
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  pageTitle: {
    fontSize: 24, // Adjust the font size for the title
    fontWeight: "bold",
    color: "#333",
    marginTop: 40,
    marginBottom: 30, // Space below the title
  },
  box: {
    width: "90%",
    height: 250,
    backgroundColor: "#fff",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 60,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: 700,
    height: 130,
    resizeMode: "contain",
    marginBottom: 10,
    marginTop: -40,
  },
  boxText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center", // Center the description text
    paddingHorizontal: 10, // Add some padding on the sides
  },
});

export default BreakPlanPage;
