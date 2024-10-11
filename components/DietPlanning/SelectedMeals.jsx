import React from 'react';
import { View, Text, ImageBackground, StyleSheet, ScrollView ,Button,TouchableOpacity,} from 'react-native';
import { useNavigation } from '@react-navigation/native';
const SelectedMeals = ({ route }) => {
    const { selectedBreakfast, selectedLunch, selectedDinner } = route.params;
    const navigation = useNavigation();
    const calculateTotalBudget = () => {
        let totalBudget = 0;
        if (selectedBreakfast) totalBudget += selectedBreakfast.budget;
        if (selectedLunch) totalBudget += selectedLunch.budget;
        if (selectedDinner) totalBudget += selectedDinner.budget;
        return totalBudget;
    };
    
    const handleSelect = () => {
        navigation.navigate('MealSummary', {
            selectedBreakfast,
            selectedLunch,
            selectedDinner
        });
    };
    const handleChangePress = () => {
        navigation.navigate('Diet'); // Navigate to the Diet page
      };
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}> Meals for Day </Text>

            {/* Breakfast Meal */}
            {selectedBreakfast && (
                <View style={styles.mealRow}>
                    <View style={styles.detailsContainer}>
                        <View style={styles.blueBox}>
                            <Text style={styles.caloriesText}> Calories: {selectedBreakfast.calories} kcal</Text>
                            <Text style={styles.budgetText}> Budget: {selectedBreakfast.budget} LKR</Text>
                        </View>
                    </View>
                    <View style={styles.mealContainer}>
                        <ImageBackground source={selectedBreakfast.image} style={styles.mealImage}>
                            <Text style={styles.mealName}>{selectedBreakfast.name}</Text>
                        </ImageBackground>
                    </View>
                    
                </View>
            )}

            {/* Lunch Meal */}
            {selectedLunch && (
                <View style={styles.mealRow}>
                    <View style={styles.detailsContainer}>
                        <View style={styles.blueBox}>
                            <Text style={styles.caloriesText}> Calories: {selectedLunch.calories} kcal</Text>
                            <Text style={styles.budgetText}> Budget: {selectedLunch.budget} LKR</Text>
                        </View>
                    </View>
                    <View style={styles.mealContainer}>
                        <ImageBackground source={selectedLunch.image} style={styles.mealImage}>
                            <Text style={styles.mealName}>{selectedLunch.name}</Text>
                        </ImageBackground>
                    </View>
                    
                </View>
            )}

            {/* Dinner Meal */}
            {selectedDinner && (
                <View style={styles.mealRow}>
                     <View style={styles.detailsContainer}>
                        <View style={styles.blueBox}>
                            <Text style={styles.caloriesText}> Calories: {selectedDinner.calories} kcal</Text>
                            <Text style={styles.budgetText}> Budget: {selectedDinner.budget} LKR</Text>
                        </View>
                    </View>
                    <View style={styles.mealContainer}>
                        <ImageBackground source={selectedDinner.image} style={styles.mealImage}>
                            <Text style={styles.mealName}>{selectedDinner.name}</Text>
                        </ImageBackground>
                    </View>
                   
                </View>
            )}
              <View style={styles.totalBudgetContainer}>
                <Text style={styles.totalBudgetText}>Total Budget for the Day: {calculateTotalBudget()} LKR</Text>
            </View>

            {/* Buttons for user actions */}
            <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleChangePress}>
        <Text style={styles.buttonText}>Change</Text>
      </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.redButton]} onPress={handleSelect}>
                <Text style={styles.buttonText}>Select</Text>
            </TouchableOpacity>
        </View>

       
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f8f9fa",
    },
    buttonContainer: {
        flexDirection: 'row', // Align buttons in a row
        justifyContent: 'space-between', // Add space between buttons
        paddingHorizontal: 20, // Adjust horizontal padding
        marginVertical: 20, // Adjust vertical margin
    },
    button: {
        backgroundColor: 'red', // Default button background color
        borderRadius: 15, // Rounded corners
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        width: 140, // Adjust width as needed
    },
    redButton: {
        backgroundColor: '#007bff', // Red button for the "Change" action
    },
    buttonText: {
        color: '#fff', // White text
        fontSize: 16,
        fontWeight: 'bold',
    },
    
    title: {
        marginTop:20,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        justifyContent: 'center',
        marginLeft:100,
    },
    mealRow: {
        flexDirection: 'row', // Align meals and details side by side
        marginBottom:50,
    },
    mealContainer: {
        flex: 1,
        marginLeft: 1, // Space between meal image and details
        borderRadius: 15,
        overflow: 'hidden',
        
    },
    mealImage: {
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mealName: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
        padding: 5,
        // Optional: for better readability
    },
    detailsContainer: {
        flex: 1,
        height:100,
    },
    blueBox: {
        backgroundColor: '#007bff', // Blue background for details
        borderRadius: 10,
        padding: 10,
        justifyContent: 'center',
        height:120,
    },
    caloriesText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
    budgetText: {
        fontSize: 16,
        color: '#fff',
        marginTop: 5,
       
    },
    totalBudgetText: {
        fontSize: 18,
        color: '#007bff',
        marginTop: 0,
        fontWeight: 'bold',
        justifyContent: 'center',
        marginLeft:30,
       
       
    },
     
       
    
});

export default SelectedMeals;
