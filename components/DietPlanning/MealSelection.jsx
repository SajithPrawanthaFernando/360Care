import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MealSelection = ({ route }) => {
    // Destructure the selected meals from route.params
    const { selectedBreakfast, selectedLunch, selectedDinner } = route.params;
    const navigation = useNavigation(); // Access navigation

    // State to store the selected meal type and level
    const [selectedMeal, setSelectedMeal] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');

    const handleSelectMeal = (mealType) => {
        setSelectedMeal(mealType);
    };

    const handleSelectLevel = (level) => {
        setSelectedLevel(level);
    };

    const handleCalibrate = () => {
        // Create a summary of selected meal levels
        const calibratedMessage = `
            ${selectedMeal}: Level - ${selectedLevel}
        `;

        // Show the selected meal levels in an alert
        
        // Navigate to the breakfast page (replace 'BreakfastPage' with your actual route name)
        navigation.navigate('BreakPlanPage');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Estimate Level of Meal</Text>

            {/* Display selected breakfast */}
            <View style={styles.mealContainer}>
            <View style={styles.blueBox}>
                <ImageBackground 
                    source={selectedBreakfast.image} // Assuming this is an imported image
                    style={styles.mealImage}
                    onTouchEnd={() => handleSelectMeal('Breakfast')}
                >
                    <Text style={styles.mealName}>{selectedBreakfast.name}</Text>
                </ImageBackground>
                </View>
            </View>

            {/* Display selected lunch */}
            <View style={styles.mealContainer}>
            <View style={styles.blueBox}>
                <ImageBackground 
                    source={selectedLunch.image} // Assuming this is an imported image
                    style={styles.mealImage}
                    onTouchEnd={() => handleSelectMeal('Lunch')}
                >
                    <Text style={styles.mealName}>{selectedLunch.name}</Text>
                </ImageBackground>
                </View>
            </View>

            {/* Display selected dinner */}
            <View style={styles.mealContainer}>
            <View style={styles.blueBox}>
                <ImageBackground 
                    source={selectedDinner.image} // Assuming this is an imported image
                    style={styles.mealImage}
                    onTouchEnd={() => handleSelectMeal('Dinner')}
                >
                    
                </ImageBackground>
                <Text style={styles.mealName}>{selectedDinner.name}</Text>
                </View>
            </View>

            {/* Level selection buttons */}
            <View style={styles.buttonContainer}>
                <Button
                    title="Low"
                    onPress={() => handleSelectLevel('Low')}
                    color={ 'Low' ? 'red' : 'gray'}
                />
                <Button
                    title="Mid"
                    onPress={() => handleSelectLevel('Mid')}
                    color={ 'Mid' ? 'yellow' : 'gray'}
                />
                <Button
                    title="High"
                    onPress={() => handleSelectLevel('High')}
                    color={ 'High' ? 'green' : 'gray'}
                />
            </View>

            {/* Calibrate button */}
            <Button
                title="Calibrate"
                onPress={handleCalibrate}
                 // Disable if no level or meal is selected
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    mealContainer: {
        flex: 1,
        marginLeft: 1, // Space between meal image and details
        borderRadius: 15,
        overflow: 'hidden',
    },
    mealName: {
        textAlign: 'center',
        fontSize: 20,
        color: '#fff', 
      
        // White text for contrast
    },
    mealImage: {
        height: 100,
        width:100,
        justifyContent: 'center',
        alignItems: 'center', // Circular image
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
    },
    blueBox: {
        backgroundColor: '#007bff', // Blue background for details
        borderRadius: 10,
        padding: 10,
        justifyContent: 'center',
        height:120,
    },
});

export default MealSelection;
