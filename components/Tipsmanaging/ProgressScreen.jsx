import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Switch,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ProgressBar from "react-native-progress/Bar";
import { useNavigation } from "expo-router";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db, auth } from "../../hooks/firebaseConfig";
import progress from "../../assets/images/progress.png";

const ProgressScreen = () => {
  const navigation = useNavigation();
  const [tasks, setTasks] = useState([]);
  const [progressPercentage, setProgressPercentage] = useState(0);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Get the current user ID from Firebase Authentication
        const userId = auth.currentUser?.uid;
        if (!userId) {
          console.error("No user is logged in.");
          return;
        }

        // Fetch global tasks
        const globalTasksRef = collection(db, "tasks");
        const querySnapshot = await getDocs(globalTasksRef);
        const globalTasks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch user's tasks
        const userTasksRef = collection(db, `users/${userId}/taskcollection`);
        const userTasksSnapshot = await getDocs(userTasksRef);
        const userTasks = userTasksSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Merge global tasks with user's tasks
        const tasksMap = new Map();
        globalTasks.forEach((task) => tasksMap.set(task.id, task));
        userTasks.forEach((task) =>
          tasksMap.set(task.id, { ...tasksMap.get(task.id), ...task })
        );

        const mergedTasks = Array.from(tasksMap.values());

        // Filter tasks to show only unfinished ones
        const unfinishedTasks = mergedTasks.filter((task) => !task.completed);
        setTasks(unfinishedTasks);

        // Calculate progress percentage
        const totalTasks = mergedTasks.length;
        const completedTasks = mergedTasks.filter(
          (task) => task.completed
        ).length;
        const percentage =
          totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        setProgressPercentage(percentage);
      } catch (error) {
        console.error("Error fetching tasks: ", error);
      }
    };

    fetchTasks();
  }, []);

  const renderTaskItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.taskItem}>
        <MaterialCommunityIcons name={item.icon} size={40} color="#ff8a65" />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.taskTitle}>{item.title}</Text>
        </View>
        <Switch
          thumbColor={item.completed ? "#4a90e2" : "#d9d9d9"} // Color of the thumb when on and off
          value={item.completed}
          onValueChange={() => handleToggleTask(item.id, item.completed)}
        />
      </View>
    </View>
  );

  const handleToggleTask = async (taskId, currentStatus) => {
    try {
      // Get the current user ID from Firebase Authentication
      const userId = auth.currentUser?.uid;
      if (!userId) {
        console.error("No user is logged in.");
        return;
      }

      const taskRef = doc(db, `users/${userId}/taskcollection/${taskId}`);
      const taskDoc = await getDoc(taskRef);

      let taskData;

      if (!taskDoc.exists()) {
        // If the task document does not exist, create it
        const globalTaskRef = doc(db, `tasks/${taskId}`);
        const globalTaskDoc = await getDoc(globalTaskRef);

        if (globalTaskDoc.exists()) {
          // Use global task data if available
          taskData = globalTaskDoc.data();
          await setDoc(taskRef, {
            ...taskData,
            completed: !currentStatus,
          });
        } else {
          console.error("Global task does not exist.");
          return;
        }
      } else {
        // If the task document exists, update it
        taskData = taskDoc.data();
        await updateDoc(taskRef, { completed: !currentStatus });
      }

      // Update local tasks state after Firestore update is successful
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !currentStatus } : task
      );
      setTasks(updatedTasks);

      // Recalculate progress after updating the task
      recalculateProgress(updatedTasks);
    } catch (error) {
      console.error("Error updating task: ", error);
    }
  };

  // Function to recalculate progress
  const recalculateProgress = (updatedTasks) => {
    const totalTasks = updatedTasks.length;
    const completedTasks = updatedTasks.filter((task) => task.completed).length;
    const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    setProgressPercentage(percentage);
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={progress} style={styles.backgroundImage}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} />
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.headerText}>Watch Your{"\n"}Progress</Text>
        </View>
      </ImageBackground>

      <View style={styles.content}>
        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>Completed</Text>
          <ProgressBar
            progress={progressPercentage / 100}
            width={null}
            borderRadius={50}
            height={25}
            color="#4a90e2"
          />
          <View style={styles.progressValues}>
            <Text>0</Text>
            <Text>{Math.round(progressPercentage)}%</Text>
            <Text>100</Text>
          </View>
        </View>

        <View style={styles.taskHeader}>
          <Text style={styles.taskHeaderText}>Unfinished Tasks</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        {tasks.length > 0 ? (
          <FlatList
            data={tasks}
            renderItem={renderTaskItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.taskList}
          />
        ) : (
          <Text style={styles.noTasksText}>
            No unfinished tasks at the moment.
          </Text>
        )}
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
  progressSection: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  progressTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  progressValues: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  taskHeaderText: { fontSize: 16, fontWeight: "bold" },
  seeAllText: { color: "#4a90e2" },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
  taskTitle: { color: "#666", marginTop: 5 },
  taskList: { paddingBottom: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  noTasksText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 50,
  },
});

export default ProgressScreen;
