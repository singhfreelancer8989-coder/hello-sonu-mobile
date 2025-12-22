import { StyleSheet, StatusBar, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './src/navigation/AuthStack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { AuthProvider } from './src/providers/AuthProvider';

export default function App() {
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("./src/assets/fonts/Poppins/Poppins-Regular.ttf"),
    "Poppins-Medium": require("./src/assets/fonts/Poppins/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("./src/assets/fonts/Poppins/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("./src/assets/fonts/Poppins/Poppins-Bold.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <Provider store={store}>
      <AuthProvider>
        {/* For Android + iOS, actual background support */}
        <StatusBar barStyle="dark-content" backgroundColor="#3a75cdff" />
        <View style={styles.root}>
          <NavigationContainer>
            <SafeAreaView style={styles.container}>
              <AuthStack />
            </SafeAreaView>
          </NavigationContainer>
        </View>
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
