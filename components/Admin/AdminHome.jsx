import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Button,
  Alert,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { db } from "../../hooks/firebaseConfig";
import { getAuth, signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  deleteDoc,
  onSnapshot,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { useNavigation } from "expo-router";

const AdminHome = () => {
  const [tips, setTips] = useState([]);
  const [showAllTips, setShowAllTips] = useState(false);
  const [usersCount, setUsersCount] = useState(0);
  const [tasksCount, setTasksCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskIcon, setTaskIcon] = useState(""); // Default icon
  const [taskId, setTaskId] = useState(""); // Input for document ID
  const [errorMessage, setErrorMessage] = useState("");
  const auth = getAuth();
  const navigation = useNavigation();

  // Fetch total users and tasks count
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        setUsersCount(usersSnapshot.size);

        const tasksSnapshot = await getDocs(collection(db, "tasks"));
        setTasksCount(tasksSnapshot.size);
      } catch (error) {
        console.log("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

  // Fetch real-time tasks from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tasks"), (querySnapshot) => {
      const tasksList = [];
      querySnapshot.forEach((doc) => {
        tasksList.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      setTips(tasksList);
      setTasksCount(tasksList.length); // Update the task count
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate("login");
    } catch (error) {
      Alert.alert("Logout Error", error.message);
    }
  };

  // Add a new task
  const addTask = async () => {
    // Reset the error message on each add attempt
    setErrorMessage("");

    // Validation logic
    if (!taskId.trim() || !taskTitle.trim() || !taskIcon.trim()) {
      setErrorMessage("Please fill in all fields.");
      return; // Exit if validation fails
    }

    try {
      // Convert the icon name to lowercase
      const iconName = taskIcon.toLowerCase();

      // Use the provided taskId as the document ID
      await setDoc(doc(db, "tasks", taskId), {
        title: taskTitle,
        icon: iconName,
        active: true,
        complete: false, // Set complete to false
      });

      alert("Task added");
      setModalVisible(false); // Close the modal
      setTaskTitle(""); // Clear the input
      setTaskIcon(""); // Reset the icon to default
      setTaskId(""); // Clear the task ID input
    } catch (error) {
      console.error("Error adding task: ", error);
      setErrorMessage("Error adding task. Please try again."); // Provide feedback on error
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
      alert("Task deleted");
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

  // Toggle between showing two tasks or all tasks
  const displayedTips = showAllTips ? tips : tips.slice(0, 3);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Admin Dashboard</Text>
      <View style={styles.dashboardOverview}>
        <View style={styles.overviewCard}>
          <MaterialCommunityIcons
            name="clipboard-text-outline"
            size={30}
            color="#4CAF50"
          />
          <Text style={styles.overviewText}>Total Tasks</Text>
          <Text style={styles.overviewNumber}>{tasksCount}</Text>
        </View>
        <View style={styles.overviewCard}>
          <MaterialCommunityIcons
            name="account-multiple"
            size={30}
            color="#007BFF"
          />
          <Text style={styles.overviewText}>Active Users</Text>
          <Text style={styles.overviewNumber}>{usersCount}</Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Manage Tips</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Add Task</Text>
        <MaterialCommunityIcons
          name="plus-circle"
          size={20}
          color="#fff"
          style={styles.icon}
        />
      </TouchableOpacity>

      <View style={styles.seeAll}>
        <Text style={[styles.sectionTitle, { marginTop: 10 }]}>All Tasks</Text>
        {tips.length > 2 && (
          <TouchableOpacity
            style={styles.seeAllButton}
            onPress={() => setShowAllTips(!showAllTips)}
          >
            <Text style={styles.seeAllButtonText}>
              {showAllTips ? "Show Less" : "See All"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        style={{ marginBottom: 25 }}
        data={displayedTips}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.tipCard}>
            <View style={styles.tipContent}>
              <MaterialCommunityIcons
                name={item.icon}
                size={30}
                color="#007BFF"
              />
              <View style={styles.tipDetails}>
                <Text
                  style={styles.tipTitle}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {item.title}
                </Text>
              </View>
            </View>
            <View style={styles.tipActions}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteTask(item.id)}
              >
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={20}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      {/* Modal for Adding Tasks */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Task</Text>
            <TextInput
              style={styles.input}
              placeholder="Document ID"
              value={taskId}
              onChangeText={(text) => {
                setTaskId(text);
                setErrorMessage(""); // Clear error on input change
              }}
            />
            <TextInput
              style={styles.input}
              placeholder="Task Title"
              value={taskTitle}
              onChangeText={(text) => {
                setTaskTitle(text);
                setErrorMessage(""); // Clear error on input change
              }}
            />
            <TextInput
              style={styles.input}
              placeholder="Icon (e.g. clipboard-text-outline)"
              value={taskIcon}
              onChangeText={(text) => {
                setTaskIcon(text);
                setErrorMessage(""); // Clear error on input change
              }}
            />

            {/* Display error message if any */}
            {errorMessage ? (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            ) : null}

            <TouchableOpacity style={styles.Addtask} onPress={addTask}>
              <Text style={styles.Addtasktext}>Add Task</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.Deletetasktext}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.addButtonText}>Log Out</Text>
        <MaterialCommunityIcons
          name="logout"
          size={20}
          color="#fff"
          style={styles.icon}
        />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  dashboardOverview: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  overviewCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    width: "45%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  overviewText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
  overviewNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
  tipCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  tipContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  tipDetails: {
    marginLeft: 30,
    flexShrink: 1, // Allow the title to shrink to prevent overflow
  },
  tipTitle: {
    fontWeight: "bold",
    fontSize: 15,
    maxWidth: "80%", // Set a maximum width to prevent overlapping
  },
  tipActions: {
    flexDirection: "row",
  },
  deleteButton: {
    backgroundColor: "#f44336",
    borderRadius: 20,
    padding: 5,
  },
  seeAllButton: {
    marginTop: 10,
    alignItems: "center",
  },
  seeAllButtonText: {
    color: "#007BFF",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  seeAll: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  Addtask: {
    border: 1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
    backgroundColor: "#007BFF",
    borderColor: "#007BFF",
    marginBottom: 10,
  },
  Addtasktext: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
  },
  Deletetasktext: {
    color: "#f44336",
    textAlign: "center",
    fontWeight: "bold",
  },
  errorMessage: {
    color: "#f44336",
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 40,
    flexDirection: "row",
    marginTop: 30,
    justifyContent: "space-between",
  },
});

export default AdminHome;
