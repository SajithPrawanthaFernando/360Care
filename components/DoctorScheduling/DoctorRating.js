// app/DoctorRating.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../hooks/firebaseConfig"; // Firebase config
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "expo-router"; // Expo Router's useNavigation

const DoctorRating = () => {
  const navigation = useNavigation(); // Initialize navigation
  const route = useRoute();
  const { doctorId, doctorName } = route.params || {};
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleRatingPress = (value) => {
    setRating(value);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert("Error", "Please select a rating before submitting.");
      return;
    }

    try {
      const doctorRef = doc(db, "topDoctors", doctorId);
      const doctorSnapshot = await getDoc(doctorRef);

      if (!doctorSnapshot.exists()) {
        Alert.alert("Error", "Doctor not found.");
        return;
      }

      const doctorData = doctorSnapshot.data();
      const currentRating = doctorData.rating || 0; // Default to 0
      const numOfRatings = doctorData.numOfRatings || 0; // Default to 0

      // Calculate new average rating
      const newNumOfRatings = numOfRatings + 1;
      const newRating =
        (currentRating * numOfRatings + rating) / newNumOfRatings;

      // Update the doctor document with the new rating
      await updateDoc(doctorRef, {
        rating: newRating,
        numOfRatings: newNumOfRatings,
      });

      // Store the individual rating in the doctorRatings collection
      await addDoc(collection(db, "doctorRatings"), {
        doctorId,
        doctorName,
        rating,
        timestamp: new Date(),
      });

      setSubmitted(true);
      Alert.alert("Success", "Thank you for your rating!");
      router.back();
    } catch (error) {
      console.error("Error submitting rating: ", error);
      Alert.alert("Error", "Failed to submit rating.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        {/* Page Title */}
        <Text style={styles.header}>Doctor Rating</Text>
      </View>

      <Text style={styles.subHeader}>Rate {doctorName}</Text>

      {/* Rating system */}
      <View style={styles.ratingContainer}>
        <Text style={styles.label}>Select your rating:</Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((value) => (
            <TouchableOpacity
              key={value}
              onPress={() => handleRatingPress(value)}
            >
              <Ionicons
                name={value <= rating ? "star" : "star-outline"}
                size={40}
                color={value <= rating ? "#FFD700" : "#BDBDBD"}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          { backgroundColor: rating === 0 ? "#BDBDBD" : "#00796B" },
        ]}
        onPress={handleSubmit}
        disabled={submitted || rating === 0}
      >
        <Text style={styles.submitButtonText}>
          {submitted ? "Submitted" : "Submit Rating"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  headerContainer: {
    position: "relative", // Ensures relative positioning of the header elements
    justifyContent: "center", // Centers the title horizontally
    alignItems: "center", // Centers the title vertically within its container
    marginBottom: 16,
  },
  backButton: {
    position: "absolute", // Keep the back button on the left without affecting the title's position
    left: 0,
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  subHeader: {
    fontSize: 22,
    textAlign: "center",
    color: "#34495E",
    marginBottom: 40,
  },
  ratingContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  label: {
    fontSize: 18,
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: "row",
  },
  submitButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default DoctorRating;
