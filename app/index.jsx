import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { Alert } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

// Import Firebase configurations
import { auth, db } from "../hooks/firebaseConfig";

import SplashScreen from "../components/SplashSreen";
import OnboardingScreen1 from "../components/OnboardingScreen1";
import OnboardingScreen2 from "../components/OnboardingScreen2";
import OnboardingScreen3 from "../components/OnboardingScreen3";
import GetStarted from "../components/GetStarted";
import SignUpPage from "../components/SignUpPage";
import LoginPage from "../components/LoginPage";
import Diet from "../components/DietPlanning/Diet";
import Sleep from "../components/SleepTracking/Sleep";
import DailyTips from "../components/Tipsmanaging/DailyTips";
import Profile from "../components/Profile";
import FocusGoalsScreen from "../components/Tipsmanaging/FocusGoalsScreen";
import ProgressScreen from "../components/Tipsmanaging/ProgressScreen";
import MilestonesScreen from "../components/Tipsmanaging/MilestonesScreen";
import AdminHome from "../components/Admin/AdminHome";
import AddTips from "../components/Admin/AddTips";

import DoctorHome from "../components/Admin/DoctorHome";
import AddDoctor from "../components/Admin/AddDoctor";
import DetailDoctor from "../components/Admin/DetailDoctor";
import DoctorList from "../components/Admin/DoctorList";
import UpdateDoctor from "../components/Admin/UpdateDoctor";

import Doctor from "../components/DoctorScheduling/TopDoctors";
import DoctorDetail from "../components/DoctorScheduling/DoctorDetail";
import DoctorRating from "../components/DoctorScheduling/DoctorRating";
import SortByCharges from "../components/DoctorScheduling/SortByCharges";
import SortByLocation from "../components/DoctorScheduling/SortByLocation";
import SortByPopularity from "../components/DoctorScheduling/SortByPopularity";

import SelectedMeals from "../components/DietPlanning/SelectedMeals";
import MealSummary from "../components/DietPlanning/MealSummary";
import MealSelection from "../components/DietPlanning/MealSelection";
import BreakPlanPage from "../components/DietPlanning/BreakPlanPage";
import Crud from "../components/DietPlanning/crud";
import WorkoutPlanPage from "../components/DietPlanning/WorkoutPlanPage";
import MealPage from "../components/DietPlanning/MealPage";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Tstack = createNativeStackNavigator();
const AdminTab = createBottomTabNavigator();
const Dstack = createNativeStackNavigator();

function Dietst({ user }) {
  return (
    <Tstack.Navigator initialRouteName="Diet">
      <Tstack.Screen
        name="Diet"
        component={Diet}
        options={{ headerShown: false }}
        initialParams={{ user }}
      />
      <Tstack.Screen
        name="SelectedMeals"
        component={SelectedMeals}
        options={{ headerShown: false }}
      />
       <Tstack.Screen
        name="MealSummary"
        component={MealSummary}
        options={{ headerShown: false }}
      />
       <Tstack.Screen
        name="MealSelection"
        component={MealSelection}
        options={{ headerShown: false }}
      />
      <Tstack.Screen
        name="BreakPlanPage"
        component={BreakPlanPage}
        options={{ headerShown: false }}
      />
       <Tstack.Screen
        name="Crud"
        component={Crud}
        options={{ headerShown: false }}
      />
      <Tstack.Screen
        name="WorkoutPlanPage"
        component={WorkoutPlanPage}
        options={{ headerShown: false }}
      />
       <Tstack.Screen
      name="MealPage"
      component={MealPage}
      options={{ headerShown: false }}
    />
      
      

    </Tstack.Navigator>
  );
}

function Doctors({ user }) {
  return (
    <Dstack.Navigator initialRouteName="Doctor">
      <Dstack.Screen
        name="Doctor"
        component={Doctor}
        options={{ headerShown: false }}
        initialParams={{ user }}
      />
      <Dstack.Screen
        name="DoctorDetail"
        component={DoctorDetail}
        options={{ headerShown: false }}
        initialParams={{ user }}
      />
      <Dstack.Screen
        name="DoctorRating"
        component={DoctorRating}
        options={{ headerShown: false }}
        initialParams={{ user }}
      />
      <Dstack.Screen
        name="SortByCharges"
        component={SortByCharges}
        options={{ headerShown: false }}
        initialParams={{ user }}
      />
      <Dstack.Screen
        name="SortByLocation"
        component={SortByLocation}
        options={{ headerShown: false }}
        initialParams={{ user }}
      />
      <Dstack.Screen
        name="SortByPopularity"
        component={SortByPopularity}
        options={{ headerShown: false }}
        initialParams={{ user }}
      />
    </Dstack.Navigator>
  );
}

function TipStack({ user }) {
  return (
    <Tstack.Navigator initialRouteName="Tips">
      <Tstack.Screen
        name="Tips"
        component={DailyTips}
        options={{ headerShown: false }}
        initialParams={{ user }}
      />
      <Tstack.Screen
        name="FocusGoalsScreen"
        component={FocusGoalsScreen}
        options={{ headerShown: false }}
        initialParams={{ user }}
      />
      <Tstack.Screen
        name="ProgressScreen"
        component={ProgressScreen}
        options={{ headerShown: false }}
        initialParams={{ user }}
      />
      <Tstack.Screen
        name="MilestonesScreen"
        component={MilestonesScreen}
        options={{ headerShown: false }}
        initialParams={{ user }}
      />
    </Tstack.Navigator>
  );
}

function AdminTabbar({ user }) {
  return (
    <AdminTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case "AdminHome":
              iconName = focused ? "shield" : "shield-outline";
              break;
            case "DoctorHome":
              iconName = focused ? "medkit" : "medkit-outline";
              break;

            default:
              iconName = "help-circle";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007bff",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <AdminTab.Screen
        name="AdminHome"
        component={AdminHome}
        options={{ headerShown: false }}
        initialParams={{ user }}
      />
      <AdminTab.Screen
        name="DoctorHome"
        component={DoctorHome}
        options={{ headerShown: false }}
        initialParams={{ user }}
      />
    </AdminTab.Navigator>
  );
}

function Tabbar({ user, handleAuthentication }) {
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
            case "Doctors":
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
        tabBarActiveTintColor: "#007bff",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Diet"
        component={Diet}
        options={{ headerShown: false }}
        initialParams={{ user }}
      />
      <Tab.Screen
        name="DailyTips"
        component={TipStack}
        options={{ headerShown: false }}
        initialParams={{ user }}
      />
      <Tab.Screen
        name="Doctors"
        component={Doctors}
        options={{ headerShown: false }}
        initialParams={{ user }}
      />
      <Tab.Screen
        name="Sleep"
        component={Sleep}
        options={{ headerShown: false }}
        initialParams={{ user }}
      />
      <Tab.Screen name="Profile" options={{ headerShown: false }}>
        {(props) => (
          <Profile
            {...props}
            user={user}
            handleAuthentication={handleAuthentication}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [cpassword, setcPassword] = useState("");
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await fetchUserData(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid) => {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      setUserData(userData);
    }
  };

  const handleAuthentication = async (navigation, currentPage) => {
    try {
      const currentUser = auth.currentUser;

      if (currentUser) {
        navigation.navigate("Tab");
      } else {
        if (currentPage === "login") {
          await signInWithEmailAndPassword(auth, email, password);

          if (email == "admin@gmail.com" && password == "Qw12345@") {
            console.log("Admin signed in successfully!");
            navigation.navigate("AdminTabbar");
            setEmail("");
            setPassword("");
          } else {
            console.log("User signed in successfully!");
            navigation.navigate("Tab");
            setEmail("");
            setPassword("");
          }
        } else if (currentPage === "signup") {
          if (password === cpassword) {
            const userCredential = await createUserWithEmailAndPassword(
              auth,
              email,
              password
            );
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
              name: name,
              email: email,
            });

            console.log("User created successfully!");
            setName("");
            setEmail("");
            setPassword("");
            setcPassword("");
            navigation.navigate("login");
          } else {
            Alert.alert("Error", "Passwords do not match.");
          }
        }
      }
    } catch (error) {
      console.error("Authentication error:", error.message);
      Alert.alert("Authentication Error", error.message);
    }
  };

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
      <Stack.Screen name="signup" options={{ headerShown: false }}>
        {(props) => (
          <SignUpPage
            {...props}
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            cpassword={cpassword}
            setcPassword={setcPassword}
            handleAuthentication={handleAuthentication}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="login" options={{ headerShown: false }}>
        {(props) => (
          <LoginPage
            {...props}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleAuthentication={handleAuthentication}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="Tab"
        component={Tabbar}
        options={{ headerShown: false }}
        initialParams={{ user }}
      />
      <Stack.Screen
        name="AdminTabbar"
        component={AdminTabbar}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AddAdminTips"
        component={AddTips}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddDoctor"
        component={AddDoctor}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DetailDoctor"
        component={DetailDoctor}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DoctorList"
        component={DoctorList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UpdateDoctor"
        component={UpdateDoctor}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default App;