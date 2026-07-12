import { StyleSheet, StatusBar, View } from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import AuthStack from './src/navigation/AuthStack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { AuthProvider } from './src/providers/AuthProvider';

import { AnalyticsProvider } from './src/contexts/AnalyticsContext';
import { getAndClearOrphanedKeys } from './src/utility/orphanedImage.utility';
import { deleteImage } from './src/services/imageUpload.service';
import React, { useEffect } from 'react';

import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import { getPropertyById } from './src/services/property.service';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const navigationRef = createNavigationContainerRef();

export default function App() {
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("./src/assets/fonts/Poppins/Poppins-Regular.ttf"),
    "Poppins-Medium": require("./src/assets/fonts/Poppins/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("./src/assets/fonts/Poppins/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("./src/assets/fonts/Poppins/Poppins-Bold.ttf"),
  });

  const onLayoutRootView = React.useCallback(async () => {
    if (fontsLoaded) {
      // This tells the native splash screen to hide immediately!
      // However, since we have a custom animated SplashScreen.js inside AuthStack,
      // we might want to let THAT component handle the hiding to be super smooth.
      // But typically, we hide native splash once fonts are ready.
      // Let's defer hiding to the custom screen if flow permits, BUT
      // standard practice: Hide Native -> Show React Native App (which might show custom splash).
      // Given the user wants consistent loading, we'll hide native here.
      // Wait, SplashScreen.js ALSO calls hideAsync(). Redundant but safe.
      // Actually, if we want to AVOID the white flash, we keep it visible until fontsLoaded.
      // We do NOT call hideAsync here if the child <SplashScreen /> does it.
    }
  }, [fontsLoaded]);

  useEffect(() => {
    // STARTUP CLEANUP: Remove images left over from previous crashes
    const cleanupOrphans = async () => {
      const keys = await getAndClearOrphanedKeys();
      if (keys.length > 0) {
        keys.forEach(async (key) => {
          try {
            await deleteImage(key);
          } catch (e) { }
        });
      }
    };
    cleanupOrphans();

    // Foreground notification listener - custom formatting
    const foregroundSubscription = Notifications.addNotificationReceivedListener(async (notification) => {
      const { data } = notification.request.content;
      const propertyId = data?.propertyId;
      const isLocal = data?.isLocal;

      if (propertyId && !isLocal) {
        try {
          let propertyName = data.propertyName || data.title || notification.request.content.title;
          let description = data.description || data.body || notification.request.content.body;
          let coverImage = data.coverImage || data.image;

          // If detail fields are missing, fetch dynamically from DB
          if (!propertyName || !description) {
            const response = await getPropertyById(propertyId);
            if (response && response.data) {
              propertyName = response.data.title || response.data.propertyName || propertyName;
              description = response.data.description || response.data.desc || description;
              coverImage = response.data.coverImage || coverImage;
            }
          }

          // Truncate description to 60 characters
          const truncatedDesc = description
            ? (description.length > 60 ? description.substring(0, 57) + "..." : description)
            : "";

          // Schedule local formatted notification with cover image attachment (if supported by OS/device)
          await Notifications.scheduleNotificationAsync({
            content: {
              title: propertyName || "New Property Added!",
              body: truncatedDesc,
              data: { propertyId, isLocal: true },
              attachments: coverImage ? [{ uri: coverImage }] : [],
            },
            trigger: null,
          });
        } catch (error) {
          console.error("[App] Failed to handle foreground property notification:", error);
        }
      }
    });

    // Tap/Click response listener - navigate to details screen
    const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      const propertyId = data?.propertyId;

      if (propertyId) {
        if (navigationRef.isReady()) {
          navigationRef.navigate("PropertyDetails", { propertyId });
        }
      }
    });

    return () => {
      foregroundSubscription.remove();
      responseSubscription.remove();
    };
  }, []);

  if (!fontsLoaded) {
    return null;
  }



  return (
    <Provider store={store}>
      <AuthProvider>
        <AnalyticsProvider>
          {/* For Android + iOS, actual background support */}
          <StatusBar barStyle="dark-content" backgroundColor="#3a75cdff" />
          <View style={styles.root} onLayout={onLayoutRootView}>
            <NavigationContainer ref={navigationRef}>
              <SafeAreaView style={styles.container}>
                <AuthStack />
              </SafeAreaView>
            </NavigationContainer>
          </View>
        </AnalyticsProvider>
      </AuthProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ffffffff',
    Bottom: 10
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
