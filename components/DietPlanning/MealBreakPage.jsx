import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import breakfastImg from '../../assets/images/breakfast.png'; // Your local images
import lunchImg from '../../assets/images/lunch.png';
import dinnerImg from '../../assets/images/dinner.png';

const MealBreakPage = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Breakfast */}
            <View style={styles.mealContainer}>
                <Image source={breakfastImg} style={styles.mealImage} />
                <View style={styles.mealBox}>
                    <Text style={styles.mealText}>Breakfast</Text>
                </View>
            </View>

            {/* Lunch */}
            <View style={styles.mealContainer}>
                <Image source={lunchImg} style={styles.mealImage} />
                <View style={styles.mealBox}>
                    <Text style={styles.mealText}>Lunch</Text>
                </View>
            </View>

            {/* Dinner */}
            <View style={styles.mealContainer}>
                <Image source={dinnerImg} style={styles.mealImage} />
                <View style={styles.mealBox}>
                    <Text style={styles.mealText}>Dinner</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
    },
    mealContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
        elevation: 5,
    },
    mealImage: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
        marginRight: 20,
    },
    mealBox: {
        flex: 1,
        backgroundColor: '#007bff', // Blue background for the box
        padding: 15,
        borderRadius: 10,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
        elevation: 5,
    },
    mealText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
});

export default MealBreakPage;
