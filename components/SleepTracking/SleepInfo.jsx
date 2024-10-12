import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image
} from "react-native";
import * as Progress from "react-native-progress";
import { useState, useEffect } from "react";

import { useNavigation } from "expo-router";

import { db } from "../../hooks/firebaseConfig";
import {
  query,
  doc,
  deleteDoc,
} from "firebase/firestore";

const sadFace = require('../../assets/images/sadFace.png'); // Adjust the path as necessary
const happyFace = require('../../assets/images/happyFace.png');

export default function SleepInfo({ route }) {
  const { circleData } = route.params;

  const navigation = useNavigation();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  // Helper function to format time to "hh:mm" format
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Use 24-hour format
    }).format(date);
  };

  // Helper function to convert seconds to "hh:mm"
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  };
  const convertSecondsToHours = (seconds) => {
    return seconds / 3600;
  };

  // Calculate missed sleep in hours
  const calculateMissedSleep = (totalSleepSeconds) => {
    const totalSleepHours = totalSleepSeconds / 3600;
    const requiredSleepHours = 8;
    const missedSleep = Math.max(0, requiredSleepHours - totalSleepHours);
    return missedSleep.toFixed(2); // Format as a number with two decimals
  };

  const calculateSleepPercentage = (totalSleepSeconds) => {
    const totalSleepHours = convertSecondsToHours(totalSleepSeconds);
    const percentage = (totalSleepHours / 8) * 100;
    return percentage.toFixed(2); // Format percentage with two decimals
  };

  const [sleepStartTime, setSleepStartTime] = useState("");
  const [wentToBed, setWentToBed] = useState("");
  const [wakeUpTime, setWakeUpTime] = useState("");
  const [sleepDuration, setSleepDuration] = useState("");
  const [interruptedTime, setInterruptedTime] = useState("");
  const [missedSleep, setMissedSleep] = useState("");

  useEffect(() => {
    const startTime = circleData.sleepStartTime;
    const endTime = circleData.sleepEndTime;
    const totalDuration = circleData.totalSleepDuration;
    const interruptedDuration = circleData.interruptedTime;

    // Set formatted values
    setSleepStartTime(formatDate(startTime)); // Date in "24 April 2024" format
    setWentToBed(formatTime(startTime)); // Start time in "hh:mm" format
    setWakeUpTime(formatTime(endTime)); // End time in "hh:mm" format
    setSleepDuration(formatDuration(totalDuration)); // Total sleep duration in "hh:mm" format
    setInterruptedTime(formatDuration(interruptedDuration)); // Interrupted time in "hh:mm" format
    setMissedSleep(calculateMissedSleep(totalDuration));

    console.log(circleData.lightSleep); // Missed sleep in hours
  }, [circleData]);

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "sleepData", circleData.id));

      navigation.navigate("Sleep", { circleData });

      // Optionally navigate back or reset state after deletion
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };
  const { lightSleep, deepSleep, remSleep } = circleData;

  // Create an array to represent the sleep states
  const sleepValues = [lightSleep, deepSleep, remSleep];
  const sleepLabels = ['Light Sleep', 'Deep Sleep', 'REM Sleep'];
 
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <Text style={styles.textStyleLarge}>{sleepStartTime}</Text>

      <View style={styles.sleepInfoCard}>
        <Text style={styles.textStyleMedium}>Last Sleep Information</Text>

        <View style={styles.sleepInfo}>
          <View style={styles.sleepInfoRow}>
            <Text>logo</Text>
            <View>
              <Text style={styles.sleepInfoRowText}>{sleepDuration}</Text>
              <Text>Time Slept</Text>
            </View>
          </View>
          <View style={styles.sleepInfoRow}>
            <Text>logo</Text>
            <View>
              <Text style={styles.sleepInfoRowText}>{wakeUpTime}</Text>
              <Text>Wake-up Time</Text>
            </View>
          </View>
        </View>

        <View>
          <View style={styles.sleepInfo}>
            <View style={styles.sleepInfoRow}>
              <Text>logo</Text>
              <View>
                <Text style={styles.sleepInfoRowText}>{wentToBed}</Text>
                <Text>Went to bed</Text>
              </View>
            </View>
            <View style={styles.sleepInfoRow}>
              <Text>logo</Text>
              <View>
                <Text style={styles.sleepInfoRowText}>{interruptedTime}</Text>
                <Text>Time interrupted</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.weekInfo}>
        <View style={styles.averageSleep}>
          <View>
            <Text style={styles.forgroundText}>Missed</Text>
            <Text style={styles.forgroundText}>sleep time for</Text>
            <Text style={styles.forgroundText}>the day</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.averageSleepTextBold}>{missedSleep}</Text>
            <View>
              <Text style={styles.forgroundText}>Hours</Text>
            </View>
          </View>
        </View>

        <View style={styles.averageQuality}>
          <Text>Quality</Text>

          <View style={styles.circleContainer}>
            <Progress.Circle
              progress={
                convertSecondsToHours(circleData.totalSleepDuration) / 8
              } // Convert percentage to 0-1 range
              progressColor="#407CE2"
              strokeWidth={20}
              backgroundColor="rgba(195, 212, 255, 0.2)"
              size={100}
            />
            <Text style={styles.percentageText}>{Math.round((convertSecondsToHours(circleData.totalSleepDuration) / 8) * 100)} %</Text>
          </View>
        </View>
      </View>
      <View style={styles.stages}>
      {sleepValues.map((value, index) => (
        <View key={index} style={styles.sleepRow}>
          <Text style={styles.sleepTitle}>{sleepLabels[index]}</Text>
          <Image
            source={value ? happyFace : sadFace} // Use boolean value for icon
            style={styles.icon}
          />
        </View>
      ))}
    </View>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.buttonText}>Delete Sleep Record</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  scrollViewContent: {
    padding: 16,
  },
  textStyleLarge: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  textStyleMedium: {
    fontSize: 18,
    fontWeight: "semi-bold",
    marginBottom: 10,
  },
  textStyleMediumBold: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  textStyleSmall: {
    fontSize: 14,
    fontWeight: "regular",
  },
  textStyleSmallBold: {
    fontSize: 14,
    fontWeight: "bold",
  },
  date: {
    paddingTop: 6,
    fontSize: 18,
    color: "#333",
    marginBottom: 20,
  },
  deleteButton: {
    backgroundColor: "#D9534F", // Change color to indicate deletion
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "rgba(195, 212, 255, 0.3)",
    borderRadius: 16,
    borderWidth: 1, // Thickness of the border
    borderColor: "rgb(195, 212, 255)",
    marginBottom: 20,
  },
  circleWrapper: {
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  circleContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  percentageText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -12 }],
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    paddingLeft: 13,
  },
  goalContainer: {
    flexDirection: "column",
    padding: 16,
    backgroundColor: "rgba(195, 212, 255, 0.3)",
    borderRadius: 16,
    borderWidth: 1, // Thickness of the border
    borderColor: "rgb(195, 212, 255)",
  },
  goalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    width: "70%",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#407CE2", // Button background color
    paddingHorizontal: 20, // Horizontal padding
    paddingVertical: 10, // Vertical padding
    borderRadius: 6,
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF", // Text color for the button
    fontSize: 16,
  },
  forgroundText: {
    color: "#FFFFFF", // Text color for the button
  },
  sleepButton: {
    backgroundColor: "#407CE2", // Button background color
    paddingHorizontal: 40, // Horizontal padding
    paddingVertical: 20, // Vertical padding
    borderRadius: 6,
    justifyContent: "center",
  },
  sleep: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  weekInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    gap: 20,
  },
  stages: {
    padding: 0, // Remove padding from the container
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    elevation: 1,
  },
  sleepRow: {
    flexDirection: 'row',
    alignItems: 'center', // Center vertically
    justifyContent: 'space-between', // Distribute space between items
    paddingVertical: 8,
    paddingHorizontal: 16, // Add horizontal padding for spacing
  },
  sleepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left', // Align title to the left
  },
  icon: {
    width: 24, // Adjust based on your icon size
    height: 24, // Adjust based on your icon size
  },

  row: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  averageSleep: {
    width: "47%",
    height: 160,
    padding: 16,
    backgroundColor: "#407CE2",
    borderRadius: 16,
  },
  averageQuality: {
    width: "47%",
    height: 160,
    padding: 16,
    backgroundColor: "rgba(195, 212, 255, 0.3)",
    borderRadius: 16,
  },
  averageSleepTextBold: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  sleepInfoCard: {
    padding: 16,
    backgroundColor: "rgba(195, 212, 255, 0.3)",
    borderRadius: 16,
    gap: 20,
    marginBottom: 20,
  },
  sleepInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  sleepInfoRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    width: 180,
  },
  sleepInfoRowText: {
    fontSize: 22,
    fontWeight: "semi-bold",
  },
});
