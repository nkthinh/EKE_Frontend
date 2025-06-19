import {
  NavigationContainer,
  useNavigationState,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, StyleSheet, Image } from "react-native";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import CompleteProfileScreen from "./screens/CompleteProfileScreen";
import {
  OnboardingScreen1,
  OnboardingScreen2A,
  OnboardingScreen2B,
  OnboardingScreen3,
} from "./screens/OnBoardingScreens";
import { useEffect } from "react";
import HomeScreen from "./screens/StudentScreens/HomeScreen";
import TeacherHomeScreen from "./screens/TeacherScreens/TeacherHomeScreen";
import MessageScreen from "./screens/StudentScreens/MessageScreen";
import DetailMessageScreen from "./screens/StudentScreens/DetailMessageScreen";
import LecturerFeedbackScreen from "./screens/StudentScreens/LecturerFeedbackScreen";
import FeedbackScreen from "./screens/StudentScreens/FeedbackScreen";
import ProfileScreen from "./screens/StudentScreens/ProfileScreen";
import PackageScreen from "./screens/StudentScreens/PackageScreen";
import UpdateProfile from "./screens/StudentScreens/UpdateProfile";
import WalletScreen from "./screens/StudentScreens/WalletScreen";

const Stack = createNativeStackNavigator();

const LaunchScreen = ({ navigation }) => {
  const currentRouteName = useNavigationState(
    (state) => state.routes[state.index].name
  );
  useEffect(() => {
    if (currentRouteName === "Launch") {
      const timer = setTimeout(() => {
        navigation.navigate("Onboarding1");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [navigation, currentRouteName]);

  return (
    <View style={styles.launchContainer}>
      <Image source={require("./assets/logo.png")} style={styles.logo} />
    </View>
  );
};

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding3">
        <Stack.Screen
          name="Launch"
          component={LaunchScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Onboarding1"
          component={OnboardingScreen1}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Onboarding2A"
          component={OnboardingScreen2A}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Onboarding2B"
          component={OnboardingScreen2B}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Onboarding3"
          component={OnboardingScreen3}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="StudentHomeScreen"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TeacherHomeScreen"
          component={TeacherHomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StudentMessageScreen"
          component={MessageScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DetailMessageScreen"
          component={DetailMessageScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LecturerFeedbackScreen"
          component={LecturerFeedbackScreen}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="FeedbackScreen"
          component={FeedbackScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PackageScreen"
          component={PackageScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UpdateProfile"
          component={UpdateProfile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="WalletScreen"
          component={WalletScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CompleteProfile"
          component={CompleteProfileScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  launchContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: "contain",
  },
  launchText: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    marginTop: 20,
  },
});

export default App;
