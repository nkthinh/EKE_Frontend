import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


// Screens
import SplashScreen from './screens/launch/SplashScreen';
import RoleSelectionScreen from './screens/launch/RoleSelectionScreen';
import OnboardingScreen from './screens/launch/OnboardingScreen';

import TutorRegisterScreen from './screens/tutor/TutorRegisterScreen';
import TutorSignupScreen from './screens/tutor/TutorSignupScreen';
import PolicyScreen from './screens/tutor/PolicyScreen';
import TutorProfileStep1 from './screens/tutor/TutorProfileStep1';
import TutorProfileStep2 from './screens/tutor/TutorProfileStep2';
import TutorProfileStep3 from './screens/tutor/TutorProfileStep3';
import TutorHomeScreen from './screens/tutor/TutorHomeScreen';
import RateScreen from './screens/tutor/RateScreen';
import ProfileScreen from './screens/tutor/ProfileScreen';
import StudentProfileScreen from './screens/StudentScreens/ProfileScreen';
import UpgradeScreen from './screens/tutor/UpgradeScreen';
import NotificationScreen from './screens/tutor/NotificationScreen';
import TutorProfileView from './screens/tutor/TutorProfileView';
import WalletScreen from './screens/tutor/WalletScreen';
import StudentWalletScreen from './screens/StudentScreens/WalletScreen';

import CompleteProfileScreen from './screens/customer/CompleteProfileScreen';

import ChatListScreen from './screens/match/ChatListScreen';
import ChatDetailScreen from './screens/match/ChatDetailScreen';
import VideoCallScreen from './screens/match/VideoCallScreen';
import HomeScreen from './screens/StudentScreens/HomeScreen';
import MessageScreen from './screens/StudentScreens/MessageScreen';
import DetailMessageScreen from './screens/StudentScreens/DetailMessageScreen';
import LecturerFeedbackScreen from './screens/StudentScreens/LecturerFeedbackScreen';
import FeedbackScreen from './screens/StudentScreens/FeedbackScreen';
import PackageScreen from './screens/StudentScreens/PackageScreen';
import UpdateProfile from './screens/StudentScreens/UpdateProfile';
import DepositScreen from './screens/StudentScreens/DepositScreen';
import LecturerDetailScreen from './screens/StudentScreens/LecturerDetailScreen';
import LoginScreen from './screens/LoginScreen';
import StudentLoginScreen from './screens/StudentScreens/StudentLoginScreen';
import StudentRegisterScreen from './screens/StudentScreens/StudentRegisterScreen';
import TutorLoginScreen from './screens/tutor/TutorLoginScreen';




const Stack = createNativeStackNavigator();

export default function App() {


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        
        {/* Authentication */}
        <Stack.Screen name="StudentLogin" component={StudentLoginScreen} />
        <Stack.Screen name="StudentRegister" component={StudentRegisterScreen} />
        <Stack.Screen name="TutorLogin" component={TutorLoginScreen} />

        {/* Tutor */}
        <Stack.Screen name="TutorRegister" component={TutorRegisterScreen} />
        <Stack.Screen name="TutorSignup" component={TutorSignupScreen} />
        <Stack.Screen name="PolicyScreen" component={PolicyScreen} />
        <Stack.Screen name="TutorProfileStep1" component={TutorProfileStep1} />
        <Stack.Screen name="TutorProfileStep2" component={TutorProfileStep2} />
        <Stack.Screen name="TutorProfileStep3" component={TutorProfileStep3} />
        <Stack.Screen name="TutorHome" component={TutorHomeScreen} />
        <Stack.Screen name="RateScreen" component={RateScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="UpgradeScreen" component={UpgradeScreen} />
        <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
        <Stack.Screen name="TutorProfileView" component={TutorProfileView} />
        <Stack.Screen name="WalletScreen" component={WalletScreen} />

        {/* Customer */}
        <Stack.Screen name="CustomerProfile" component={CompleteProfileScreen} />

        {/* Chat */}
        <Stack.Screen name="ChatListScreen" component={ChatListScreen} />
        <Stack.Screen name="ChatDetailScreen" component={ChatDetailScreen} />
        <Stack.Screen name="VideoCall" component={VideoCallScreen} />

        {/* Student */}
        <Stack.Screen
          name="StudentHomeScreen"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StudentMessageScreen"
          component={MessageScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StudentDetailMessageScreen"
          component={DetailMessageScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StudentLecturerFeedbackScreen"
          component={LecturerFeedbackScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StudentFeedbackScreen"
          component={FeedbackScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StudentProfileScreen"
          component={StudentProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StudentPackageScreen"
          component={PackageScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StudentUpdateProfile"
          component={UpdateProfile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StudentWalletScreen"
          component={StudentWalletScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StudentDepositScreen"
          component={DepositScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LecturerDetailScreen"
          component={LecturerDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={TutorRegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CompleteProfile"
          component={CompleteProfileScreen}
          options={{ headerShown: false }}
        />


      </Stack.Navigator>
    </NavigationContainer >
  );
}
