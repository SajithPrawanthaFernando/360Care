// app/DetailDoctor.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { db } from "../../hooks/firebaseConfig";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";

const DetailDoctor = () => {
  const navigation = useNavigation();
  const [doctor, setDoctor] = useState(null);
  const route = useRoute();
  const { id } = route.params;

  const router = useRouter();

  useEffect(() => {
    const fetchDoctor = async () => {
      const docRef = doc(db, "topDoctors", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setDoctor(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };

    fetchDoctor();
  }, [id]);

  const handleDelete = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this doctor?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            await deleteDoc(doc(db, "topDoctors", id));
            Alert.alert("Success", "Doctor deleted successfully!");
            navigation.goBack(); // Navigate back to the list after deletion
          },
        },
      ]
    );
  };

  if (!doctor) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.detailsContainer}>
        <Text style={styles.doctorName}>{doctor.name}</Text>
        <Text style={styles.label}>Image:</Text>
        <Image source={{ uri: doctor.image }} style={styles.image} />
        <Text style={styles.label}>Type:</Text>
        <Text style={styles.info}>{doctor.type}</Text>
        <Text style={styles.label}>Rating:</Text>
        <Text style={styles.info}>{doctor.rating}</Text>
        <Text style={styles.label}>About:</Text>
        <Text style={styles.info}>{doctor.about}</Text>
        <Text style={styles.label}>Working Days:</Text>
        <Text style={styles.info}>{doctor.workingDays}</Text>
        <Text style={styles.label}>Working Time:</Text>
        <Text style={styles.info}>{doctor.workingTime}</Text>
        <Text style={styles.label}>Location:</Text>
        <Text style={styles.info}>{doctor.location}</Text>
        <Text style={styles.label}>Charges:</Text>
        <Text style={styles.info}>{doctor.charges}</Text>
        <Text style={styles.label}>Contact Numbers:</Text>
        <Text style={styles.info}>{doctor.contactNumber.join(", ")}</Text>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.info}>{doctor.emailAddress}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => navigation.push("UpdateDoctor", { id })}
          >
            <Text style={styles.buttonText}>Update Details</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.buttonText}>Delete Doctor</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
  },
  detailsContainer: {
    backgroundColor: "#f5f5f5", // Light background
    padding: 20,
  },
  doctorName: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#00008B", // Dark blue color
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    color: "#000000", // Dark gray for labels
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
    color: "#7F8C8D", // Grey color for info
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  image: {
    width: "100%",
    height: 250, // Customize height based on requirements
    marginBottom: 20,
    borderRadius: 10,
  },
  updateButton: {
    backgroundColor: "#3498db", // Blue for Update
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: "#e74c3c", // Red for Delete
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
});

export default DetailDoctor;
