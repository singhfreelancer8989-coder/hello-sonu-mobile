import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SettingsScreen from '../screens/Settings/SettingsScreen';
import AboutUsScreen from '../screens/Settings/About/AboutUsScreen';
const Stack = createNativeStackNavigator();
const SettingsStack = () => {
  return (
  <Stack.Navigator screenOptions={{headerShown:false}}>
    <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
    <Stack.Screen name="AboutUsScreen" component={AboutUsScreen} />
  </Stack.Navigator>
  )
}

export default SettingsStack

const styles = StyleSheet.create({})