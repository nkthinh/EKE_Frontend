// Route names for the entire app
export const ROUTES = {
  // Onboarding
  SPLASH: "Splash",
  ONBOARDING: "Onboarding",
  ROLE_SELECTION: "RoleSelection",

  // Authentication
  LOGIN: "Login",
  ACCOUNT_REGISTER: "AccountRegister",
  STUDENT_LOGIN: "StudentLogin",
  STUDENT_REGISTER: "StudentRegister",
  TUTOR_LOGIN: "TutorLogin",

  // Tutor Screens
  TUTOR_REGISTER: "TutorRegister",
  TUTOR_SIGNUP: "TutorSignup",
  POLICY_SCREEN: "PolicyScreen",
  TUTOR_PROFILE_STEP1: "TutorProfileStep1",
  TUTOR_PROFILE_STEP2: "TutorProfileStep2",
  TUTOR_PROFILE_STEP3: "TutorProfileStep3",
  TUTOR_HOME: "TutorHome",
  TUTOR_MESSAGE: "TutorMessage",
  RATE_SCREEN: "RateScreen",
  TUTOR_PROFILE: "TutorProfile",
  UPGRADE_SCREEN: "UpgradeScreen",
  NOTIFICATION_SCREEN: "NotificationScreen",
  TUTOR_PROFILE_VIEW: "TutorProfileView",
  TUTOR_WALLET: "TutorWallet",
  TUTOR_DEPOSIT: "TutorDeposit",

  // Student Screens
  STUDENT_HOME: "StudentHome",
  STUDENT_MESSAGE: "StudentMessage",
  STUDENT_DETAIL_MESSAGE: "StudentDetailMessage",
  STUDENT_LECTURER_FEEDBACK: "StudentLecturerFeedback",
  STUDENT_FEEDBACK: "StudentFeedback",
  STUDENT_PACKAGE: "StudentPackage",
  STUDENT_UPDATE_PROFILE: "StudentUpdateProfile",
  STUDENT_DEPOSIT: "StudentDeposit",
  STUDENT_LECTURER_DETAIL: "StudentLecturerDetail",
  STUDENT_PROFILE: "StudentProfile",
  STUDENT_WALLET: "StudentWallet",

  // Shared Screens
  COMPLETE_PROFILE: "CompleteProfile",

  // Match & Swipe Screens
  SWIPE_ACTION: "SwipeAction",
  MATCH_LIST: "MatchList",
  TUTOR_LIKED_STUDENTS: "TutorLikedStudents",

  // Chat Screens
  CHAT_LIST: "ChatList",
  CHAT_DETAIL: "ChatDetail",
  VIDEO_CALL: "VideoCall",

  // Test Screens
  TEST_CONVERSATION_FLOW: "TestConversationFlow",
  TEST_NAVIGATION: "TestNavigation",
  TEST_MATCH_CONVERSATION: "TestMatchConversation",
  TEST_CONVERSATIONS_BY_USER: "TestConversationsByUser",
};

// Route groups for better organization
export const ROUTE_GROUPS = {
  ONBOARDING: [ROUTES.SPLASH, ROUTES.ONBOARDING, ROUTES.ROLE_SELECTION],

  AUTHENTICATION: [
    ROUTES.LOGIN,
    ROUTES.STUDENT_LOGIN,
    ROUTES.STUDENT_REGISTER,
    ROUTES.TUTOR_LOGIN,
  ],

  TUTOR: [
    ROUTES.TUTOR_REGISTER,
    ROUTES.TUTOR_SIGNUP,
    ROUTES.POLICY_SCREEN,
    ROUTES.TUTOR_PROFILE_STEP1,
    ROUTES.TUTOR_PROFILE_STEP2,
    ROUTES.TUTOR_PROFILE_STEP3,
    ROUTES.TUTOR_HOME,
    ROUTES.TUTOR_MESSAGE,
    ROUTES.RATE_SCREEN,
    ROUTES.TUTOR_PROFILE,
    ROUTES.UPGRADE_SCREEN,
    ROUTES.NOTIFICATION_SCREEN,
    ROUTES.TUTOR_PROFILE_VIEW,
    ROUTES.TUTOR_WALLET,
    ROUTES.TUTOR_DEPOSIT,
  ],

  STUDENT: [
    ROUTES.STUDENT_HOME,
    ROUTES.STUDENT_MESSAGE,
    ROUTES.STUDENT_DETAIL_MESSAGE,
    ROUTES.STUDENT_LECTURER_FEEDBACK,
    ROUTES.STUDENT_FEEDBACK,
    ROUTES.STUDENT_PACKAGE,
    ROUTES.STUDENT_UPDATE_PROFILE,
    ROUTES.STUDENT_DEPOSIT,
    ROUTES.STUDENT_LECTURER_DETAIL,
    ROUTES.STUDENT_PROFILE,
    ROUTES.STUDENT_WALLET,
  ],

  SHARED: [ROUTES.COMPLETE_PROFILE],

  CHAT: [ROUTES.CHAT_LIST, ROUTES.CHAT_DETAIL, ROUTES.VIDEO_CALL],
};

// Navigation helper functions
export const navigateTo = (navigation, routeName, params = {}) => {
  navigation.navigate(routeName, params);
};

export const goBack = (navigation) => {
  navigation.goBack();
};

export const resetTo = (navigation, routeName, params = {}) => {
  navigation.reset({
    index: 0,
    routes: [{ name: routeName, params }],
  });
};

export const replace = (navigation, routeName, params = {}) => {
  navigation.replace(routeName, params);
};
