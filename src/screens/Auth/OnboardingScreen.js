import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Image, // Image component import karna mat bhoolna
} from 'react-native';
import images from '../../assets/images'; 
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const OnboardingScreen = () => {
  const Navigator = useNavigation();
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.container}>
          
          {/* --- Central Logo --- */}
          {/* View hata ke seedha Image use kar rahe, taaki transparent look aaye */}
          <View style={styles.logoWrapper}>
             <Image 
                source={images.mainLogo} 
                style={styles.mainLogoImage} 
                resizeMode="contain" 
             />
          </View>
          <Text style={styles.tagline}>
            "Sahi Property Ki Sahi Jagah"
          </Text>
        </View>

      {/* Bottom Button */}
      <TouchableOpacity style={styles.button} onPress={()=>{Navigator.navigate("Login")}}>
        <Text style={styles.buttonText}>Getting Started</Text>
      </TouchableOpacity>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapper: {
    width: "90%",
    height: "40%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainLogoImage: {
    width: "100%", // Logo size adjust kar lena
  },
  iconBox: {
    width: 50,
    height: 50,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBox1: {
    width: 40,
    height: 50,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // New style for the icons
  iconImage: {
    width: '100%', // Box ke size ka 100% lega (50px)
    height: '100%',
    resizeMode: 'contain', // Image kategi nahi, fit ho jayegi
  },
  button: {
    height: 56,
    backgroundColor: '#34C759',
    borderRadius: 28,
    marginHorizontal: 24,
    marginBottom: 80,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonText: {
    fontSize: 20, // 28 thoda zyada bada tha button height ke hisaab se
    fontWeight: '600',
    color: '#fff',
  },
 tagline: {
  fontSize: 28,
  fontFamily: "Poppins-SemiBold",
  color: '#5b0f0fff',
  maxWidth: '80%',
  letterSpacing: 0.5,
  opacity: 0.9,
  marginBottom: 20,
  marginTop: 0,
}
});

export default OnboardingScreen;