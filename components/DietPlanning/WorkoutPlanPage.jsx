import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import w from "../../assets/images/w.png";
import r from "../../assets/images/r.png";
const WorkoutPlanPage = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>

            {/* Workout Plan Title */}
          
                <Text style={styles.planTitle}>Workout Plan</Text>

                {/* Walking Plan */}
                <TouchableOpacity style={styles.box}>
                    
                        <Image source={w} style={styles.image} />
                   
                    <Text style={styles.boxText}>1. Walking</Text>
                    <Text style={styles.descriptionText}>
    A 30-minute brisk walk is an effective cardio exercise that helps improve cardiovascular fitness, 
    strengthens muscles, and burns calories. 
    
</Text>

                </TouchableOpacity>

                {/* Stretching Plan */}
                <TouchableOpacity style={styles.box}>
                    
                        <Image source={r} style={styles.image} />
                    
                    <Text style={styles.boxText}>2. Stretching</Text>
                    <Text style={styles.descriptionText}>
    A 15-minute full-body stretching routine helps improve flexibility, reduce muscle tension, and increase 
    blood flow to your muscles. 
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
    planContainer: {
        width: '90%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
        elevation: 5,
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
        width: '90%',
        height: '120%',
        resizeMode: 'contain',
        marginTop: -100,
    },
    boxText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: -60,
    },
    descriptionText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'justify',
        paddingHorizontal: 10,
    },
});

export default WorkoutPlanPage;
