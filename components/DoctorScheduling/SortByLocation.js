// app/SortByLocation.js
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

const SortByLocation = () => {
  const navigation = useNavigation(); // Initialize navigation
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupedDoctors, setGroupedDoctors] = useState({});
  const [cityFilter, setCityFilter] = useState(""); // State to store search input
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

        // Group doctors by city (assuming city is the last part of the location string after comma)
        const groupedByLocation = doctorList.reduce((acc, doctor) => {
          const locationParts = doctor.location
            ? doctor.location.split(",")
            : ["Unknown"];

          // Get the last word or last part as the city (split by comma)
          const city = locationParts[locationParts.length - 1].trim(); // Trimming any extra spaces

          if (!acc[city]) {
            acc[city] = [];
          }
          acc[city].push(doctor);
          return acc;
        }, {});

        setGroupedDoctors(groupedByLocation);
      } catch (err) {
        console.error("Error fetching doctors: ", err);
        setError("Failed to load doctors.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Filtered groupedDoctors based on search input
  const filteredGroupedDoctors = Object.keys(groupedDoctors)
    .filter((city) => city.toLowerCase().includes(cityFilter.toLowerCase())) // Filter by city name
    .reduce((acc, city) => {
      acc[city] = groupedDoctors[city];
      return acc;
    }, {});

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
        <Text style={styles.header}>Sort By Location</Text>
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

      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by city"
        value={cityFilter}
        onChangeText={setCityFilter} // Update cityFilter state on text change
      />

      {/* Scrollable container */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {Object.keys(filteredGroupedDoctors).map((city) => (
          <View key={city} style={styles.locationSection}>
            <Text style={styles.locationTitle}>{city}</Text>
            <FlatList
              data={filteredGroupedDoctors[city]}
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
                      navigation.navigate("DoctorDetail", { doctorId: item.id })
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
  searchInput: {
    backgroundColor: "#F5F5F5",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    borderColor: "#00796B",
    borderWidth: 1,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  locationSection: {
    marginBottom: 24,
  },
  locationTitle: {
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

export default SortByLocation;
