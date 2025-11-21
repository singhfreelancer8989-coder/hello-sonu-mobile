import { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import OnboardingScreen from '../screens/Auth/OnboardingScreen';
import MainTabs from './MainTabs';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  const [isLogin, setIsLogin] = useState(1);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLogin ? (
        // User is logged in - show home screens
        <Stack.Screen name="MainTabs" component={MainTabs} />
      ) : (
        // User is not logged in - show auth screens
        <>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AuthStack;