// app/SortByPopularity.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../hooks/firebaseConfig"; // Firebase config
import { Ionicons } from "@expo/vector-icons"; // Back button
import { useNavigation } from "expo-router"; // Expo Router navigation
import { useRouter } from "expo-router";

const SortByPopularity = () => {
  const navigation = useNavigation(); // Initialize navigation
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupedDoctors, setGroupedDoctors] = useState({});
  const [searchInput, setSearchInput] = useState(""); // For search input
  const router = useRouter();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorsCollection = collection(db, "topDoctors");
        const doctorSnapshot = await getDocs(doctorsCollection);
        const doctorList = doctorSnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });
        setDoctors(doctorList);

        // Group doctors by their rating
        const groupedByRating = doctorList.reduce((acc, doctor) => {
          const rating = parseFloat(doctor.rating);

          let range = "Unknown"; // Default range if no rating

          if (rating >= 4.5 && rating <= 5.0) {
            range = "4.5 - 5.0";
          } else if (rating >= 4.0 && rating < 4.5) {
            range = "4.0 - 4.5";
          } else if (rating >= 3.5 && rating < 4.0) {
            range = "3.5 - 4.0";
          } else if (rating >= 3.0 && rating < 3.5) {
            range = "3.0 - 3.5";
          } else if (rating < 3.0) {
            range = "Below 3.0";
          }

          if (!acc[range]) {
            acc[range] = [];
          }
          acc[range].push(doctor);
          return acc;
        }, {});

        setGroupedDoctors(groupedByRating);
      } catch (err) {
        console.error("Error fetching doctors: ", err);
        setError("Failed to load doctors.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Define the order of rating ranges
  const ratingOrder = [
    "4.5 - 5.0",
    "4.0 - 4.5",
    "3.5 - 4.0",
    "3.0 - 3.5",
    "Below 3.0",
  ];

  // Filter doctors based on the search input
  const filteredDoctors = searchInput
    ? Object.keys(groupedDoctors).reduce((acc, range) => {
        if (range.includes(searchInput)) {
          acc[range] = groupedDoctors[range];
        }
        return acc;
      }, {})
    : groupedDoctors;

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!doctors.length) {
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
        <Text style={styles.header}>Sort By Popularity</Text>
      </View>

      {/* Sort By Buttons */}
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

      {/* Search Input - Placed Below Sort Buttons */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={24}
          color="gray"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by rating (e.g., 4.5 - 5.0)"
          value={searchInput}
          onChangeText={setSearchInput}
        />
      </View>

      {/* Scrollable container */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Sort rating ranges before displaying */}
        {ratingOrder
          .filter((range) => filteredDoctors[range]) // Filter out ranges that have no doctors
          .map((ratingRange) => (
            <View key={ratingRange} style={styles.ratingSection}>
              <Text style={styles.ratingTitle}>⭐ {ratingRange}</Text>
              <FlatList
                data={filteredDoctors[ratingRange]}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.doctorCard}>
                    {/* Doctor Image */}
                    <Image
                      source={{ uri: item.image }}
                      style={styles.doctorImage}
                    />

                    {/* Doctor Info */}
                    <View style={styles.doctorInfo}>
                      <Text style={styles.name}>{item.name}</Text>
                      <Text style={styles.type}>{item.type}</Text>
                      <Text style={styles.rating}>⭐ {item.rating}</Text>
                    </View>

                    {/* Info Button */}
                    <TouchableOpacity
                      style={styles.infoButton}
                      onPress={() =>
                        navigation.navigate("DoctorDetail", {
                          doctorId: item.id,
                        })
                      } // Pass doctor ID to DoctorDetail page
                    >
                      <Ionicons
                        name="information-circle-outline"
                        size={24}
                        color="#00796B"
                      />
                    </TouchableOpacity>
                  </View>
                )}
                scrollEnabled={false} // Disable scrolling in individual FlatLists
              />
            </View>
          ))}
      </ScrollView>
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
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    position: "absolute",
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
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sortLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00796B",
    marginRight: 8,
  },
  sortButton: {
    backgroundColor: "#E0F7FA",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginLeft: 8,
  },
  sortButtonText: {
    color: "#00796B",
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  ratingSection: {
    marginBottom: 24,
  },
  ratingTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00796B",
    marginBottom: 8,
  },
  doctorCard: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  doctorInfo: {
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
  },
  infoButton: {
    padding: 8,
  },
});

export default SortByPopularity;
