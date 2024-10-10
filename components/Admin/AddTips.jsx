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
  Alert,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { db } from "../../hooks/firebaseConfig";
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { useNavigation } from "expo-router";
import { Picker } from "@react-native-picker/picker";

const AddTips = () => {
  const [tips, setTips] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState("general_tips");
  const [modalVisible, setModalVisible] = useState(false);
  const [newTip, setNewTip] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [modalSchema, setModalSchema] = useState("chronic_disease");
  const auth = getAuth();
  const navigation = useNavigation();

  // Fetch tips from Firestore based on selected schema
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "healthTips", selectedSchema),
      (doc) => {
        const data = doc.data();
        if (data && data.tips) {
          setTips(data.tips);
        }
      }
    );

    return () => unsubscribe();
  }, [selectedSchema]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate("login");
    } catch (error) {
      Alert.alert("Logout Error", error.message);
    }
  };

  // Add a new tip to the selected schema
  const addTip = async () => {
    setErrorMessage("");

    if (!newTip.trim()) {
      setErrorMessage("Please fill in the tip text.");
      return;
    }

    try {
      const docRef = doc(db, "healthTips", modalSchema);
      const existingData = (await getDoc(docRef)).data();

      // Append the new tip to the existing tips array
      const updatedTips = [...existingData.tips, newTip];

      // Update the document with the new tips array
      await setDoc(docRef, { tips: updatedTips }, { merge: true });

      alert("Tip added");
      setModalVisible(false);
      setNewTip(""); // Clear the input
    } catch (error) {
      console.error("Error adding tip: ", error);
      setErrorMessage("Error adding tip. Please try again.");
    }
  };

  // Delete a tip
  const deleteTip = async (index) => {
    try {
      const docRef = doc(db, "healthTips", selectedSchema);
      const existingData = (await getDoc(docRef)).data();

      // Remove the tip from the existing array
      const updatedTips = existingData.tips.filter((_, i) => i !== index);

      // Update the document with the new tips array
      await setDoc(docRef, { tips: updatedTips }, { merge: true });

      alert("Tip deleted");
    } catch (error) {
      console.error("Error deleting tip: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Admin Dashboard</Text>

      <Text style={styles.sectionTitle}>Manage Tips</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Add Tip</Text>
        <MaterialCommunityIcons
          name="plus-circle"
          size={20}
          color="#fff"
          style={styles.icon}
        />
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Schema Selection</Text>

      <Picker
        selectedValue={selectedSchema}
        onValueChange={(itemValue) => setSelectedSchema(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="General Tips" value="general_tips" />
        <Picker.Item label="Chronic Disease" value="chronic_disease" />
        <Picker.Item label="Nutrition" value="nutrition" />
        <Picker.Item label="Fitness" value="fitness" />
        <Picker.Item label="Mental Health" value="mental_health" />
        <Picker.Item label="Stress Management" value="stress_management" />
      </Picker>

      <FlatList
        style={{ marginBottom: 5 }}
        data={tips}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>{item}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteTip(index)}
            >
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={20}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Tip</Text>

            {/* Schema Picker in Modal */}
            <Picker
              selectedValue={modalSchema}
              onValueChange={(itemValue) => setModalSchema(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Chronic Disease" value="chronic_disease" />
              <Picker.Item label="Nutrition" value="nutrition" />
              <Picker.Item label="Fitness" value="fitness" />
              <Picker.Item label="Mental Health" value="mental_health" />
              <Picker.Item
                label="Stress Management"
                value="stress_management"
              />
              <Picker.Item label="General Tips" value="general_tips" />
            </Picker>

            <TextInput
              style={styles.input}
              placeholder="Tip"
              value={newTip}
              onChangeText={(text) => {
                setNewTip(text);
                setErrorMessage(""); // Clear error on input change
              }}
            />
            {errorMessage ? (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            ) : null}

            <TouchableOpacity style={styles.Addtask} onPress={addTip}>
              <Text style={styles.Addtasktext}>Add Tip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
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
    </View>
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
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  tipCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tipTitle: {
    fontWeight: "bold",
    fontSize: 16,
    flex: 1, // Allow the text to take available space
    marginRight: 10, // Add some space between text and delete button
  },
  deleteButton: {
    backgroundColor: "#f44336",
    borderRadius: 20,
    padding: 5,
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
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 20,
  },
  Addtask: {
    border: 1,
    width: "100%",
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
  cancelButton: {
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  cancelText: {
    color: "#f44336",
    textAlign: "center",
    fontWeight: "bold",
  },
  errorMessage: {
    color: "#f44336",
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 25,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default AddTips;
