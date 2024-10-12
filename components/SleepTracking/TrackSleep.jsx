import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { getAuth } from "firebase/auth";
import { format } from "date-fns";
import { db } from "../../hooks/firebaseConfig";
import { doc, getDoc, setDoc, addDoc,collection, updateDoc, arrayUnion } from "firebase/firestore";

export default function TrackSleep({}) {
  const [sleeping, setSleeping] = useState(false);
  const [sleepStarted, setSleepStarted] = useState(false);
  const [timer, setTimer] = useState(0); // Timer for total sleep time in seconds
  const [stageTimer, setStageTimer] = useState(0); // Timer for sleep stages in seconds
  const [currentStage, setCurrentStage] = useState("Awake");

  const [sleepStartTime, setSleepStartTime] = useState(null);
const [sleepEndTime, setSleepEndTime] = useState(null);
const [interruptedTimes, setInterruptedTimes] = useState([]);

const [totalPauseDuration, setTotalPauseDuration] = useState(0); // Duration of pauses in seconds
  const [pauseStartTime, setPauseStartTime] = useState(null); 

 

  const auth = getAuth();

  const userId = auth.currentUser?.uid;

  const startSleep = () => {
    setSleepStarted(true);
    setSleeping(true);
    setTimer(0); // Reset total timer when sleep starts
    setStageTimer(0); // Reset stage timer when sleep starts
    setCurrentStage("Light Sleep"); // Start with the first stage
  
    const startTime = new Date(); // Capture start time
    setSleepStartTime(startTime); // Start with the first stage
  };

  const pauseSleep = () => {
    setSleeping(false); // Stop sleep while paused
  setCurrentStage("Awake");
  setPauseStartTime(new Date());  // Set to awake when paused

  // Set to awake when paused
  };

  const resumeSleep = () => {
    setSleeping(true);
    if (pauseStartTime) {
      const pauseEndTime = new Date();
      const pauseDuration = Math.floor((pauseEndTime - pauseStartTime) / 1000); // Calculate duration in seconds
      setTotalPauseDuration(prev => prev + pauseDuration); // Update total pause duration
      setPauseStartTime(null); // Reset pause start time
    }
  };

  const stopSleep = async () => {
    setSleeping(false);
  setSleepStarted(false);
  setStageTimer(0); // Reset the stage timer when stopping sleep
  setCurrentStage("Awake");

  const endTime = new Date(); // Capture end time
  setSleepEndTime(endTime); // Store end time

    const lightSleepMet = timer <= 30 * 60; // 30 minutes
    const deepSleepMet = timer >= (30 + 150) * 60; // 2 hours total
    const remSleepMet = timer >= (30 + 150 + 60) * 60;


    try {
      const sleepData = {
        userId: auth.currentUser?.uid,
      sleepStartTime: format(sleepStartTime, "yyyy-MM-dd HH:mm:ss"), // Store formatted start time
      sleepEndTime: format(endTime, "yyyy-MM-dd HH:mm:ss"), // Store formatted end time
      interruptedTime: totalPauseDuration, // Store all interrupted times
      totalSleepDuration: timer, // Store total sleep time in seconds
      lightSleep: lightSleepMet,
      deepSleep: deepSleepMet,
      remSleep: remSleepMet,
      goal: 28800,

      };
  
      const docRef = await addDoc(collection(db, "sleepData"), sleepData);

      setTotalPauseDuration(0); // Reset total pause duration

    } catch (error) {
      console.error("Error saving sleep data:", error);
    }

  };

  useEffect(() => {
    let interval;
    if (sleeping) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1); // Update total sleep timer

        // Update the stage timer and manage sleep stages
        setStageTimer((prevStageTimer) => {
          const updatedStageTimer = prevStageTimer + 1; // Increment the stage timer
          manageSleepStages(updatedStageTimer); // Manage sleep stages based on stage timer
          return updatedStageTimer;
        });
      }, 1000); // Update every second
    } else if (!sleeping && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [sleeping, timer]);

  // Function to manage sleep stages
  const manageSleepStages = (totalStageTime) => {
    if (totalStageTime < 30 * 60) {
      setCurrentStage("Light Sleep"); // First 30 minutes
    } else if (totalStageTime < (30 + 150) * 60) {
      setCurrentStage("Deep Sleep"); // Next 1.5 hours
    } else if (totalStageTime < (30 + 150 + 60) * 60) {
      setCurrentStage("REM Sleep"); // Next 30 minutes
    } else {
      setCurrentStage("Awake or Unknown"); // After 2.5 hours or longer
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.textStyleLarge}>
          {sleeping ? "Sleeping" : "Sleep Paused"}
        </Text>

        <Text style={styles.textStyleMedium}>Track your sleep progress</Text>

        <View style={styles.timerBox}>
          <Text style={styles.timerText}>{formatTime(timer)}</Text>
        </View>

        {/* Conditionally render sleep stage only when sleep has started */}
        {sleepStarted && (
          <View>
            <Text style={styles.textStyleStageTitle}>Sleep Stage</Text>
            <Text style={styles.textStyleStage}>{currentStage}</Text>
          </View>
        )}
      </View>

      {!sleeping && !sleepStarted && (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.circularButton, styles.startButton]}
            onPress={startSleep}
          >
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        </View>
      )}

      {sleepStarted && sleeping && (
        <View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.circularButton, styles.pauseButton]}
              onPress={pauseSleep}
            >
              <Text style={styles.buttonText}>Pause</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.circularButton, styles.endButton]}
              onPress={stopSleep}
            >
              <Text style={styles.buttonText}>End</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {sleepStarted && !sleeping && (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.circularButton, styles.resumeButton]}
            onPress={resumeSleep}
          >
            <Text style={styles.buttonText}>Resume</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.circularButton, styles.endButton]}
            onPress={stopSleep}
          >
            <Text style={styles.buttonText}>Stop</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  contentContainer: {
    minHeight: 400,
    alignItems: "center",
  },
  textStyleLarge: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 20,
    textAlign: "center",
  },
  textStyleMedium: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  textStyleStage: {
    fontSize: 18,
    fontWeight: "medium",
    marginBottom: 20,
    textAlign: "center",
  },
  textStyleStageTitle: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  timerBox: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    width: "50%",
  },
  timerText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  circularButton: {
    width: 120,
    height: 120,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "medium",
    textAlign: "center",
  },
  startButton: {
    backgroundColor: "#407CE2",
  },
  pauseButton: {
    backgroundColor: "#407CE2",
  },
  resumeButton: {
    backgroundColor: "orange",
  },
  endButton: {
    backgroundColor: "red",
  },
});
