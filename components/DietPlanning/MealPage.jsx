import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import Vegetable from "../../assets/images/Vegetable.jpeg";
import soup from "../../assets/images/soup.jpeg";
import d from "../../assets/images/d.png";
const MealPage = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>

            {/* Meal Plan Title */}
            <Text style={styles.planTitle}>Meal Plan</Text>

            {/* Vegetables Plan */}
            <TouchableOpacity style={styles.box}>
                <Image source={d} style={styles.image} />
                <Text style={styles.boxText}>1. Eat Vegetables</Text>
                <Text style={styles.descriptionText}>
                    A well-balanced diet rich in vegetables provides essential vitamins, minerals, and fiber. 
                    It supports digestion, improves overall health, and boosts the immune system. 
                </Text>
            </TouchableOpacity>

            {/* Soup Plan */}
            <TouchableOpacity style={styles.box}>
                <Image source={d} style={styles.image} />
                <Text style={styles.boxText}>2. Only Soup</Text>
                <Text style={styles.descriptionText}>
                    Soup, especially clear or vegetable-based soups, is a low-calorie meal that helps keep you 
                    hydrated and full. 
                </Text>
            </TouchableOpacity>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 20,
    },
    planTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    box: {
        width: '90%',
        height: 280,
        backgroundColor: '#ffffff',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 30,
        padding: 15,
    },
    image: {
        width: 400,
        height: 100,
        resizeMode: 'contain',
        marginTop: -50,
    },
    boxText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 10,
    },
    descriptionText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'justify',
        paddingHorizontal: 10,
    },
});

export default MealPage;
