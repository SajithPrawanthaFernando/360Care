import { useNavigation } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Switch,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import focusImage from "../../assets/images/focus.png";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../hooks/firebaseConfig";
import nutrition from "../../assets/images/nutrition.png";
import mentalhealth from "../../assets/images/mentalhealth.png";
import chronicdisease from "../../assets/images/chronicdisease.png";
import fitness from "../../assets/images/fitness.png";
import stress from "../../assets/images/stress.png";

const FocusGoalsScreen = () => {
  const navigation = useNavigation();
  const [focusAreas, setFocusAreas] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFocusAreas, setFilteredFocusAreas] = useState([]);
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  // Fetch user's focus area selections from Firestore
  useEffect(() => {
    const fetchFocusAreas = async () => {
      if (!userId) return;

      try {
        const docRef = doc(db, "users", userId, "focusAreas", "selected");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFocusAreas(docSnap.data());
        } else {
          // Default focus areas if none are selected
          setFocusAreas({
            1: false,
            2: false,
            3: false,
            4: false,
            5: false,
          });
        }
      } catch (error) {
        console.error("Error fetching focus areas:", error);
      }
    };

    fetchFocusAreas();
  }, [userId]);

  useEffect(() => {
    // Filter focus areas based on search query
    const searchFilter = focusAreaData.filter((area) =>
      area.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFocusAreas(searchFilter);
  }, [searchQuery]);

  const handleSwitchToggle = async (focusAreaId) => {
    if (!userId) return;

    try {
      const newFocusAreas = {
        ...focusAreas,
        [focusAreaId]: !focusAreas[focusAreaId],
      };
      setFocusAreas(newFocusAreas);

      const docRef = doc(db, "users", userId, "focusAreas", "selected");
      await setDoc(docRef, newFocusAreas, { merge: true }); // Use setDoc with merge: true
    } catch (error) {
      console.error("Error updating focus areas:", error);
    }
  };

  const focusAreaData = [
    {
      id: "1",
      title: "Nutrition",
      description: "Boost your health with balanced meals.",
      icon: nutrition,
    },
    {
      id: "2",
      title: "Mental Health",
      description: "Support your mental well-being daily.",
      icon: mentalhealth,
    },
    {
      id: "3",
      title: "Chronic Disease",
      description: "Manage chronic conditions effectively.",
      icon: chronicdisease,
    },
    {
      id: "4",
      title: "Fitness",
      description: "Enhance your physical fitness and stamina.",
      icon: fitness,
    },
    {
      id: "5",
      title: "Stress Management",
      description: "Develop techniques to manage and reduce stress.",
      icon: stress,
    },
  ];

  const renderFocusArea = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.focusAreaItem}>
        <Image source={item.icon} style={styles.tipsImage} />

        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.focusAreaTitle}>{item.title}</Text>
          <Text style={styles.focusAreaDescription}>{item.description}</Text>
        </View>
        <Switch
          thumbColor={focusAreas[item.id] ? "#4a90e2" : "#d9d9d9"}
          value={focusAreas[item.id] || false}
          onValueChange={() => handleSwitchToggle(item.id)}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ImageBackground source={focusImage} style={styles.backgroundImage}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} />
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Select your{"\n"}own focus{"\n"}goals
          </Text>
        </View>
      </ImageBackground>

      <View style={styles.content}>
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color="#ccc" />
          <TextInput
            placeholder="Search focus areas"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => navigation.navigate("ProgressScreen")}
          >
            <Icon name="stats-chart" size={30} color="#4a90e2" />
            <Text style={styles.tabText}>Progress</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => navigation.navigate("MilestonesScreen")}
          >
            <Icon name="trophy" size={30} color="#4a90e2" />
            <Text style={styles.tabText}>Milestones</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.focusAreaHeader}>
          <Text style={styles.focusAreaTitle}>Focus Areas</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredFocusAreas}
          renderItem={renderFocusArea}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.focusAreaList}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  backgroundImage: {
    width: "106%",
    height: 250,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingTop: 30,
    paddingLeft: 10,
  },
  headerText: {
    fontSize: 25,
    fontWeight: "bold",
    marginLeft: 10,
  },
  content: {
    flex: 1,
    padding: 20,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#fff",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  searchInput: { marginLeft: 10, flex: 1 },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  tab: { alignItems: "center" },
  tabText: { marginTop: 5, color: "#4a90e2" },
  focusAreaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  focusAreaTitle: { fontSize: 16, fontWeight: "bold" },
  seeAllText: { color: "#4a90e2" },
  focusAreaItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
  focusAreaDescription: { color: "#666", marginTop: 5 },
  focusAreaList: { paddingBottom: 20 },

  // Card Style for each item
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  tipsImage: {
    width: 50,
    height: 50,
    resizeMode: "cover",
    borderRadius: 8,
    marginRight: 4,
  },
});

export default FocusGoalsScreen;
