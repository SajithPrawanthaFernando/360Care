import React, { useState, useEffect } from "react";
import { Dimensions } from "react-native";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import Profile from "./Profile";
import Ionicons from "react-native-vector-icons/Ionicons";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const AuthenticatedScreen = ({
  user,
  handleAuthentication,
  fetchedData,
  navigateToProfile,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconButton} onPress={navigateToProfile}>
        <Ionicons name="settings" size={24} color="white" />
      </TouchableOpacity>
      <View style={styles.authContainer}>
        {user ? (
          <>
            <Text style={styles.title}>Welcome {user.name}!</Text>
            {fetchedData && (
              <ScrollView>
                {fetchedData.map((item, index) => (
                  <View key={index} style={styles.card}>
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.cardImage}
                    />
                    <Text style={styles.cardText}>
                      First Name: {item.firstName}
                    </Text>
                    <Text style={styles.cardText}>
                      Last Name: {item.lastName}
                    </Text>
                    <Text style={styles.cardText}>
                      Full Name: {item.fullName}
                    </Text>
                    <Text style={styles.cardText}>Title: {item.title}</Text>
                    <Text style={styles.cardText}>Family: {item.family}</Text>
                  </View>
                ))}
              </ScrollView>
            )}
          </>
        ) : (
          <View style={styles.authContainer}>
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.emailText}>Guest</Text>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleAuthentication}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const CharactersPage = ({ user, handleAuthentication }) => {
  const [fetchedData, setFetchedData] = useState(null);
  const [currentScreen, setCurrentScreen] = useState("characters");

  useEffect(() => {
    fetch("https://thronesapi.com/api/v2/Characters")
      .then((response) => response.json())
      .then((data) => {
        setFetchedData(data);
      })
      .catch((error) => {
        console.error("Error fetching characters:", error);

        Alert.alert("Error", "Failed to fetch characters data.");
      });
  }, []);

  const navigateToProfile = () => {
    setCurrentScreen("profile");
  };

  const navigateBack = () => {
    setCurrentScreen("characters");
  };

  if (currentScreen === "profile") {
    return (
      <Profile
        user={user}
        handleAuthentication={handleAuthentication}
        navigateBack={navigateBack}
      />
    );
  }

  return (
    <AuthenticatedScreen
      user={user}
      handleAuthentication={handleAuthentication}
      fetchedData={fetchedData}
      navigateToProfile={navigateToProfile}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: windowWidth,
    backgroundColor: "#343a40",
    justifyContent: "center",
    alignItems: "center",
  },
  authContainer: {
    width: "70%",
    maxWidth: 400,
    backgroundColor: "#343a40",
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    textAlign: "center",
    marginTop: 70,
    marginBottom: 24,
  },
  emailText: {
    fontSize: 18,
    color: "#adb5bd",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#495057",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#495057",
  },
  cardImage: {
    width: "100%",
    height: 200,
    marginBottom: 8,
    borderRadius: 8,
  },
  cardText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 4,
  },
  iconButton: {
    position: "absolute",
    top: 16,
    right: 15,
    height: 50,
    width: 50,
    backgroundColor: "#495057",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#495057",
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: "center",
    marginBottom: 16,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CharactersPage;
export { AuthenticatedScreen };
