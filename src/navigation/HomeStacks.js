import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePageScreen from '../screens/Home/HomePageScreen';
import PropertyDetailsScreen from '../screens/Home/PropertDetails';
import PropertyListingScreen from '../screens/Home/PropertyListingScreen';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomePageScreen} />
      <Stack.Screen name="PropertyDetails" component={PropertyDetailsScreen} />
      <Stack.Screen name="PropertyListing" component={PropertyListingScreen} />
    </Stack.Navigator>
  );
}