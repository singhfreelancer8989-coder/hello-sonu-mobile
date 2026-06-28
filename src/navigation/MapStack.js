import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapScreen from '../screens/Settings/Map/MapScreen';
import PropertyDetailsScreen from '../screens/Home/PropertyDetails';
import EditPropertyScreen from '../screens/Sales/EditPropertyScreen';
import LocationPickerScreen from '../screens/Sales/LocationPickerScreen';

const Stack = createNativeStackNavigator();

const MapStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MapScreen" component={MapScreen} />
            <Stack.Screen name="PropertyDetails" component={PropertyDetailsScreen} />
            <Stack.Screen name="EditProperty" component={EditPropertyScreen} />
            <Stack.Screen name="LocationPickerScreen" component={LocationPickerScreen} />
        </Stack.Navigator>
    );
};

export default MapStack;
