// app/TopDoctors.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../hooks/firebaseConfig"; // Ensure this path is correct
import { useNavigation } from "expo-router"; // Expo Router's useNavigation
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for the back icon
import { useRouter } from "expo-router";

const TopDoctors = () => {
  const navigation = useNavigation(); // Initialize navigation
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // For search functionality
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorsCollection = collection(db, "topDoctors"); // Ensure 'topDoctors' is the correct collection name
        const doctorSnapshot = await getDocs(doctorsCollection);
        const doctorList = doctorSnapshot.docs.map((doc) => {
          const data = doc.data();
          console.log(data.image); // Log each image URL here
          return {
            id: doc.id,
            ...data,
          };
        });
        setDoctors(doctorList);
      } catch (err) {
        console.error("Error fetching doctors: ", err);
        setError("Failed to load doctors.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Filter doctors based on search query
  useEffect(() => {
    if (searchQuery === "") {
      setFilteredDoctors(doctors); // If search query is empty, show all doctors
    } else {
      const filteredList = doctors.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doctor.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDoctors(filteredList);
    }
  }, [searchQuery, doctors]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  if (doctors.length === 0) {
    return <Text>No doctors available.</Text>;
  }

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
        <Text style={styles.header}>Top Doctors</Text>
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

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search by name or type"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />

      {/* Doctor List */}
      <FlatList
        data={filteredDoctors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.doctorCard}>
            <Image
              source={{ uri: item.image }} // Ensure this is the correct field for image URLs //source={{ uri: item.image }}
              style={styles.image}
              onError={(error) => console.log("Image failed to load", error)} // Handle loading errors
            />
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.type}>{item.type}</Text>
              <Text style={styles.rating}>⭐ {item.rating}</Text>
              <TouchableOpacity
                style={styles.infoButton}
                onPress={() =>
                  navigation.navigate("DoctorDetail", { doctorId: item.id })
                } // Pass doctorId
              >
                <Text style={styles.infoButtonText}>Info</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
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
  searchBar: {
    height: 40,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#F5F5F5",
  },
  doctorCard: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
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
  infoButton: {
    backgroundColor: "#0288D1",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  infoButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default TopDoctors;
