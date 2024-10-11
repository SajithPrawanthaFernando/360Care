import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const MealSelection = ({ route }) => {
  const { selectedBreakfast, selectedLunch, selectedDinner } = route.params;
  const navigation = useNavigation();

  const [selectedMeal, setSelectedMeal] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");

  const handleSelectMeal = (mealType) => {
    setSelectedMeal(mealType);
  };

  const handleSelectLevel = (level) => {
    setSelectedLevel(level);
  };

  const handleCalibrate = () => {
    navigation.navigate("BreakPlanPage");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estimate Level of Meal</Text>

      {/* Add the description below the title */}
      <Text style={styles.description}>
        If you break your meal, what meal did you break?
      </Text>

      {/* Display selected breakfast */}
      <View style={styles.mealContainer}>
        <ImageBackground
          source={selectedBreakfast.image}
          style={styles.mealImage}
          imageStyle={styles.curvedImage}
          onTouchEnd={() => handleSelectMeal("Breakfast")}
        >
          <Text style={styles.mealName}>Breakfast</Text>
          <Text style={styles.mealName}>{selectedBreakfast.name}</Text>
        </ImageBackground>
      </View>

      {/* Display selected lunch */}
      <View style={styles.mealContainer}>
        <ImageBackground
          source={selectedLunch.image}
          style={styles.mealImage}
          imageStyle={styles.curvedImage}
          onTouchEnd={() => handleSelectMeal("Lunch")}
        >
          <Text style={styles.mealName}>Lunch</Text>
          <Text style={styles.mealName}>{selectedLunch.name}</Text>
        </ImageBackground>
      </View>

      {/* Display selected dinner */}
      <View style={styles.mealContainer}>
        <ImageBackground
          source={selectedDinner.image}
          style={styles.mealImage}
          imageStyle={styles.curvedImage}
          onTouchEnd={() => handleSelectMeal("Dinner")}
        >
          <Text style={styles.mealName}>Dinner</Text>
          <Text style={styles.mealName}>{selectedDinner.name}</Text>
        </ImageBackground>
      </View>

      {/* Level selection buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.levelButton,
            { backgroundColor: selectedLevel === "Low" ? "red" : "gray" },
          ]}
          onPress={() => handleSelectLevel("Low")}
        >
          <Text style={styles.buttonText}>low</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.levelButton,
            { backgroundColor: selectedLevel === "Mid" ? "yellow" : "gray" },
          ]}
          onPress={() => handleSelectLevel("Mid")}
        >
          <Text style={styles.buttonText}>mid</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.levelButton,
            { backgroundColor: selectedLevel === "High" ? "green" : "gray" },
          ]}
          onPress={() => handleSelectLevel("High")}
        >
          <Text style={styles.buttonText}>high</Text>
        </TouchableOpacity>
      </View>

      {/* Calibrate button */}
      <TouchableOpacity
        style={styles.calibrateButton}
        onPress={handleCalibrate}
        disabled={!selectedMeal || !selectedLevel}
      >
        <Text style={styles.buttonText}>calibrate</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 20,
  },
  mealContainer: {
    flex: 1,
    marginBottom: 20,
  },
  mealName: {
    textAlign: "center",
    fontSize: 20,
    color: "#000000",
    marginTop: 5,
    backgroundColor: "#fff",
    fontWeight: "600",
  },
  mealImage: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  curvedImage: {
    borderRadius: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  levelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    textTransform: "lowercase",
    textAlign: "center",
  },
  calibrateButton: {
    backgroundColor: "blue",
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 20,
  },
});

export default MealSelection;
