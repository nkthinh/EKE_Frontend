import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ROUTES } from "./routes";

// Onboarding Screens
import SplashScreen from "../screens/onboarding/SplashScreen";
import RoleSelectionScreen from "../screens/onboarding/RoleSelectionScreen";
import OnboardingScreen from "../screens/onboarding/OnboardingScreen";

// Authentication Screens
import LoginScreen from "../screens/auth/LoginScreen";
import AccountRegisterScreen from "../screens/auth/AccountRegisterScreen";
import StudentLoginScreen from "../screens/student/StudentLoginScreen";
import StudentRegisterScreen from "../screens/student/StudentRegisterScreen";
import TutorLoginScreen from "../screens/tutor/TutorLoginScreen";

// Tutor Screens
import TutorRegisterScreen from "../screens/tutor/TutorRegisterScreen";
import TutorSignupScreen from "../screens/tutor/TutorSignupScreen";
import PolicyScreen from "../screens/tutor/PolicyScreen";
import TutorProfileStep1 from "../screens/tutor/TutorProfileStep1";
import TutorProfileStep2 from "../screens/tutor/TutorProfileStep2";
import TutorProfileStep3 from "../screens/tutor/TutorProfileStep3";
import TutorHomeScreen from "../screens/tutor/TutorHomeScreen";
import TutorMessageScreen from "../screens/tutor/TutorMessageScreen";
import RateScreen from "../screens/tutor/RateScreen";
import ProfileScreen from "../screens/tutor/ProfileScreen";
import UpgradeScreen from "../screens/tutor/UpgradeScreen";
import NotificationScreen from "../screens/tutor/NotificationScreen";
import TutorProfileView from "../screens/tutor/TutorProfileView";
import WalletScreen from "../screens/tutor/WalletScreen";

// Student Screens
import HomeScreen from "../screens/student/HomeScreen";
import MessageScreen from "../screens/student/MessageScreen";
import DetailMessageScreen from "../screens/student/DetailMessageScreen";
import LecturerFeedbackScreen from "../screens/student/LecturerFeedbackScreen";
import FeedbackScreen from "../screens/student/FeedbackScreen";
import PackageScreen from "../screens/student/PackageScreen";
import UpdateProfile from "../screens/student/UpdateProfile";
import DepositScreen from "../screens/student/DepositScreen";
import LecturerDetailScreen from "../screens/student/LecturerDetailScreen";
import StudentProfileScreen from "../screens/student/ProfileScreen";
import StudentWalletScreen from "../screens/student/WalletScreen";

// Shared Screens
import CompleteProfileScreen from "../screens/shared/CompleteProfileScreen";
import DebugScreen from "../screens/shared/DebugScreen";

// Match & Swipe Screens
import SwipeActionScreen from "../screens/shared/SwipeActionScreen";
import MatchListScreen from "../screens/shared/MatchListScreen";
import TutorLikedStudentsScreen from "../screens/tutor/TutorLikedStudentsScreen";

// Chat Screens
import ChatListScreen from "../screens/chat/ChatListScreen";
import ChatDetailScreen from "../screens/chat/ChatDetailScreen";
import VideoCallScreen from "../screens/chat/VideoCallScreen";

// Test Screens
import TestConversationFlow from "../examples/TestConversationFlow";
import TestNavigation from "../examples/TestNavigation";
import TestMatchConversation from "../examples/TestMatchConversation";
import TestConversationsByUser from "../examples/TestConversationsByUser";

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.SPLASH}
      screenOptions={{ headerShown: false }}
    >
      {/* Onboarding Flow */}
      <Stack.Screen name={ROUTES.SPLASH} component={SplashScreen} />
      <Stack.Screen name={ROUTES.ONBOARDING} component={OnboardingScreen} />
      <Stack.Screen
        name={ROUTES.ROLE_SELECTION}
        component={RoleSelectionScreen}
      />

      {/* Authentication */}
      <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
      <Stack.Screen
        name={ROUTES.ACCOUNT_REGISTER}
        component={AccountRegisterScreen}
      />
      <Stack.Screen
        name={ROUTES.STUDENT_LOGIN}
        component={StudentLoginScreen}
      />
      <Stack.Screen
        name={ROUTES.STUDENT_REGISTER}
        component={StudentRegisterScreen}
      />
      <Stack.Screen name={ROUTES.TUTOR_LOGIN} component={TutorLoginScreen} />

      {/* Tutor Screens */}
      <Stack.Screen
        name={ROUTES.TUTOR_REGISTER}
        component={TutorRegisterScreen}
      />
      <Stack.Screen name={ROUTES.TUTOR_SIGNUP} component={TutorSignupScreen} />
      <Stack.Screen name={ROUTES.POLICY_SCREEN} component={PolicyScreen} />
      <Stack.Screen
        name={ROUTES.TUTOR_PROFILE_STEP1}
        component={TutorProfileStep1}
      />
      <Stack.Screen
        name={ROUTES.TUTOR_PROFILE_STEP2}
        component={TutorProfileStep2}
      />
      <Stack.Screen
        name={ROUTES.TUTOR_PROFILE_STEP3}
        component={TutorProfileStep3}
      />
      <Stack.Screen name={ROUTES.TUTOR_HOME} component={TutorHomeScreen} />
      <Stack.Screen
        name={ROUTES.TUTOR_MESSAGE}
        component={TutorMessageScreen}
      />
      <Stack.Screen name={ROUTES.RATE_SCREEN} component={RateScreen} />
      <Stack.Screen name={ROUTES.TUTOR_PROFILE} component={ProfileScreen} />
      <Stack.Screen name={ROUTES.UPGRADE_SCREEN} component={UpgradeScreen} />
      <Stack.Screen
        name={ROUTES.NOTIFICATION_SCREEN}
        component={NotificationScreen}
      />
      <Stack.Screen
        name={ROUTES.TUTOR_PROFILE_VIEW}
        component={TutorProfileView}
      />
      <Stack.Screen name={ROUTES.TUTOR_WALLET} component={WalletScreen} />

      {/* Student Screens */}
      <Stack.Screen name={ROUTES.STUDENT_HOME} component={HomeScreen} />
      <Stack.Screen name={ROUTES.STUDENT_MESSAGE} component={MessageScreen} />
      <Stack.Screen
        name={ROUTES.STUDENT_DETAIL_MESSAGE}
        component={DetailMessageScreen}
      />
      <Stack.Screen
        name={ROUTES.STUDENT_LECTURER_FEEDBACK}
        component={LecturerFeedbackScreen}
      />
      <Stack.Screen name={ROUTES.STUDENT_FEEDBACK} component={FeedbackScreen} />
      <Stack.Screen name={ROUTES.STUDENT_PACKAGE} component={PackageScreen} />
      <Stack.Screen
        name={ROUTES.STUDENT_UPDATE_PROFILE}
        component={UpdateProfile}
      />
      <Stack.Screen name={ROUTES.STUDENT_DEPOSIT} component={DepositScreen} />
      <Stack.Screen
        name={ROUTES.STUDENT_LECTURER_DETAIL}
        component={LecturerDetailScreen}
      />
      <Stack.Screen
        name={ROUTES.STUDENT_PROFILE}
        component={StudentProfileScreen}
      />
      <Stack.Screen
        name={ROUTES.STUDENT_WALLET}
        component={StudentWalletScreen}
      />

      {/* Shared Screens */}
      <Stack.Screen
        name={ROUTES.COMPLETE_PROFILE}
        component={CompleteProfileScreen}
      />
      <Stack.Screen name="Debug" component={DebugScreen} />

      {/* Match & Swipe Screens */}
      <Stack.Screen name={ROUTES.SWIPE_ACTION} component={SwipeActionScreen} />
      <Stack.Screen name={ROUTES.MATCH_LIST} component={MatchListScreen} />
      <Stack.Screen
        name={ROUTES.TUTOR_LIKED_STUDENTS}
        component={TutorLikedStudentsScreen}
      />

      {/* Chat Screens */}
      <Stack.Screen name={ROUTES.CHAT_LIST} component={ChatListScreen} />
      <Stack.Screen name={ROUTES.CHAT_DETAIL} component={ChatDetailScreen} />
      <Stack.Screen name={ROUTES.VIDEO_CALL} component={VideoCallScreen} />

      {/* Test Screens */}
      <Stack.Screen
        name={ROUTES.TEST_CONVERSATION_FLOW}
        component={TestConversationFlow}
      />
      <Stack.Screen name={ROUTES.TEST_NAVIGATION} component={TestNavigation} />
      <Stack.Screen
        name={ROUTES.TEST_MATCH_CONVERSATION}
        component={TestMatchConversation}
      />
      <Stack.Screen
        name={ROUTES.TEST_CONVERSATIONS_BY_USER}
        component={TestConversationsByUser}
      />
    </Stack.Navigator>
  );
};
