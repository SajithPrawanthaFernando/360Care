import React from 'react';
import { View, Text, Button,TouchableOpacity,StyleSheet } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
const MealSummary = ({ route }) => {
    const { selectedBreakfast, selectedLunch, selectedDinner } = route.params;
    const navigation = useNavigation();
    const calculateTotalCalories = () => {
        let totalCalories = 0;
        const meals = [selectedBreakfast, selectedLunch, selectedDinner];

        meals.forEach((meal) => {
            if (meal) {
                totalCalories += meal.calories; // Add the calories for each meal
            }
        });
        return totalCalories;
    };
    const handleMealSelection = () => {
        navigation.navigate('MealSelection', {
            selectedBreakfast,
            selectedLunch,
            selectedDinner,
        });
    };
    const calculateNutrientPercentages = (totalCalories) => {
        let totalCarbsCalories = 0;
        let totalProteinCalories = 0;
        let totalFatCalories = 0;

        const meals = [selectedBreakfast, selectedLunch, selectedDinner];

        meals.forEach((meal) => {
            if (meal) {
                totalCarbsCalories += totalCalories * 0.04; // 1g carbs = 4 calories
                totalProteinCalories += totalCalories * 0.04; // 1g protein = 4 calories
                totalFatCalories += totalCalories * 0.09; // 1g fat = 9 calories
            }
        });

        const carbsPercentage = (totalCarbsCalories / totalCalories) * 100;
        const proteinPercentage = (totalProteinCalories / totalCalories) * 100;
        const fatPercentage = (totalFatCalories / totalCalories) * 100;

        // Assuming vitamins and iron are part of the fats category or are small fractions
        const vitaminsPercentage = fatPercentage * 0.2; // This is an assumption, you can adjust this based on real data
        const ironPercentage = fatPercentage * 0.1; // Another assumption, adjust as necessary

        return {
            carbs: Math.round(carbsPercentage),
            protein: Math.round(proteinPercentage),
            fats: Math.round(fatPercentage),
            vitamins: Math.round(vitaminsPercentage),
            iron: Math.round(ironPercentage),
        };
    };

    const totalCalories = calculateTotalCalories();
    const nutrientPercentages = calculateNutrientPercentages(totalCalories);
    
    const percentage = (totalCalories / 2000) * 100; // Assuming a daily intake of 2000 calories for the example
    const radius = 100; // Radius of the semicircle
    const circumference = 2 * Math.PI * radius; // Calculate circumference
    const fillAmount = (percentage / 100) * circumference; // Calculate fill amount

    // Function to create a path for the semicircle
    const createArc = (radius, startAngle, endAngle) => {
        const x1 = radius * Math.cos(startAngle);
        const y1 = radius * Math.sin(startAngle);
        const x2 = radius * Math.cos(endAngle);
        const y2 = radius * Math.sin(endAngle);
        const largeArc = endAngle - startAngle > Math.PI ? 1 : 0; // Determine if the arc is large

        return `M ${x1},${y1} A ${radius},${radius} 0 ${largeArc} 1 ${x2},${y2} L 0,0 Z`;
    };

    // Start and end angles for the filled and unfilled arcs
    const startAngle = -Math.PI; // Start from the left side of the circle
    const endAngleFilled = startAngle + (fillAmount / radius);
    const endAngleEmpty = Math.PI; // End angle for the unfilled part

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Meal Summary</Text>

            {/* Total Meal Summary in Half Pie Chart */}
            <View style={styles.summaryCircle}>
                <Svg height={400} width={400}>
                    <G rotation="180" originX="100" originY="100">
                        {/* Filled Portion */}
                        <Path d={createArc(radius, startAngle, endAngleFilled)} fill="#007bff" />
                        <Svg height={100} width={100}>
                        <Path d={createArc(radius, endAngleFilled, endAngleEmpty)} fill="#e0e0e0" />
                        </Svg>
                    </G>
                </Svg>
                <Text style={styles.circleText1}>{Math.round(percentage)}%</Text>
            </View>

            {/* Other nutrients in circles */}
            <View style={styles.circlesContainer}>
            <View style={styles.circle}>
            <Text style={styles.textContainer}>
    <Text style={styles.nutrientLabel}>Carbs</Text> {/* Grey color for "Carbs" */}
    {"\n"} {/* Line break */}
    <Text style={styles.percentage}>{nutrientPercentages.carbs}%</Text> {/* Black color for percentage */}
</Text>


</View>

                <View style={styles.circle}>
                    <Text style={styles.nutrientLabel}>Protein </Text>
                    <Text style={styles.percentage}>{nutrientPercentages.protein}%</Text> 
                </View>
            </View>
            <View style={styles.circlesContainer}>
                <View style={styles.circle}>
                    <Text style={styles.nutrientLabel}>Vitamins </Text>
                    <Text style={styles.percentage}>{nutrientPercentages.vitamins}%</Text> 
                </View>
                <View style={styles.circle}>
                    <Text style={styles.nutrientLabel}>Iron </Text>
                    <Text style={styles.percentage}>{nutrientPercentages.iron}%</Text>
                    
                </View>
            </View>
             {/* Buttons for user actions */}
             <View style={styles.buttonContainer}>
            
             <TouchableOpacity
                style={[styles.button, styles.redButton]}
                onPress={handleMealSelection} // Navigate to MealSelection page with selected meals
            >
                <Text style={styles.buttonText}>Break</Text>
            </TouchableOpacity>
        </View>
        </View>
         
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    buttonText: {
        color: '#fff', // White text
        fontSize: 16,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#007bff', // Default button background color
        borderRadius: 15, // Rounded corners
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        width: 140,
        marginLeft:100, // Adjust width as needed
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    summaryCircle: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        alignSelf: 'center',
        borderTopLeftRadius:150,
        borderBottomLeftRadius:150,
    },
    
    circleText: {
        
        fontWeight: 'bold',
    },
    nutrientLabel: {
        color: '#808080', // Grey color for "Carbs"
    },
    percentage: {
        color: '#000000',
        fontSize: 22,
        fontWeight: 'bold', // Black color for percentage
    },
    circleText1: {
        color: '#000000',
        fontSize: 26,
        fontWeight: 'bold',
        position: 'absolute', // Center the text
    },
    circlesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 30,
    },
    circle: {
        backgroundColor: '#fff',
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#007B5F',
    },
});

export default MealSummary;
