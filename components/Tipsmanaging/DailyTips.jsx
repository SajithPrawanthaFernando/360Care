import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useNavigation } from "expo-router";
import tipsimage from "../../assets/images/tipsimage1.png";
import bulb from "../../assets/images/bulb.png";
import bottle from "../../assets/images/bottle.jpg";
import bicycle from "../../assets/images/bicycle.png";
import sleep from "../../assets/images/sleep.png";
import food from "../../assets/images/food.png";
import exercise from "../../assets/images/exercise.png";
import flower from "../../assets/images/flower.png";
import heart from "../../assets/images/heart.png";
import tree from "../../assets/images/tree.png";
import { db } from "../../hooks/firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { format } from "date-fns"; // Import date-fns for date formatting

const images = [bottle, bicycle, sleep, food, exercise, flower, heart, tree];

const getRandomImage = () => {
  return images[Math.floor(Math.random() * images.length)];
};

const focusAreaMapping = {
  1: "nutrition",
  2: "mental_health",
  3: "chronic_disease",
  4: "fitness",
  5: "stress_management",
};

const DailyTips = () => {
  const navigation = useNavigation();
  const [todayTip, setTodayTip] = useState(null);
  const [previousTips, setPreviousTips] = useState([]);
  const [focusAreas, setFocusAreas] = useState({});
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  const focusAreasRef = useRef(focusAreas);

  useEffect(() => {
    const fetchAndUpdateTips = async () => {
      if (!userId) return;

      const today = format(new Date(), "yyyy-MM-dd");

      try {
        // Fetch selected focus areas
        const focusDocRef = doc(db, "users", userId, "focusAreas", "selected");
        const focusDocSnap = await getDoc(focusDocRef);
        if (focusDocSnap.exists()) {
          focusAreasRef.current = focusDocSnap.data();
          setFocusAreas(focusDocSnap.data());
        }

        // Fetch today's tip
        const todayDocRef = doc(db, "users", userId, "dailyTips", "today");
        const todayDocSnap = await getDoc(todayDocRef);

        let newTip = null;
        if (!todayDocSnap.exists() || todayDocSnap.data().date !== today) {
          // Determine if focus areas are selected
          const selectedFocusAreas = Object.entries(focusAreasRef.current)
            .filter(([key, value]) => value)
            .map(([key]) => focusAreaMapping[key]);

          let tipsDocRef;
          if (selectedFocusAreas.length > 0) {
            // Randomly select one of the user's focus areas
            const randomFocusArea =
              selectedFocusAreas[
                Math.floor(Math.random() * selectedFocusAreas.length)
              ];
            tipsDocRef = doc(db, "healthTips", randomFocusArea);
          } else {
            // Fallback to general tips if no focus area is selected
            tipsDocRef = doc(db, "healthTips", "general_tips");
          }

          // Fetch a tip from the chosen collection
          const tipsDocSnap = await getDoc(tipsDocRef);
          if (tipsDocSnap.exists()) {
            const tipsArray = tipsDocSnap.data().tips;
            newTip = tipsArray[Math.floor(Math.random() * tipsArray.length)];
          }

          if (todayDocSnap.exists()) {
            // Move the old tip to previous tips
            const oldTip = todayDocSnap.data().tip;
            await updateDoc(
              doc(db, "users", userId, "dailyTips", "previousTips"),
              {
                tips: arrayUnion(oldTip),
              }
            );
          }

          // Set the new tip as today's tip
          if (newTip) {
            const newTipImage = getRandomImage();
            await setDoc(
              todayDocRef,
              {
                tip: newTip,
                date: today,
                image: newTipImage,
              },
              { merge: true }
            );
            setTodayTip({ tip: newTip, image: newTipImage });
          }
        } else {
          // Use existing today's tip
          setTodayTip({
            tip: todayDocSnap.data().tip,
            image: todayDocSnap.data().image,
          });
        }

        // Fetch previous tips
        const previousTipsDocRef = doc(
          db,
          "users",
          userId,
          "dailyTips",
          "previousTips"
        );
        const previousTipsDocSnap = await getDoc(previousTipsDocRef);
        if (previousTipsDocSnap.exists()) {
          const previousTipsArray = previousTipsDocSnap.data().tips || [];
          setPreviousTips(previousTipsArray);
        } else {
          // Create previous tips document if it doesn't existts
          await setDoc(previousTipsDocRef, { tips: [] });
        }
      } catch (error) {
        console.error("Error fetching or updating tips:", error);
      }
    };

    fetchAndUpdateTips();
  }, [userId]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Daily Tips</Text>
      </View>

      <View style={styles.customTipContainer}>
        <Image source={tipsimage} style={styles.tipsImage} />
        <Text style={styles.customTipText}>
          Customize your own tips by {"\n"} adding focus areas
        </Text>
        <TouchableOpacity
          style={styles.addFocusButton}
          onPress={() => navigation.navigate("FocusGoalsScreen")}
        >
          <Text style={styles.addFocusButtonText}>Add focus areas</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.todaysTipContainer}>
        <Text style={styles.sectionTitle}>Today's Tip</Text>
        <View style={styles.tipBox}>
          <View style={styles.iconContainer}>
            <Image source={bulb} style={styles.icon} />
          </View>
          <View style={styles.tipTextContainer}>
            <Text style={styles.tipText}>{todayTip?.tip}</Text>
          </View>
        </View>
      </View>

      <View style={styles.previousTipsContainer}>
        <View style={styles.previousTipsHeader}>
          <Text style={styles.sectionTitle}>Previous Tips</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          {previousTips.length > 0 ? (
            previousTips.map((tip, index) => (
              <View key={index} style={styles.tipBox}>
                <View style={styles.iconContainer}>
                  <Image source={getRandomImage()} style={styles.icon} />
                </View>
                <View style={styles.tipTextContainer}>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noTipsText}>No previous tips available.</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  customTipContainer: {
    borderRadius: 13,
    marginBottom: 20,
    alignItems: "center",
    position: "relative",
  },
  tipsImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
    borderRadius: 8,
  },
  customTipText: {
    fontSize: 19,
    paddingLeft: 30,
    fontWeight: "bold",
    textAlign: "left",
    position: "absolute",
    top: "15%",
    left: 0,
    right: 0,
  },
  addFocusButton: {
    position: "absolute",
    left: 30,
    bottom: 22,
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addFocusButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  todaysTipContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  tipBox: {
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
  iconContainer: {
    marginRight: 10,
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  tipTextContainer: {
    flex: 1,
  },
  tipText: {
    fontSize: 16,
    color: "#333",
  },
  previousTipsContainer: {
    flex: 1,
  },
  previousTipsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 10,
  },
  seeAllText: {
    color: "#007bff",
    fontSize: 14,
  },
  noTipsText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
});

export default DailyTips;
