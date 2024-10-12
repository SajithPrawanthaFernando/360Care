import { roundToNearestHours, set } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import * as Progress from "react-native-progress";
import { useNavigation } from "expo-router";
import { getAuth } from "firebase/auth";
import { db } from "../../hooks/firebaseConfig";
import { query, where, getDocs, orderBy, limit,collection } from "firebase/firestore";


export default function Sleep() {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  const navigation = useNavigation();

  const [userSleepData, setUserSleepData] = useState([]);
  const [processedData, setProcessedData] = useState([]);

  const [totalSleepTime, setTotalSleepTime] = useState('');
  const [totalSleepDuration, setTotalSleepDuration] = useState(0);

  const [isRefreshing, setIsRefreshing] = useState(false); 

  const [currentDate, setCurrentDate] = useState("");

  const [lastCircle, setLastCircle] = useState(null);
  const convertSecondsToHours = (seconds) => {
    return seconds / 3600;
  };


  useEffect(() => {
    const results = userSleepData.map(item => {
      // Round totalSleepDuration to hours
      const hours = Math.round(item.totalSleepDuration / 3600);

      // Convert sleepStartTime to a day of the week
      const sleepStartDate = new Date(item.sleepStartTime);
      const dayOptions = { weekday: 'short' };
      const day = sleepStartDate.toLocaleDateString('en-US', dayOptions);

      // Return an object with the desired properties
      return {
        id: item.id,
        hours: hours,
        day: day
      };
    });

    // Set the processed data
    setProcessedData(results);
    calculateTotalSleep();
  }, [userSleepData]);
    const calculateTotalSleep = () => {
      // Sum of all totalSleepDuration (in milliseconds)
      const totalDuration = userSleepData.reduce((sum, sleep) => sum + sleep.totalSleepDuration, 0);
      console.log("Total duration in milliseconds:", totalDuration);

      setTotalSleepDuration(totalDuration);
      // Convert total duration from milliseconds to hours and minutes
      const hours = Math.floor((totalDuration/5) / 3600); // 1 hour = 3600000 ms
      const minutes = Math.floor(((totalDuration/5) % 3600) / 60); // 1 minute = 60000 ms

      console.log("Total sleep time in hours and minutes:", hours, minutes);
      // Set the total sleep time in hh:mm format
      setTotalSleepTime(`${hours}h ${minutes}m`);
    };

    


  const fetchUserSleepData = async () => {
    if (!userId) {
      console.log("User is not authenticated.");
      return;
    }
  
    try {
      const sleepDataCollection = collection(db, "sleepData"); // Reference the sleepData collection
      const querySnapshot = await getDocs(sleepDataCollection,{ source: "server" }); // Get all documents from the collection
  
      const sleepData = [];
      querySnapshot.forEach((doc) => {
        sleepData.push({ id: doc.id, ...doc.data() }); // Add each document's data to the array
      });
  
      // Filter by userId and sort by sleepStartTime in descending order
      const filteredAndSortedSleepData = sleepData
      .filter((data) => data.userId === userId) // Filter by userId
      .sort((a, b) => new Date(b.sleepStartTime) - new Date(a.sleepStartTime)) // Sort by sleepStartTime in descending order
      .slice(0, 5) // Get the latest 5 records

      const sortedUserSleepData = filteredAndSortedSleepData.sort((a, b) => new Date(a.sleepStartTime) - new Date(b.sleepStartTime));
  
      setUserSleepData(sortedUserSleepData); // Update state with the filtered and sorted sleep data
       // Log the retrieved sleep data
    } catch (error) {
      console.error("Error fetching sleep data:", error);
    } finally {
      setIsRefreshing(false); // Reset refreshing state
    }
  };
  
  useEffect(() => {
    fetchUserSleepData();
    const today = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    const formattedDate = today.toLocaleDateString("en-US", options); // e.g. "Thursday, April 24, 2024"
    setCurrentDate(formattedDate);
  }, [userId]);
  

  const onRefresh = () => {
    setIsRefreshing(true); // Set refreshing state to true
    fetchUserSleepData(); // Fetch data
  };
  const handleCirclePress = (circle) => {

    const circleData = userSleepData.find(data => data.id === circle.id);

    if (circleData) {
      // Navigate to another page and pass the circle details
      navigation.navigate('SleepInfo', { circleData });
    } else {
      console.log("Circle data not found for the given ID.");
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent} refreshControl={
      <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} /> // Add RefreshControl here
    }>
      <Text style={styles.textStyleLarge}>{currentDate}</Text>

      {/* Circles */}
      <View style={styles.container}>
        {processedData.map((circle, index) => (
          <View key={index} style={styles.circleWrapper}>
            <TouchableOpacity onPress={() => handleCirclePress(circle)}>
              <View style={styles.circleContainer}>
                <Progress.Circle
                  progress={circle.hours / 8} // Convert percentage to 0-1 range
                  strokeWidth={20}
                  backgroundColor="rgba(195, 212, 255, 0.2)"
                  size={50}
                />
                {/* Text inside circle */}
                <Text style={styles.percentageText}>{circle.hours}h</Text>
              </View>
            </TouchableOpacity>
            <Text style={{ color: "#333" }}>{circle.day}</Text>
          </View>
        ))}
      </View>

      {/* Sleep */}
      <View style={styles.sleep}>
        <TouchableOpacity
          style={styles.sleepButton}
          onPress={() => navigation.navigate("TrackSleep")}
        >
          <Text style={styles.buttonText}>Sleep</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.textStyleSmallBold}>
            You have 7h and 30m to sleep
          </Text>
          <Text>Better start sleeping now!</Text>
        </View>
      </View>

      {/* Week Info */}

      <View style={styles.weekInfo}>
        <View style={styles.averageSleep}>
          <View>
            <Text>Avarage</Text>
            <Text>sleep time</Text>
            <Text>this week</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.averageSleepTextBold}>{totalSleepTime}</Text>
            <View>
              <Text>Hours</Text>
              <Text>per day</Text>
            </View>
          </View>
        </View>

        <View style={styles.averageQuality}>
          <Text>Quality</Text>

          <View style={styles.circleContainer}>
            <Progress.Circle
              progress={convertSecondsToHours(totalSleepDuration) / 40} // Convert percentage to 0-1 range
              progressColor="#407CE2"
              strokeWidth={20}
              backgroundColor="rgba(195, 212, 255, 0.2)"
              size={100}
            />
            <Text style={styles.percentageText}>{Math.round((convertSecondsToHours(totalSleepDuration) / 40) * 100)} %</Text>
          </View>
        </View>
      </View>
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
    backgroundColor: "rgba(195, 212, 255, 0.3)",
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
    fontSize: 30,
    fontWeight: "bold",
  },
  sleepInfoCard: {
    padding: 16,
    backgroundColor: "rgba(195, 212, 255, 0.3)",
    borderRadius: 16,
    gap: 20,
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

