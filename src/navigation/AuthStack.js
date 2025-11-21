import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import HomePageScreen from '../screens/Home/HomePageScreen';
import OnboardingScreen from '../screens/Auth/OnboardingScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();


const AuthStack = () => {
    const [isLogin, setIsLogin] = useState(false);
  return (
    <Stack.Navigator>
        {
        isLogin ?
            <Stack.Screen name="Home" component={HomePageScreen} />
        :
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        }
    </Stack.Navigator>
  )
}

export default AuthStack

const styles = StyleSheet.create({})