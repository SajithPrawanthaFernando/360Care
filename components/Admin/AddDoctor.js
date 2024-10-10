// app/AddDoctor.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { db } from "../../hooks/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "expo-router";

const AddDoctor = () => {
  const navigation = useNavigation();
  const [doctor, setDoctor] = useState({
    name: "",
    type: "",
    rating: "",
    about: "",
    workingDays: "",
    workingTime: "",
    location: "",
    charges: "",
    contactNumber: "",
    emailAddress: "",
    image: "",
  });
  const [imageUri, setImageUri] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Function to pick image from gallery
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3], // Adjust aspect ratio for cropping if needed
        quality: 1, // Image quality from 0 to 1
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri); // Storing the selected image URI
      }
    } catch (error) {
      console.error("Error picking image: ", error);
      Alert.alert("Error", "There was an issue picking the image.");
    }
  };

  // Function to upload image to Firebase Storage
  const uploadImage = async (uri) => {
    if (!uri) return null; // Return if no image selected
    try {
      setIsUploading(true); // Start uploading
      const storage = getStorage();
      const response = await fetch(uri);
      const blob = await response.blob();

      // Create a unique image reference in Firebase Storage
      const storageRef = ref(storage, `doctors/${Date.now()}_doctor.jpg`);
      await uploadBytes(storageRef, blob);

      // Get the download URL of the uploaded image
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image: ", error);
      Alert.alert("Upload Failed", "There was an issue uploading the image.");
      return null;
    } finally {
      setIsUploading(false); // Finish uploading
    }
  };

  // Function to validate input fields
  const validateInputs = () => {
    const {
      name,
      type,
      rating,
      about,
      workingDays,
      workingTime,
      location,
      charges,
      contactNumber,
      emailAddress,
    } = doctor;

    if (
      !name ||
      !type ||
      !rating ||
      !about ||
      !workingDays ||
      !workingTime ||
      !location ||
      !charges ||
      !contactNumber ||
      !emailAddress
    ) {
      Alert.alert("Validation Error", "Please fill in all fields.");
      return false;
    }

    if (isNaN(rating) || rating < 0 || rating > 5) {
      Alert.alert(
        "Validation Error",
        "Rating must be a number between 0 and 5."
      );
      return false;
    }

    if (isNaN(charges) || charges < 0) {
      Alert.alert("Validation Error", "Charges must be a positive number.");
      return false;
    }

    return true; // All validations passed
  };

  // Function to handle adding a new doctor
  const handleAddDoctor = async () => {
    if (!validateInputs()) return; // Stop if validation fails

    try {
      let imageUrl = "";
      if (imageUri) {
        imageUrl = await uploadImage(imageUri); // Upload image and get the URL
      }

      // Prepare the doctor data, ensuring all fields match the expected schema
      const doctorData = {
        name: doctor.name || "Unknown", // Default value if name is not provided
        type: doctor.type || "General", // Default to General if type is not provided
        rating: Number(doctor.rating) || 0, // Ensure rating is a number, default to 0
        about: doctor.about || "No description", // Default description if not provided
        workingDays: doctor.workingDays || "N/A", // Default value if not provided
        workingTime: doctor.workingTime || "N/A", // Default value if not provided
        location: doctor.location || "N/A", // Default location if not provided
        charges: Number(doctor.charges) || 0, // Ensure charges is a number, default to 0
        contactNumber: doctor.contactNumber.split(",") || [], // Ensure contact number is an array
        emailAddress: doctor.emailAddress || "N/A", // Default email if not provided
        image: imageUrl || doctor.image, // Use uploaded image URL or existing one
      };

      // Add doctor to the Firestore collection
      const doctorsCollection = collection(db, "topDoctors");
      await addDoc(doctorsCollection, doctorData);

      console.log("Doctor added successfully");
      Alert.alert("Success", "Doctor added successfully!");
      navigation.goBack(); // Go back to AdminHome after adding
    } catch (error) {
      console.error("Error adding doctor: ", error);
      Alert.alert("Error", "Failed to add the doctor.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>Add a New Doctor</Text>

      <TextInput
        style={styles.input}
        placeholder="Doctor Name"
        onChangeText={(text) => setDoctor({ ...doctor, name: text })}
        value={doctor.name}
      />

      <TextInput
        style={styles.input}
        placeholder="Doctor Type"
        onChangeText={(text) => setDoctor({ ...doctor, type: text })}
        value={doctor.type}
      />

      <TextInput
        style={styles.input}
        placeholder="Rating (out of 5)"
        onChangeText={(text) => setDoctor({ ...doctor, rating: text })}
        keyboardType="numeric"
        value={doctor.rating}
      />

      <TextInput
        style={styles.input}
        placeholder="About"
        onChangeText={(text) => setDoctor({ ...doctor, about: text })}
        value={doctor.about}
      />

      <TextInput
        style={styles.input}
        placeholder="Working Days (e.g., Mon-Fri)"
        onChangeText={(text) => setDoctor({ ...doctor, workingDays: text })}
        value={doctor.workingDays}
      />

      <TextInput
        style={styles.input}
        placeholder="Working Time (e.g., 9AM-5PM)"
        onChangeText={(text) => setDoctor({ ...doctor, workingTime: text })}
        value={doctor.workingTime}
      />

      <TextInput
        style={styles.input}
        placeholder="Location"
        onChangeText={(text) => setDoctor({ ...doctor, location: text })}
        value={doctor.location}
      />

      <TextInput
        style={styles.input}
        placeholder="Charges (number)"
        onChangeText={(text) => setDoctor({ ...doctor, charges: text })}
        keyboardType="numeric"
        value={doctor.charges}
      />

      <TextInput
        style={styles.input}
        placeholder="Contact Numbers (comma-separated)"
        onChangeText={(text) => setDoctor({ ...doctor, contactNumber: text })}
        value={doctor.contactNumber}
      />

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        onChangeText={(text) => setDoctor({ ...doctor, emailAddress: text })}
        value={doctor.emailAddress}
      />

      {/* Image Upload Section */}
      <TouchableOpacity style={styles.pickImageBtn} onPress={pickImage}>
        <Text style={styles.pickImageText}>Pick an Image</Text>
      </TouchableOpacity>

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
      )}

      {isUploading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <TouchableOpacity style={styles.submitButton} onPress={handleAddDoctor}>
          <Text style={styles.submitButtonText}>Add Doctor</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    flexGrow: 1,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    backgroundColor: "#fff",
  },
  pickImageBtn: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  pickImageText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },

  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default AddDoctor;
