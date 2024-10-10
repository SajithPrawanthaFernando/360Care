// app/DoctorList.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { db } from "../../hooks/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useNavigation, useRouter } from "expo-router";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchDoctors = async () => {
      const doctorsCollection = collection(db, "topDoctors");
      const doctorDocs = await getDocs(doctorsCollection);
      setDoctors(doctorDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchDoctors();
  }, []);

  const renderDoctorItem = ({ item }) => (
    <TouchableOpacity
      style={styles.doctorCard}
      onPressIn={() => {
        navigation.navigate("DetailDoctor", { id: item.id });
      }}
    >
      <Text style={styles.doctorName}>{item.name}</Text>
      <Text style={styles.doctorType}>{item.type}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Doctors List</Text>
      <FlatList
        data={doctors}
        renderItem={renderDoctorItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F7F7F7", // Very light background color
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#000000", // Dark text for readability
  },
  doctorCard: {
    backgroundColor: "#FFFFFF", // White card background
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    // Shadow properties removed
  },
  doctorName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#00008B", // Dark text for name
  },
  doctorType: {
    fontSize: 16,
    color: "#6B7280", // Grey for type
  },
});

export default DoctorList;
