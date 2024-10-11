import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { getDoc, doc } from "firebase/firestore";
import { db, auth } from "../../hooks/firebaseConfig";
import diet from "../../assets/images/diet.png";
import m from "../../assets/images/m.png";
import { useNavigation } from "@react-navigation/native";
import Oats from "../../assets/images/Oats.jpeg";
import yogurt from "../../assets/images/yogurt.jpeg";
import Avocado from "../../assets/images/Avocado.jpeg";
import Smoothie from "../../assets/images/Smoothie.jpeg";
import Eggs from "../../assets/images/Eggs.jpeg";
import curry from "../../assets/images/curry.jpeg";
import chicken from "../../assets/images/chicken.jpeg";
import Vegetable from "../../assets/images/Vegetable.jpeg";
import soup from "../../assets/images/soup.jpeg";
import chickpea from "../../assets/images/chickpea.jpeg";
import fruits from "../../assets/images/fruits.jpeg";
import fish from "../../assets/images/fish.jpeg";
import pasta from "../../assets/images/pasta.jpeg";
import sl from "../../assets/images/sl.jpeg";
import v from "../../assets/images/v.jpeg";
const mealDatabase = {
  breakfast: [
    {
      name: "Oats",
      image: Oats,
      minBudget: 1000,
      maxBudget: 5000,
      bmiRange: [4.0, 5.0],
      calories: 250,
      budget: 400,
    },
    {
      name: "Fruits",
      image: fruits,
      minBudget: 1000,
      maxBudget: 5000,
      bmiRange: [4.0, 5.0],
      calories: 250,
      budget: 1000,
    },
    {
      name: "Yogurt",
      image: yogurt,
      minBudget: 1200,
      maxBudget: 4500,
      bmiRange: [3.5, 4.8],
      calories: 250,
      budget: 100,
    },
    {
      name: "Avocado Toast",
      image: Avocado,
      minBudget: 1500,
      maxBudget: 6000,
      bmiRange: [4.2, 5.0],
      calories: 250,
      budget: 400,
    },
    {
      name: "Smoothie Bowl",
      image: Smoothie,
      minBudget: 1300,
      maxBudget: 5500,
      bmiRange: [4.0, 5.0],
      calories: 250,
      budget: 500,
    },
    {
      name: "Eggs and Spinach",
      image: Eggs,
      minBudget: 1800,
      maxBudget: 7000,
      bmiRange: [4.0, 5.0],
      calories: 250,
      budget: 700,
    },
  ],
  lunch: [
    {
      name: "Rice and Curry",
      image: curry,
      minBudget: 1000,
      maxBudget: 5000,
      bmiRange: [4.0, 5.0],
      calories: 250,
      budget: 500,
    },
    {
      name: "Pasta",
      image: pasta,
      minBudget: 3000,
      maxBudget: 5000,
      bmiRange: [4.0, 4.5],
      calories: 250,
      budget: 500,
    },
    {
      name: "Grilled Chicken Salad",
      image: chicken,
      minBudget: 2500,
      maxBudget: 6000,
      bmiRange: [4.0, 5.0],
      calories: 250,
      budget: 500,
    },
    {
      name: "Quinoa Bowl",
      image: diet,
      minBudget: 2200,
      maxBudget: 6500,
      bmiRange: [4.0, 4.8],
      calories: 250,
      budget: 500,
    },
    {
      name: "Veggie Stir Fry",
      image: Vegetable,
      minBudget: 1500,
      maxBudget: 5000,
      bmiRange: [3.8, 5.0],
      calories: 250,
      budget: 500,
    },
    {
      name: "Fish Tacos",
      image: fish,
      minBudget: 3000,
      maxBudget: 7000,
      bmiRange: [4.0, 5.0],
      calories: 250,
      budget: 500,
    },
  ],
  dinner: [
    {
      name: "Soup",
      image: soup,
      minBudget: 1000,
      maxBudget: 5000,
      bmiRange: [4.0, 5.0],
      calories: 250,
      budget: 500,
    },
    {
      name: "Salad",
      image: sl,
      minBudget: 2000,
      maxBudget: 5000,
      bmiRange: [4.0, 5.0],
      calories: 250,
      budget: 500,
    },
    {
      name: "Grilled Salmon",
      image: fish,
      minBudget: 4000,
      maxBudget: 8000,
      bmiRange: [4.2, 5.0],
      calories: 250,
      budget: 500,
    },
    {
      name: "Vegetable Curry",
      image: v,
      minBudget: 1500,
      maxBudget: 4000,
      bmiRange: [4.0, 5.0],
      calories: 250,
      budget: 500,
    },
    {
      name: "Stuffed Bell Peppers",
      image: diet,
      minBudget: 2500,
      maxBudget: 6000,
      bmiRange: [4.0, 4.7],
      calories: 250,
      budget: 500,
    },
    {
      name: "Chickpea Stew",
      image: chickpea,
      minBudget: 1800,
      maxBudget: 5000,
      bmiRange: [3.9, 5.0],
      calories: 250,
      budget: 500,
    },
  ],
};

const Diet = () => {
  const [userData, setUserData] = useState(null);
  const [dietPlan, setDietPlan] = useState({
    breakfast: null,
    lunch: null,
    dinner: null,
  });
  const [selectedBreakfast, setSelectedBreakfast] = useState(null);
  const [selectedLunch, setSelectedLunch] = useState(null);
  const [selectedDinner, setSelectedDinner] = useState(null);
  const navigation = useNavigation();
  // Fetch user data
  const fetchUserData = async () => {
    const user = auth.currentUser;
    if (user) {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData({ bmi: data.bmi || 0, budget: data.budget || 0 });
      }
    }
  };

  // Filter meals based on BMI and budget
  const filterMeals = (meals, bmi, budget) => {
    return meals.filter(
      (meal) =>
        meal.minBudget <= budget &&
        meal.maxBudget >= budget &&
        meal.bmiRange[0] <= bmi &&
        meal.bmiRange[1] >= bmi
    );
  };

  // Generate diet plan based on user data
  const generateDietPlan = (bmi, budget) => {
    const breakfastOptions = filterMeals(mealDatabase.breakfast, bmi, budget);
    const lunchOptions = filterMeals(mealDatabase.lunch, bmi, budget);
    const dinnerOptions = filterMeals(mealDatabase.dinner, bmi, budget);

    setDietPlan({
      breakfast:
        breakfastOptions.length > 0 ? breakfastOptions.slice(0, 2) : null,
      lunch: lunchOptions.length > 0 ? lunchOptions.slice(0, 2) : null,
      dinner: dinnerOptions.length > 0 ? dinnerOptions.slice(0, 2) : null,
    });
  };

  // Fetch user data on mount
  useEffect(() => {
    const getUserDataAndGeneratePlan = async () => {
      await fetchUserData();
    };
    getUserDataAndGeneratePlan();
  }, []);

  // Generate diet plan when userData is available
  useEffect(() => {
    if (userData) {
      generateDietPlan(userData.bmi, userData.budget);
    }
  }, [userData]);

  const handleSelectMeals = () => {
    navigation.navigate("SelectedMeals", {
      selectedBreakfast,
      selectedLunch,
      selectedDinner,
    });
  };
  // Array of day names
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Function to get the current day name
  const getCurrentDayName = () => {
    const date = new Date();
    return dayNames[date.getDay()]; // Get current day name separately
  };
  // Get current date in the format: "Today, Month Day"
  const getCurrentDate = () => {
    const date = new Date();

    const options = { day: "numeric", month: "long" };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Image with date and title overlaid */}
      <ImageBackground
        source={m}
        style={styles.imageBackground}
        imageStyle={styles.imageBackgroundCurve}
      >
        <Text style={styles.date}>{getCurrentDate()}</Text>
        <Text style={styles.daten}>{getCurrentDayName()}</Text>
      </ImageBackground>

      {/* Breakfast Section */}
      <View style={styles.mealSection}>
        <Text style={styles.mealTitle}>Breakfirst</Text>
        <View style={styles.mealRow}>
          {dietPlan.breakfast ? (
            dietPlan.breakfast.map((meal, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedBreakfast(meal)}
              >
                <ImageBackground
                  source={meal.image}
                  style={styles.mealImage}
                  imageStyle={styles.mealImageCurve}
                >
                  <Text style={styles.mealName}>{meal.name}</Text>
                </ImageBackground>
              </TouchableOpacity>
            ))
          ) : (
            <Text>No suitable breakfirst found</Text>
          )}
        </View>
      </View>

      {/* Lunch Section */}
      <View style={styles.mealSection}>
        <Text style={styles.mealTitle}>Lunch</Text>
        <View style={styles.mealRow}>
          {dietPlan.lunch ? (
            dietPlan.lunch.map((meal, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedLunch(meal)}
              >
                <ImageBackground
                  source={meal.image}
                  style={styles.mealImage}
                  imageStyle={styles.mealImageCurve}
                >
                  <Text style={styles.mealName}>{meal.name}</Text>
                </ImageBackground>
              </TouchableOpacity>
            ))
          ) : (
            <Text>No suitable lunch found</Text>
          )}
        </View>
      </View>

      {/* Dinner Section */}
      <View style={styles.mealSection}>
        <Text style={styles.mealTitle}>Dinner</Text>
        <View style={styles.mealRow}>
          {dietPlan.dinner ? (
            dietPlan.dinner.map((meal, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedDinner(meal)}
              >
                <ImageBackground
                  source={meal.image}
                  style={styles.mealImage}
                  imageStyle={styles.mealImageCurve}
                >
                  <Text style={styles.mealName}>{meal.name}</Text>
                </ImageBackground>
              </TouchableOpacity>
            ))
          ) : (
            <Text>No suitable dinner found</Text>
          )}
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSelectMeals}>
            <Text style={styles.buttonText}>Select</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Crud")}
          >
            <Text style={styles.buttonText}>Favourites</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
  imageBackground: {
    width: 350,
    height: 220, // Set the width and height as specified
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  imageBackgroundCurve: {
    borderRadius: 15, // Apply the border radius to the image
  },
  date: {
    fontSize: 24, // Set size for the date
    color: "#000000", // White text for better contrast on image
    marginLeft: -180,
    paddingVertical: 5,
    borderRadius: 10,
    marginTop: -50,
  },
  daten: {
    fontSize: 32, // Set size for the date
    color: "#000000", // White text for better contrast on image
    marginLeft: -170,
    paddingVertical: 5,
    borderRadius: 10,
    marginTop: -10,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },

  mealRow: {
    flexDirection: "row", // Align the meals side by side
    justifyContent: "space-between",
  },
  mealImage: {
    width: 155,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  mealImageCurve: {
    borderRadius: 15, // Apply border radius to the image
  },
  mealName: {
    fontSize: 19,
    color: "#000000", // White text for the meal name inside the image
    fontWeight: "bold",
    paddingHorizontal: 5,
    paddingVertical: 2,
    backgroundColor: "#fff",
  },
  mealTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000000", // Blue text for section titles
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007BFF", // Button background color
    borderRadius: 15, // Rounded corners
    paddingVertical: 10, // Vertical padding
    paddingHorizontal: 20, // Horizontal padding
    alignItems: "center", // Center text horizontally
    marginTop: 0,
    marginLeft: 0,
    width: 122, // Space above the button
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFFFFF", // Text color
    fontSize: 16, // Font size
    fontWeight: "bold", // Bold text
  },
  buttonContainer: {
    flexDirection: "row", // Arrange buttons in a row
    justifyContent: "space-around", // Space out buttons evenly
    alignItems: "center", // Center buttons vertically
  },
});

export default Diet;
