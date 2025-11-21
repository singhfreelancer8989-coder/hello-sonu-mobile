import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo } from '@expo/vector-icons';
import { View, Platform } from 'react-native';

import HomePageScreen from '../screens/Home/HomePageScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import AIChat from '../screens/AIChat/AIChatScreen';
import SavedScreen from '../screens/Saved/SavedScreen';
import SalesFormScreen from '../screens/Sales/SalesFormScreen';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#5D5FEF',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 85 : 70,
          paddingBottom: Platform.OS === 'ios' ? 25 : 12,
          paddingTop: 12,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 0,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.05,
          shadowRadius: 8,
        },
        tabBarShowLabel: false,
        tabBarItemStyle: {
          paddingVertical: 8,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomePageScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: focused ? '#5D5FEF15' : 'transparent',
              }}
            >
              <Entypo
                name="home"
                size={focused ? 30 : 26}
                color={color}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Saved"
        component={SavedScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: focused ? '#5D5FEF15' : 'transparent',
              }}
            >
              <Entypo
                name="bookmark"
                size={focused ? 30 : 26}
                color={color}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Menu"
        component={SalesFormScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: focused ? '#5D5FEF15' : 'transparent',
              }}
            >
              <Entypo
                name="dots-three-horizontal"
                size={focused ? 30 : 26}
                color={focused ? '#5D5FEF' : color}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Messages"
        component={AIChat}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: focused ? '#5D5FEF15' : 'transparent',
              }}
            >
              <Entypo
                name="message"
                size={focused ? 30 : 26}
                color={color}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: focused ? '#5D5FEF15' : 'transparent',
              }}
            >
              <Entypo
                name="cog"
                size={focused ? 30 : 26}
                color={color}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;