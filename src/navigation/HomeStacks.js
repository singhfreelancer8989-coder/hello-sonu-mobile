import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePageScreen from '../screens/Home/HomePageScreen';
import PropertyDetailsScreen from '../screens/Home/PropertyDetails';
import PropertyListingScreen from '../screens/Home/PropertyListingScreen';
import EditPropertyScreen from '../screens/Sales/EditPropertyScreen';
import AnalyticsStack from './AnalyticsStack';


const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomePageScreen} />
      <Stack.Screen name="PropertyDetails" component={PropertyDetailsScreen} />
      <Stack.Screen name="PropertyListing" component={PropertyListingScreen} />
      <Stack.Screen name="EditProperty" component={EditPropertyScreen} />
      <Stack.Screen name="AnalyticsStack" component={AnalyticsStack} />
    </Stack.Navigator>
  );
}