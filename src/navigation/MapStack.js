import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapScreen from '../screens/Settings/Map/MapScreen';
import PropertyDetailsScreen from '../screens/Home/PropertyDetails';

const Stack = createNativeStackNavigator();

const MapStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MapScreen" component={MapScreen} />
            <Stack.Screen name="PropertyDetails" component={PropertyDetailsScreen} />
        </Stack.Navigator>
    );
};

export default MapStack;
