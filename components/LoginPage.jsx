import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Image,
} from "react-native";
import logotrans from "../assets/images/logotrans.png";
import { useNavigation } from "@react-navigation/native";

const LoginPage = ({
  email,
  setEmail,
  password,
  setPassword,
  handleAuthentication,
  setCurrentPage,
}) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const navigation = useNavigation();

  // State to handle error messages
  const [error, setError] = useState("");

  const validateInput = () => {
    if (!email || !password) {
      setError("Both fields are required.");
      return false;
    }
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    // Password validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    setError("");
    return true;
  };

  const handleLogin = async () => {
    if (!validateInput()) return;

    if (typeof handleAuthentication === "function") {
      await handleAuthentication(navigation, "login"); // Pass current page as 'login'
    } else {
      console.error("handleAuthentication is not a function");
    }
  };

  return (
    <View
      style={[styles.container, { width: windowWidth, height: windowHeight }]}
    >
      <Image source={logotrans} style={styles.logo} />
      <Text style={styles.logoText}>360care</Text>
      <Text style={styles.subtitle}>Let’s get started!</Text>
      <Text style={styles.description}>Login to Stay healthy and fit</Text>

      {/* Display error message if any */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          autoCapitalize="none"
          placeholderTextColor="#9ca3af"
        />
        <Text style={styles.inputLabel}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          placeholderTextColor="#9ca3af"
        />
      </View>

      <TouchableOpacity onPress={() => console.log("Forgot Password Pressed")}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("signup")}>
          <Text style={styles.toggleText}>
            Don't have an account?{" "}
            <Text style={styles.signUpText}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 23,
  },
  logo: {
    width: 110,
    height: 100,
    marginBottom: 20,
  },
  logoText: {
    fontSize: 36,
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
  inputContainer: {
    width: "100%",
  },
  inputLabel: {
    fontSize: 16,
    color: "#000",
    marginBottom: 5,
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
  forgotPasswordText: {
    color: "#4285F4",
    textAlign: "right",
    width: "100%",
    marginBottom: 20,
    fontWeight: "bold",
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#4285F4",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  bottomContainer: {
    marginTop: 20,
  },
  toggleText: {
    color: "#adb5bd",
  },
  signUpText: {
    color: "#4285F4",
  },
  errorText: {
    color: "red",
    marginBottom: 20,
  },
});

export default LoginPage;
