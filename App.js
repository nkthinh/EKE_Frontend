import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import SplashScreen from './screens/launch/SplashScreen';
import OnboardingScreen from './screens/launch/OnboardingScreen';
import TutorRegisterScreen from './screens/tutor/TutorRegisterScreen';
import TutorSignupScreen from './screens/tutor/TutorSignupScreen';
import PolicyScreen from './screens/tutor/PolicyScreen';
import TutorProfileStep1 from './screens/tutor/TutorProfileStep1';
import TutorProfileStep2 from './screens/tutor/TutorProfileStep2';
import TutorProfileStep3 from './screens/tutor/TutorProfileStep3';
const Stack = createNativeStackNavigator();


function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="TutorRegister" component={TutorRegisterScreen} />
        <Stack.Screen name="TutorSignup" component={TutorSignupScreen} />
        <Stack.Screen name="PolicyScreen" component={PolicyScreen} />
        <Stack.Screen name="TutorProfileStep1" component={TutorProfileStep1} />
        <Stack.Screen name="TutorProfileStep2" component={TutorProfileStep2} />
        <Stack.Screen name="TutorProfileStep3" component={TutorProfileStep3} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;