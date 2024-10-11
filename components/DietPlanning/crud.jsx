import React, { useState, useEffect } from "react";
import { View, FlatList, Alert, TextInput, Button, Text, StyleSheet, Modal, Pressable } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons'; // Import Ionicons or any other icons
import { db } from "../../hooks/firebaseConfig"; // Ensure this path is correct
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";

const Crud = () => {
  const [dietName, setDietName] = useState("");
  const [calories, setCalories] = useState("");
  const [diets, setDiets] = useState([]);
  const [selectedDiet, setSelectedDiet] = useState(null);
  const [visible, setVisible] = useState(false);

  // Fetch diets from Firebase Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "favoriteDiets"), (snapshot) => {
      const dietList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDiets(dietList);
    });

    return () => unsubscribe();
  }, []);

  // Show dialog
  const showDialog = () => setVisible(true);

  // Hide dialog
  const hideDialog = () => {
    setVisible(false);
    setDietName("");
    setCalories("");
    setSelectedDiet(null);
  };

  // Add a new diet
  const addDiet = async () => {
    if (dietName && calories) {
      try {
        await addDoc(collection(db, "favoriteDiets"), {
          dietName,
          calories: parseInt(calories),
        });
        hideDialog(); // Hide dialog after adding
      } catch (error) {
        console.error("Error adding document: ", error); // Log detailed error
        Alert.alert("Error", "Failed to add diet: " + error.message);
      }
    }
  };

  // Update an existing diet
  const updateDiet = async () => {
    if (selectedDiet && dietName && calories) {
      try {
        const dietRef = doc(db, "favoriteDiets", selectedDiet.id);
        await updateDoc(dietRef, {
          dietName,
          calories: parseInt(calories), // Ensure calories is a number
        });
        hideDialog(); // Hide dialog after updating
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    } else {
      Alert.alert("Error", "Please select a diet to update");
    }
  };

  // Delete a diet with confirmation
  const deleteDiet = (id) => {
    Alert.alert("Confirm Deletion", "Do you really want to delete this diet?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Yes, Delete it",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "favoriteDiets", id));
          } catch (error) {
            Alert.alert("Error", error.message);
          }
        },
      },
    ]);
  };

  // Select a diet to update
  const selectDiet = (diet) => {
    setDietName(diet.dietName);
    setCalories(diet.calories.toString()); // Convert calories to string for TextInput
    setSelectedDiet(diet);
    showDialog(); // Show dialog for updating
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Favorite Diets</Text>
      
      <View style={styles.addButtonContainer}>
        <Pressable style={styles.roundButton} onPress={showDialog}>
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>
      </View>

      <FlatList
        data={diets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.dietName}</Text>
            <Text style={styles.cardText}>{item.calories} kcal</Text>
            <View style={styles.cardActions}>
              <Pressable onPress={() => selectDiet(item)}>
                <Icon name="pencil-outline" size={24} color="blue" />
              </Pressable>
              <Pressable onPress={() => deleteDiet(item.id)}>
                <Icon name="trash-outline" size={24} color="red" />
              </Pressable>
            </View>
          </View>
        )}
      />

      <Modal
        transparent={true}
        visible={visible}
        animationType="slide"
        onRequestClose={hideDialog}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedDiet ? "Update Diet" : "Add Diet"}</Text>
            <TextInput
              placeholder="Diet Name"
              value={dietName}
              onChangeText={(text) => setDietName(text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Calories"
              value={calories}
              onChangeText={(text) => setCalories(text)}
              keyboardType="numeric"
              style={styles.input}
            />
            <View style={styles.modalActions}>
              <Pressable style={[styles.button, styles.cancelButton]} onPress={hideDialog}>
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.button, styles.submitButton]} onPress={selectedDiet ? updateDiet : addDiet}>
                <Text style={styles.buttonText}>{selectedDiet ? "Update" : "Add"}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  addButtonContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  roundButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    lineHeight: 24,
  },
  card: {
    marginBottom: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between', // Align items to space out
    alignItems: 'center', // Center items vertically
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardText: {
    fontSize: 16,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center', // Align icons vertically
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    borderRadius: 5,
    padding: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  submitButton: {
    backgroundColor: '#007BFF',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default Crud;
