import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

const WorkoutPlanPage = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Workout Image */}
            <View style={styles.box}>
                <Image
                    source={{ uri: 'https://example.com/workout-image.jpg' }} // Replace with actual workout image URL
                    style={styles.image}
                />
            </View>

            {/* Workout Plan */}
            <View style={styles.planContainer}>
                <Text style={styles.planTitle}>Workout Plan</Text>
                
                {/* Walking Plan */}
                <View style={styles.planItem}>
                    <Text style={styles.planText}>1. Walking</Text>
                    <Text style={styles.planDetails}>30 minutes of brisk walking.</Text>
                </View>
                
                {/* Stretching Plan */}
                <View style={styles.planItem}>
                    <Text style={styles.planText}>2. Stretching</Text>
                    <Text style={styles.planDetails}>15 minutes of full-body stretching.</Text>
                </View>
            </View>
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
    box: {
        width: '90%',
        height: 200,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 20,
    },
    image: {
        width: '80%',
        height: '100%',
        resizeMode: 'contain',
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
    planItem: {
        marginBottom: 15,
    },
    planText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    planDetails: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
});

export default WorkoutPlanPage;
