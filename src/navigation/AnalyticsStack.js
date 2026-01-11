import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ViewAnalyticsScreen from '../screens/Settings/Analytics/ViewAnalyticsScreen';
import UsersListScreen from '../screens/Settings/Analytics/UsersListScreen';
import BrokersListScreen from '../screens/Settings/Analytics/BrokersListScreen';

const Stack = createNativeStackNavigator();

const AnalyticsStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ViewAnalyticsScreen" component={ViewAnalyticsScreen} />
            <Stack.Screen name="UsersListScreen" component={UsersListScreen} />
            <Stack.Screen name="BrokersListScreen" component={BrokersListScreen} />
        </Stack.Navigator>
    );
};

export default AnalyticsStack;
