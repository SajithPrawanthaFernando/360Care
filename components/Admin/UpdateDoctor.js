// app/UpdateDoctor.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { db } from "../../hooks/firebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const UpdateDoctor = () => {
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
    image: "", // Add image field
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const route = useRoute();
  const { id } = route.params || {}; // Get doctorId from route parameters

  // Function to fetch doctor details from Firestore
  const fetchDoctor = async () => {
    const docRef = doc(db, "topDoctors", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const doctorData = docSnap.data();
      setDoctor({
        ...doctorData,
        contactNumber: Array.isArray(doctorData.contactNumber)
          ? doctorData.contactNumber.join(", ")
          : doctorData.contactNumber,
      });
    } else {
      console.log("No such document!");
    }
  };

  // Fetch doctor details when component mounts
  useEffect(() => {
    fetchDoctor();
  }, [id]);

  // Function to pick image from gallery
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri); // Store the selected image URI
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

  // Function to handle doctor update
  const handleUpdate = async () => {
    try {
      let imageUrl = "";
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage); // Upload image and get the URL
      } else {
        imageUrl = doctor.image; // Keep existing image if no new one is selected
      }

      // Prepare the doctor data for Firestore
      const updatedDoctor = {
        ...doctor,
        charges: Number(doctor.charges), // Ensure charges is a number
        rating: Number(doctor.rating), // Ensure rating is a number
        contactNumber: doctor.contactNumber.split(","), // Convert contact number to array
        image: imageUrl, // Use uploaded image URL
      };

      const docRef = doc(db, "topDoctors", id);
      await updateDoc(docRef, updatedDoctor);

      Alert.alert("Success", "Doctor details updated successfully!");
      navigation.goBack(); // Go back to previous screen
    } catch (error) {
      console.error("Error updating doctor: ", error);
      Alert.alert("Error", "Failed to update the doctor.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>Update Doctor Details</Text>

      <TextInput
        style={styles.input}
        placeholder="Doctor Name"
        value={doctor.name}
        onChangeText={(text) => setDoctor({ ...doctor, name: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Doctor Type"
        value={doctor.type}
        onChangeText={(text) => setDoctor({ ...doctor, type: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Rating (out of 5)"
        value={doctor.rating.toString()}
        keyboardType="numeric"
        onChangeText={(text) => setDoctor({ ...doctor, rating: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="About"
        value={doctor.about}
        onChangeText={(text) => setDoctor({ ...doctor, about: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Working Days (e.g., Mon-Fri)"
        value={doctor.workingDays}
        onChangeText={(text) => setDoctor({ ...doctor, workingDays: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Working Time (e.g., 9AM-5PM)"
        value={doctor.workingTime}
        onChangeText={(text) => setDoctor({ ...doctor, workingTime: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Location"
        value={doctor.location}
        onChangeText={(text) => setDoctor({ ...doctor, location: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Charges (number)"
        value={doctor.charges.toString()}
        keyboardType="numeric"
        onChangeText={(text) => setDoctor({ ...doctor, charges: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Contact Numbers (comma-separated)"
        value={doctor.contactNumber}
        onChangeText={(text) => setDoctor({ ...doctor, contactNumber: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={doctor.emailAddress}
        onChangeText={(text) => setDoctor({ ...doctor, emailAddress: text })}
      />

      {/* Display selected or existing image */}
      {selectedImage ? (
        <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
      ) : doctor.image ? (
        <Image source={{ uri: doctor.image }} style={styles.imagePreview} />
      ) : null}

      {/* Button to pick image */}
      <TouchableOpacity style={styles.pickImageBtn} onPress={pickImage}>
        <Text style={styles.pickImageText}>Pick an Image</Text>
      </TouchableOpacity>

      {isUploading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
          <Text style={styles.submitButtonText}>Update Doctor</Text>
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

export default UpdateDoctor;
