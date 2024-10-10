// app/DoctorDetail.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../hooks/firebaseConfig";
import { useRoute } from "@react-navigation/native"; // You can use the same useRoute approach
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for the back icon
import { useNavigation } from "expo-router"; // Expo Router's useNavigation
import { useRouter } from "expo-router";

const DoctorDetail = () => {
  const navigation = useNavigation(); // Initialize navigation
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const { doctorId } = route.params || {}; // Get doctorId from route parameters
  const router = useRouter();

  useEffect(() => {
    const fetchDoctor = async () => {
      if (doctorId) {
        try {
          const docRef = doc(db, "topDoctors", doctorId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setDoctor(docSnap.data());
          } else {
            console.log("No such doctor!");
          }
        } catch (error) {
          console.error("Error fetching doctor:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDoctor();
  }, [doctorId]);

  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = (emailAddress) => {
    Linking.openURL(`mailto:${emailAddress}`);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!doctor) {
    return <Text>Doctor details not available</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        {/* Page Title */}
        <Text style={styles.header}>Doctor Detail</Text>
      </View>

      <View style={styles.sortRow}>
        {/* Sort Label */}
        <Text style={styles.sortLabel}>Sort By</Text>

        {/* Sort Buttons */}
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => navigation.navigate("SortByLocation")} // Navigate to SortByLocation page
        >
          <Text style={styles.sortButtonText}>Location</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => navigation.navigate("SortByPopularity")} // Navigate to SortByPopularity page
        >
          <Text style={styles.sortButtonText}>Popularity</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => navigation.navigate("SortByCharges")} // Navigate to SortByCharges page
        >
          <Text style={styles.sortButtonText}>Charges</Text>
        </TouchableOpacity>
      </View>

      {/* Card section for doctor image, name, type, and rating */}
      <View style={styles.card}>
        <Image source={{ uri: doctor.image }} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{doctor.name}</Text>
          <Text style={styles.type}>{doctor.type}</Text>
          <Text style={styles.rating}>⭐ {doctor.rating}</Text>
        </View>
      </View>

      {/* Details section */}
      <View style={styles.detailsSection}>
        {/* About Section */}
        <View style={styles.detailItem}>
          <Text style={styles.detailTitle}>About:</Text>
          <Text style={styles.detailText}>{doctor.about}</Text>
        </View>

        {/* Working Days Section */}
        <View style={styles.detailItem}>
          <Text style={styles.detailTitle}>Working Days:</Text>
          <Text style={styles.detailText}>{doctor.workingDays}</Text>
        </View>

        {/* Working Time Section */}
        <View style={styles.detailItem}>
          <Text style={styles.detailTitle}>Working Time:</Text>
          <Text style={styles.detailText}>{doctor.workingTime}</Text>
        </View>

        {/* Working Location Section */}
        <View style={styles.detailItem}>
          <Text style={styles.detailTitle}>Working Location:</Text>
          <Text style={styles.detailText}>{doctor.location}</Text>
        </View>

        {/* Doctor Charges Section */}
        <View style={styles.detailItem}>
          <Text style={styles.detailTitle}>Doctor Charges:</Text>
          <Text style={styles.detailText}>Rs.{doctor.charges}</Text>
        </View>

        {/* Contact Numbers Section */}
        <View style={styles.detailItem}>
          <Text style={styles.detailTitle}>Contact Numbers:</Text>
          {doctor.contactNumber.map((number, index) => (
            <TouchableOpacity key={index} onPress={() => handleCall(number)}>
              <Text style={styles.contactText}>{number}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Email Address Section */}
        <View style={styles.detailItem}>
          <Text style={styles.detailTitle}>Email Address:</Text>
          <TouchableOpacity onPress={() => handleEmail(doctor.emailAddress)}>
            <Text style={styles.contactText}>{doctor.emailAddress}</Text>
          </TouchableOpacity>
        </View>

        {/* Write A Review Button */}
        <TouchableOpacity
          style={styles.reviewButton}
          onPress={() =>
            navigation.navigate("DoctorRating", {
              doctorId: doctorId,
              doctorName: doctor.name,
            })
          }
        >
          <Text style={styles.reviewButtonText}>Write a Review</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  sortRow: {
    flexDirection: "row",
    alignItems: "center", // Align text and buttons vertically
    justifyContent: "space-between", // Adjust spacing between buttons and text
    marginBottom: 16,
  },
  sortLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00796B",
    marginRight: 8, // Add some spacing between the label and the first button
  },
  sortButton: {
    backgroundColor: "#E0F7FA",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginLeft: 8, // Add some space between buttons
  },
  sortButtonText: {
    color: "#00796B",
    fontWeight: "bold",
  },
  card: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  type: {
    color: "#757575",
    marginBottom: 4,
  },
  rating: {
    color: "#FFB300",
    marginBottom: 8,
  },
  detailsSection: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  detailItem: {
    marginBottom: 16,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  detailText: {
    fontSize: 16,
    color: "#424242",
  },
  contactText: {
    fontSize: 16,
    color: "#007AFF",
    textDecorationLine: "underline",
  },
  reviewButton: {
    backgroundColor: "#0288D1",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  reviewButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default DoctorDetail;
