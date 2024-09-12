import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import onboard2 from "../assets/images/onboarding2.png";

const OnboardingScreen2 = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => navigation.navigate("GetStarted")}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <Image source={onboard2} style={styles.image} />

      <Text style={styles.title}>
        Get personalized diet plans for your health goals.
      </Text>

      <View style={styles.paginationContainer}>
        <View style={[styles.paginationDot, { backgroundColor: "#0000FF" }]} />
        <View style={styles.paginationDot} />
        <View style={styles.paginationDot} />
      </View>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => navigation.navigate("Onboarding3")}
      >
        <Feather name="arrow-right" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 40,
    justifyContent: "space-between",
  },
  skipButton: {
    alignSelf: "flex-end",
  },
  skipText: {
    color: "#888",
    fontSize: 16,
  },
  image: {
    width: "100%",
    height: 364, // Adjust the height based on the design
    resizeMode: "contain",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    padding: 20,
    marginBottom: 20,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#C4C4C4",
    marginHorizontal: 4,
  },
  nextButton: {
    backgroundColor: "#007AFF", // Blue color for the button
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    position: "absolute",
    bottom: 40,
    right: 20,
  },
});

export default OnboardingScreen2;
