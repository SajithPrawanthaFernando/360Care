import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import ProgressBar from "react-native-progress/Bar";
import { useNavigation } from "expo-router";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth } from "../../hooks/firebaseConfig"; // Adjust import based on your project structure
import medal1 from "../../assets/images/medal1.png";
import medal2 from "../../assets/images/medal2.png";
import medal3 from "../../assets/images/medal3.webp";
import medal4 from "../../assets/images/medal4.webp";

const MilestonesScreen = () => {
  const [completedTasks, setCompletedTasks] = useState(0);
  const [progress, setProgress] = useState(0);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [showCongratulations, setShowCongratulations] = useState(false); // New state for congratulatory message
  const navigation = useNavigation();
  const db = getFirestore();

  // Milestones definition
  const milestones = [
    {
      id: "1",
      title: "Complete 5 tasks to earn this badge.",
      icon: medal1,
      threshold: 5,
    },
    {
      id: "2",
      title: "Complete 10 tasks to earn this badge.",
      icon: medal2,
      threshold: 10,
    },
    {
      id: "3",
      title: "Complete 15 tasks to earn this badge.",
      icon: medal4,
      threshold: 15,
    },
    {
      id: "4",
      title: "Complete 20 tasks to earn this badge.",
      icon: medal3,
      threshold: 20,
    },
  ];

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
          console.error("No user is logged in.");
          return;
        }

        const tasksRef = collection(db, `users/${userId}/taskcollection`);
        const q = query(tasksRef, where("completed", "==", true));
        const querySnapshot = await getDocs(q);

        const completedCount = querySnapshot.size;
        setCompletedTasks(completedCount);

        // Check if completed tasks exceed 20
        if (completedCount >= 20) {
          setShowCongratulations(true); // Show the congratulatory message
        } else {
          setShowCongratulations(false); // Hide the message if count is 20 or less
        }

        // Calculate progress
        const totalTasks =
          milestones.length > 0
            ? milestones[milestones.length - 1].threshold
            : 1;
        setProgress(completedCount / totalTasks);

        // Determine earned badges
        const earned = milestones.filter(
          (milestone) => completedCount >= milestone.threshold
        );
        setEarnedBadges(earned);
      } catch (error) {
        console.error("Error fetching completed tasks: ", error);
      }
    };

    fetchCompletedTasks();
  }, [db]);

  const renderMilestoneItem = ({ item }) => {
    // Check if the badge has been earned
    const isEarned = earnedBadges.some((badge) => badge.id === item.id);

    return (
      <View style={styles.milestoneCard}>
        <View style={styles.milestoneItem}>
          <Image source={item.icon} style={styles.badgeIcon} />
          <Text style={styles.milestoneText}>{item.title}</Text>
        </View>
        {/* Display "Completed" text if the badge is earned */}
        {isEarned && <Text style={styles.completedText}>Completed</Text>}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Icon
          name="arrow-back"
          size={24}
          color="#000"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
        <Text style={styles.headerText}>Milestones</Text>
      </View>

      {/* Earned Badges */}
      <View style={styles.earnedBadges}>
        <Text style={styles.sectionTitle}>Earned Badges</Text>
        {earnedBadges.length > 0 ? (
          <View style={styles.badgesRow}>
            {earnedBadges.map((badge) => (
              <View key={badge.id} style={styles.badgeCard}>
                <Image source={badge.icon} style={styles.badgeIconLarge} />
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noBadgesText}>
            You have not earned any badges yet.
          </Text>
        )}
      </View>

      {/* Congratulatory Message */}
      {showCongratulations && (
        <Text style={styles.congratulationsText}>
          Congratulations! You have earned all the badges!
        </Text>
      )}

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <Text style={styles.completeTitle}>To Complete</Text>
        <ProgressBar
          progress={progress} // Progress value
          width={null}
          borderRadius={50}
          height={25}
          color="#4a90e2"
        />
        <View style={styles.progressValues}>
          <Text>0</Text>
          <Text>{completedTasks}</Text>
          <Text>20</Text>
        </View>
      </View>

      {/* Milestone Tasks */}
      <FlatList
        data={milestones}
        renderItem={renderMilestoneItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.milestoneList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    left: 0,
  },
  earnedBadges: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  completeTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  badgesRow: { flexDirection: "row", justifyContent: "space-around" },
  badgeCard: {
    width: 70,
    height: 70,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    elevation: 4,
    alignItems: "center",
    justifyContent: "center",
    position: "relative", // Ensure the text can be positioned absolutely
  },
  badgeIconLarge: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  progressSection: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  progressValues: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  milestoneCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
    width: "100%",
    position: "relative", // Ensure the text can be positioned absolutely
  },
  milestoneItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  badgeIcon: { width: 40, height: 40, marginRight: 10 },
  milestoneText: {
    fontSize: 16,
    color: "#666",
    flexShrink: 1,
    flexWrap: "wrap",
  },
  milestoneList: {
    paddingBottom: 20,
  },
  noBadgesText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
  completedText: {
    fontSize: 14,
    color: "#4a90e2",
    fontWeight: "bold",
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  congratulationsText: {
    fontSize: 18,
    color: "#4a90e2",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
});

export default MilestonesScreen;
