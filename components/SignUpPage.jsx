import React, { useState } from "react";
import {
  Dimensions,
  useWindowDimensions,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
  const [passwordError, setPasswordError] = useState("");
  const [hasLowercase, setHasLowercase] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasMinLength, setHasMinLength] = useState(false);

  const handleSignUp = () => {
    const lowercaseRegex = /^(?=.*[a-z])/;
    const uppercaseRegex = /^(?=.*[A-Z])/;
    const numberRegex = /^(?=.*[0-9])/;
    const lengthRegex = /^(?=.{8,})/;

    let valid = true;

    if (!lowercaseRegex.test(password)) {
      setPasswordError(
        "Password must contain at least one lowercase character"
      );
      setHasLowercase(false);
      valid = false;
    } else {
      setHasLowercase(true);
    }

    if (!uppercaseRegex.test(password)) {
      setPasswordError(
        "Password must contain at least one uppercase character"
      );
      setHasUppercase(false);
      valid = false;
    } else {
      setHasUppercase(true);
    }

    if (!numberRegex.test(password)) {
      setPasswordError("Password must contain at least one number");
      setHasNumber(false);
      valid = false;
    } else {
      setHasNumber(true);
    }

    if (!lengthRegex.test(password)) {
      setPasswordError("Password must be at least 8 characters long");
      setHasMinLength(false);
      valid = false;
    } else {
      setHasMinLength(true);
    }

    if (valid) {
      handleAuthentication();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.authContainer}>
        <Text style={styles.appTitle}>My App</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Name"
          autoCapitalize="none"
          placeholderTextColor="#6c757d"
        />
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email Address"
          autoCapitalize="none"
          placeholderTextColor="#6c757d"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          placeholderTextColor="#6c757d"
        />
        <TextInput
          style={styles.input}
          value={cpassword}
          onChangeText={setcPassword}
          placeholder="Confirm Password"
          secureTextEntry
          placeholderTextColor="#6c757d"
        />
        <View style={styles.passwordCriteria}>
          <View style={styles.criteriaRow}>
            <Ionicons
              name={hasLowercase ? "checkmark-circle" : "close-circle"}
              size={20}
              color={hasLowercase ? "green" : "red"}
            />
            <Text style={[styles.criteriaText, { marginLeft: 10 }]}>
              One lowercase character
            </Text>
          </View>
          <View style={styles.criteriaRow}>
            <Ionicons
              name={hasUppercase ? "checkmark-circle" : "close-circle"}
              size={20}
              color={hasUppercase ? "green" : "red"}
            />
            <Text style={[styles.criteriaText, { marginLeft: 10 }]}>
              One uppercase character
            </Text>
          </View>
          <View style={styles.criteriaRow}>
            <Ionicons
              name={hasNumber ? "checkmark-circle" : "close-circle"}
              size={20}
              color={hasNumber ? "green" : "red"}
            />
            <Text style={[styles.criteriaText, { marginLeft: 10 }]}>
              One number
            </Text>
          </View>
          <View style={styles.criteriaRow}>
            <Ionicons
              name={hasMinLength ? "checkmark-circle" : "close-circle"}
              size={20}
              color={hasMinLength ? "green" : "red"}
            />
            <Text style={[styles.criteriaText, { marginLeft: 10 }]}>
              8 characters minimum
            </Text>
          </View>
        </View>
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}
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
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
    backgroundColor: "#343a40",
    justifyContent: "center",
    alignItems: "center",
  },
  authContainer: {
    width: width * 0.8,
    maxWidth: 400,
    backgroundColor: "#343a40",
    padding: 16,
    justifyContent: "center",
  },
  appTitle: {
    fontSize: 24,
    color: "#fff",
    textAlign: "center",
    marginBottom: 50,
  },
  input: {
    height: 60,
    backgroundColor: "#495057",
    color: "#fff",
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  passwordCriteria: {
    marginBottom: 16,
  },
  criteriaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  criteriaText: {
    color: "#6c757d",
    fontSize: 12,
  },
  signUpButton: {
    height: 50,
    backgroundColor: "#ffc107",
    paddingVertical: 12,
    borderRadius: 10,
    textAlign: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  signUpButtonText: {
    color: "#212529",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  toggleText: {
    color: "#adb5bd",
  },
  signInText: {
    color: "#ffc107",
  },
  errorText: {
    color: "#ff4d4f",
    fontSize: 12,
    marginBottom: 10,
  },
});

export default SignUpPage;
