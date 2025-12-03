import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Ionicons is better for this outline style
import { View, Platform, StyleSheet } from 'react-native';

// Import your stacks/screens
import HomeStack from './HomeStacks';
import SettingsStack from './SettingsStack';
import SavedStack from './SavedStack';
import AIChat from '../screens/AIChat/AIChatScreen';
import SalesFormScreen from '../screens/Sales/SalesFormScreen';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,

        // Active color (Blue like the button) vs Inactive (Grey)
        tabBarActiveTintColor: '#4834d4',
        tabBarInactiveTintColor: '#95a5a6',

        tabBarStyle: {
          // position: 'absolute', // Thoda float hone ke liye
          bottom: 0,
          left: 0,
          right: 0,
          height: Platform.OS === 'ios' ? 90 : 70,
          backgroundColor: '#ffffff', // White background
          borderTopLeftRadius: 30,    // Rounded corners
          borderTopRightRadius: 30,
          borderTopWidth: 0,          // Line hata diya
          paddingTop: 10,

          // Shadow/Elevation (wo floating feel ke liye)
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
      })}
    >

      {/* HOME */}
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={24}
                color={color}
              />
            </View>
          ),
        }}
      />

      {/* SAVED */}
      <Tab.Screen
        name="Saved"
        component={SavedStack}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <Ionicons
                name={focused ? "bookmark" : "bookmark-outline"}
                size={24}
                color={color}
              />
            </View>
          ),
        }}
      />

      {/* CENTER ADD BUTTON (MENU) */}
      <Tab.Screen
        name="Menu"
        component={SalesFormScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.floatingButton}>
              <Ionicons name="add" size={32} color="#fff" />
            </View>
          ),
        }}
      />

      {/* MESSAGES */}
      <Tab.Screen
        name="Messages"
        component={AIChat}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <Ionicons
                name={focused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline"}
                size={24}
                color={color}
              />
            </View>
          ),
        }}
      />

      {/* SETTINGS */}
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <Ionicons
                name={focused ? "settings" : "settings-outline"}
                size={24}
                color={color}
              />
            </View>
          ),
        }}
      />

    </Tab.Navigator>
  );
};

// Styling alag se rakhe taaki clean dikhe
const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 45,
    height: 45,
    borderRadius: 12.5,
  },
  activeIconContainer: {
    // Ye wo light blue background hai jo active hone pe aata (image jaisa)
    backgroundColor: '#e6e6fa',
  },
  floatingButton: {
    top: -8, // Isku upar uthane ke liye
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4834d4', // Dark Blue color
    justifyContent: 'center',
    alignItems: 'center',
    // Button ka shadow
    elevation: 5,
    shadowColor: '#4834d4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});

export default MainTabs;