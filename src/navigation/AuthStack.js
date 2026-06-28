import { cloneElement } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import useAuth from '../hooks/useAuth';


import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import OnboardingScreen from '../screens/Auth/OnboardingScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import SplashScreen from '../screens/SplashScreen';
import MainTabs from './MainTabs';
import LocationPickerScreen from '../screens/Sales/LocationPickerScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  const { userToken, isSplashLoading } = useAuth();

  if (isSplashLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userToken ? (
        // User is logged in - show home screens
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="LocationPickerScreen" component={LocationPickerScreen} />
        </>
      ) : (
        // User is not logged in - show auth screens
        <>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AuthStack;