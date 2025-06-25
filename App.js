import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


// Screens
import SplashScreen from './screens/launch/SplashScreen';
import OnboardingScreen from './screens/launch/OnboardingScreen';
import RoleSelectionScreen from './screens/launch/RoleSelectionScreen';

import TutorRegisterScreen from './screens/tutor/TutorRegisterScreen';
import TutorSignupScreen from './screens/tutor/TutorSignupScreen';
import PolicyScreen from './screens/tutor/PolicyScreen';
import TutorProfileStep1 from './screens/tutor/TutorProfileStep1';
import TutorProfileStep2 from './screens/tutor/TutorProfileStep2';
import TutorProfileStep3 from './screens/tutor/TutorProfileStep3';
import TutorHomeScreen from './screens/tutor/TutorHomeScreen';
import RateScreen from './screens/tutor/RateScreen';
import ProfileScreen from './screens/tutor/ProfileScreen';
import UpgradeScreen from './screens/tutor/UpgradeScreen';
import NotificationScreen from './screens/tutor/NotificationScreen';
import TutorProfileView from './screens/tutor/TutorProfileView';
import WalletScreen from './screens/tutor/WalletScreen';

import CompleteProfileScreen from './screens/customer/CompleteProfileScreen';

import ChatListScreen from './screens/match/ChatListScreen';
import ChatDetailScreen from './screens/match/ChatDetailScreen';

import AdminHomeScreen from './screens/admin/AdminHomeScreen';
import AdminPackageScreen from './screens/admin/AdminPackageScreen';
import AdminProfile from './screens/admin/AdminProfile';
import AdminNotificationScreen from './screens/admin/AdminNotificationScreen';
import AdminUserListScreen from './screens/admin/AdminUserListScreen';
import AdminTutorListScreen from './screens/admin/AdminTutorListScreen';


const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>

        {/* Launch */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />

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

        {/* Admin */}
        <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
        <Stack.Screen name="AdminPackageScreen" component={AdminPackageScreen} />
        <Stack.Screen name="AdminProfile" component={AdminProfile} />
        <Stack.Screen name="AdminNotificationScreen" component={AdminNotificationScreen} />
        <Stack.Screen name="AdminUserListScreen" component={AdminUserListScreen} />
        <Stack.Screen name="AdminTutorListScreen" component={AdminTutorListScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
