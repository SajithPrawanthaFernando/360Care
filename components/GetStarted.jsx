import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import logotrans from "../assets/images/logotrans.png";
import { useNavigation } from "expo-router";

const GetStarted = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Image source={logotrans} style={styles.logo} />
      <Text style={styles.title}>360care</Text>
      <Text style={styles.subtitle}>Let’s get started!</Text>
      <Text style={styles.description}>Login to Stay healthy and fit</Text>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate("login")}
      >
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signUpButton}
        onPress={() => navigation.navigate("signup")}
      >
        <Text style={styles.signUpButtonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 110,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1434A4",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: "#7d7d7d",
    marginBottom: 40,
  },
  loginButton: {
    width: "80%",
    backgroundColor: "#4285F4",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 15,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  signUpButton: {
    width: "80%",
    borderColor: "#4285F4",
    borderWidth: 2,
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  signUpButtonText: {
    color: "#4285F4",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default GetStarted;
