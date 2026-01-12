import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SettingsScreen from '../screens/Settings/SettingsScreen';
import AboutUsScreen from '../screens/Settings/About/AboutUsScreen';
import PrivacyPolicyScreen from '../screens/Settings/Privacy/PrivacyPolicyScreen';
import UpdateProfileScreen from '../screens/Settings/Profile/UpdateProfileScreen';
import RegisterBrokerScreen from '../screens/Settings/brokerRegister/RegisterBrokerScreen';
import ContactUsScreen from '../screens/Settings/Contact/ContactUsScreen';
import AnalyticsStack from './AnalyticsStack';
import MyPropertiesScreen from '../screens/Home/MyPropertiesScreen';
import PropertDetails from '../screens/Home/PropertDetails';
import DeletedUserPropertiesScreen from '../screens/Settings/DeletedUserPropertiesScreen';
import EditPropertyScreen from '../screens/Sales/EditPropertyScreen';


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
      <Stack.Screen name="AnalyticsStack" component={AnalyticsStack} />
      <Stack.Screen name="MyPropertiesScreen" component={MyPropertiesScreen} />
      <Stack.Screen name="DeletedUserPropertiesScreen" component={DeletedUserPropertiesScreen} />
      <Stack.Screen name="EditProperty" component={EditPropertyScreen} />
      <Stack.Screen name="PropertyDetails" component={PropertDetails} />

    </Stack.Navigator>
  )
}

export default SettingsStack