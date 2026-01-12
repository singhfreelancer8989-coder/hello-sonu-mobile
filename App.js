import { StyleSheet, StatusBar, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './src/navigation/AuthStack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { AuthProvider } from './src/providers/AuthProvider';

import { AnalyticsProvider } from './src/context/AnalyticsContext';
import { getAndClearOrphanedKeys } from './src/utility/orphanedImage.utility';
import { deleteImage } from './src/services/imageUpload.service';
import React, { useEffect } from 'react';

export default function App() {
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("./src/assets/fonts/Poppins/Poppins-Regular.ttf"),
    "Poppins-Medium": require("./src/assets/fonts/Poppins/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("./src/assets/fonts/Poppins/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("./src/assets/fonts/Poppins/Poppins-Bold.ttf"),
  });

  useEffect(() => {
    // STARTUP CLEANUP: Remove images left over from previous crashes
    const cleanupOrphans = async () => {
      const keys = await getAndClearOrphanedKeys();
      if (keys.length > 0) {
        // console.log("[App] Found orphaned images from previous session. Cleaning up...", keys);
        keys.forEach(async (key) => {
          try {
            await deleteImage(key);
            // console.log("[App] Cleaned up orphaned image:", key);
          } catch (e) {
            // console.error("[App] Failed to cleanup orphaned image:", key, e);
          }
        });
      }
    };
    cleanupOrphans();
  }, []);

  if (!fontsLoaded) return null;



  return (
    <Provider store={store}>
      <AuthProvider>
        <AnalyticsProvider>
          {/* For Android + iOS, actual background support */}
          <StatusBar barStyle="dark-content" backgroundColor="#3a75cdff" />
          <View style={styles.root}>
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
