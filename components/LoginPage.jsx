import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const LoginPage = ({
  email,
  setEmail,
  password,
  setPassword,
  handleAuthentication,
  setCurrentPage,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState("");

  // useEffect(() => {
  //   if (Voice) {
  //     Voice.onSpeechStart = onSpeechStartHandler;
  //     Voice.onSpeechEnd = onSpeechEndHandler;
  //     Voice.onSpeechResults = onSpeechResultsHandler;
  //     return () => {
  //       Voice.removeAllListeners();
  //     };
  //   } else {
  //     console.warn("Voice module is not available.");
  //   }
  // }, []);

  // const onSpeechStartHandler = (e) => {
  //   console.log("Speech started");
  // };

  // const onSpeechEndHandler = (e) => {
  //   console.log("Speech ended");
  // };

  // const onSpeechResultsHandler = (e) => {
  //   console.log("Speech results:", e.value);
  //   setVoiceText(e.value[0]);
  // };

  // const startListening = async () => {
  //   try {
  //     await Voice.start("en-US");
  //     setIsListening(true);
  //   } catch (e) {
  //     console.error("Error starting voice recognition:", e);
  //   }
  // };

  // const stopListening = async () => {
  //   try {
  //     await Voice.stop();
  //     setIsListening(false);
  //   } catch (e) {
  //     console.error("Error stopping voice recognition:", e);
  //   }
  // };

  return (
    <View style={styles.container}>
      <View style={styles.authContainer}>
        <Text style={styles.appTitle}>My App</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
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
        <TouchableOpacity
          onPress={() => console.log("Forgot Password Pressed")}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password ?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.signInButton}
          onPress={handleAuthentication}
        >
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>
        <View style={styles.bottomContainer}>
          <TouchableOpacity onPress={() => setCurrentPage("signup")}>
            <Text style={styles.toggleText}>
              Don't have an account?{" "}
              <Text style={styles.signUpText}>Sign Up</Text>
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
    flex: 1,
    width: "90%",
    backgroundColor: "#343a40",
    padding: 16,
    borderRadius: 8,
    justifyContent: "center",
  },
  appTitle: {
    fontSize: 24,
    color: "#fff",
    textAlign: "center",
    marginBottom: 120,
  },
  input: {
    height: 60,
    backgroundColor: "#495057",
    color: "#fff",
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  forgotPasswordText: {
    color: "#adb5bd",
    textAlign: "right",
    marginBottom: 16,
  },
  signInButton: {
    height: 50,
    backgroundColor: "#ffc107",
    paddingVertical: 12,
    borderRadius: 10,
    textAlign: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  signInButtonText: {
    color: "#212529",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomContainer: {
    marginTop: 200,
    alignItems: "center",
  },
  toggleText: {
    color: "#adb5bd",
  },
  signUpText: {
    color: "#ffc107",
  },
});

export default LoginPage;
