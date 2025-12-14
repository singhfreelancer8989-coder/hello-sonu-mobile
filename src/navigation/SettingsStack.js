import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SettingsScreen from '../screens/Settings/SettingsScreen';
import AboutUsScreen from '../screens/Settings/About/AboutUsScreen';
import PrivacyPolicyScreen from '../screens/Settings/Privacy/PrivacyPolicyScreen';
import RegisterBrokerScreen from '../screens/Settings/brokerRegister/RegisterBrokerScreen';
import ContactUsScreen from '../screens/Settings/Contact/ContactUsScreen';
import UpdateProfileScreen from '../screens/Settings/Profile/UpdateProfileScreen';
const Stack = createNativeStackNavigator();
const SettingsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="AboutUsScreen" component={AboutUsScreen} />
      <Stack.Screen name="RegisterBrokerScreen" component={RegisterBrokerScreen} />
      <Stack.Screen name="UpdateProfileScreen" component={UpdateProfileScreen} />
      <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />
      <Stack.Screen name="ContactUsScreen" component={ContactUsScreen} />
    </Stack.Navigator>
  )
}

export default SettingsStack

const styles = StyleSheet.create({})