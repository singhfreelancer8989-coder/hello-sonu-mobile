import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from 'react-native'
import PropertyDetailsScreen from "../screens/Home/PropertDetails";
import SavedScreen from "../screens/Saved/SavedScreen";
import EditPropertyScreen from "../screens/Sales/EditPropertyScreen";
const Stack = createNativeStackNavigator();
const SavedStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SavedScreen" component={SavedScreen} />
      <Stack.Screen name="PropertyDetails" component={PropertyDetailsScreen} />
      <Stack.Screen name="EditProperty" component={EditPropertyScreen} />
    </Stack.Navigator>
  )
}

export default SavedStack

const styles = StyleSheet.create({})