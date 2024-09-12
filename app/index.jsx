import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../components/HomeScreen";
import SplashScreen from "../components/SplashSreen";
import OnboardingScreen1 from "../components/OnboardingScreen1";
import OnboardingScreen2 from "../components/OnboardingScreen2";
import OnboardingScreen3 from "../components/OnboardingScreen3";
import GetStarted from "../components/GetStarted";
import SignUpPage from "../components/SignUpPage";
import LoginPage from "../components/LoginPage";
import Diet from "../components/DietPlanning/Diet";
import Doctor from "../components/DoctorScheduling/Doctor";
import Sleep from "../components/SleepTracking/Sleep";
import DailyTips from "../components/Tipsmanaging/DailyTips";
import Profile from "../components/Profile";
import Ionicons from "react-native-vector-icons/Ionicons";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Tabbar() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case "Diet":
              iconName = focused ? "nutrition" : "nutrition-outline";
              break;
            case "DailyTips":
              iconName = focused ? "list-circle" : "list-circle-outline";
              break;
            case "Doctor":
              iconName = focused ? "medkit" : "medkit-outline";
              break;
            case "Sleep":
              iconName = focused ? "bed" : "bed-outline";
              break;
            case "Profile":
              iconName = focused ? "person" : "person-outline";
              break;
            default:
              iconName = "help-circle";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Diet"
        component={Diet}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="DailyTips"
        component={DailyTips}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Doctor"
        component={Doctor}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Sleep"
        component={Sleep}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Onboarding1"
        component={OnboardingScreen1}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Onboarding2"
        component={OnboardingScreen2}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Onboarding3"
        component={OnboardingScreen3}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GetStarted"
        component={GetStarted}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="signup"
        component={SignUpPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="login"
        component={LoginPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Tab"
        component={Tabbar}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default App;
