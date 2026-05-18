import { StyleSheet, StatusBar, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
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
// import { extractCoordinates } from './src/utility/location.utility';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

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
    // extractCoordinates(
    //   "https://maps.app.goo.gl/CP6wz9gWrXpygEHbA?g_st=ac"
    // ).then(console.log);
    cleanupOrphans();
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
            <NavigationContainer>
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
