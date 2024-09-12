import React, { useState } from "react";
import {
  Dimensions,
  useWindowDimensions,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import logotrans from "../assets/images/logotrans.png";
import { useNavigation } from "@react-navigation/native";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const SignUpPage = ({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  cpassword,
  setcPassword,
  handleAuthentication,
  setCurrentPage,
}) => {
  const navigation = useNavigation();
  const handleSignUp = () => {
    if (typeof handleAuthentication === "function") {
      handleAuthentication();
      navigation.navigate("Tab");
    } else {
      console.error("handleAuthentication is not a function");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={logotrans} style={styles.logo} />
      <Text style={styles.appTitle}>360care</Text>
      <Text style={styles.subtitle}>Let’s get started!</Text>
      <Text style={styles.description}>Sign Up to Stay healthy and fit</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your username"
          autoCapitalize="none"
          placeholderTextColor="#6c757d"
        />
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          autoCapitalize="none"
          placeholderTextColor="#6c757d"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          placeholderTextColor="#6c757d"
        />
        <TextInput
          style={styles.input}
          value={cpassword}
          onChangeText={setcPassword}
          placeholder="Confirm your password"
          secureTextEntry
          placeholderTextColor="#6c757d"
        />
      </View>

      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.signUpButtonText}>Sign Up</Text>
      </TouchableOpacity>

      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={() => setCurrentPage("login")}>
          <Text style={styles.toggleText}>
            Already have an account?{" "}
            <Text style={styles.signInText}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
    backgroundColor: "#fff", // White background
    justifyContent: "center",
    alignItems: "center",
    padding: 23,
  },
  logo: {
    width: 110,
    height: 100,
    marginBottom: 20,
  },

  appTitle: {
    fontSize: 30,
    color: "#1434A4", // Blue color
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
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
  inputContainer: {
    width: "100%",
  },
  input: {
    height: 50,
    color: "#000",
    paddingHorizontal: 15,
    borderRadius: 25,
    marginBottom: 15,
    borderColor: "#4285F4",
    borderWidth: 1,
  },
  signUpButton: {
    width: "100%",
    backgroundColor: "#4285F4",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
  },
  signUpButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  bottomContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  toggleText: {
    color: "#6c757d", // Grey color
  },
  signInText: {
    color: "#4285F4", // Blue for the sign-in text
  },
});

export default SignUpPage;
