import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Image, // Image component import karna mat bhoolna
} from 'react-native';

// Humara naya banaya hua asset manager import karo
import images from '../../assets/images'; 
import { useNavigation } from '@react-navigation/native';

const OnboardingScreen = () => {
  const Navigator = useNavigation();
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.container}>
        <View style={styles.circleContainer}>
          
          {/* --- Central Logo --- */}
          {/* View hata ke seedha Image use kar rahe, taaki transparent look aaye */}
          <View style={styles.logoWrapper}>
             <Image 
                source={images.mainLogo} 
                style={styles.mainLogoImage} 
                resizeMode="contain" 
             />
          </View>

          {/* --- Surrounding Icons --- */}

          {/* Icon 1: Top-Left */}
          <View style={[styles.iconBox, { top: 50, left: 30 }]}>
            <Image source={images.building} style={styles.iconImage} />
          </View>

          {/* Icon 2: Top */}
          <View style={[styles.iconBox, { top: 0, alignSelf: 'center' }]}>
            <Image source={images.checklist} style={styles.iconImage} />
          </View>

          {/* Icon 3: Top-Right */}
          <View style={[styles.iconBox1, { top: 50, right: 30}]}>
            <Image source={images.fileEye} style={styles.iconImage} />
          </View>

          {/* Icon 4: Right */}
          <View style={[styles.iconBox, { top: '45%', right: 0 }]}>
            <Image source={images.houseRight} style={styles.iconImage} />
          </View>

          {/* Icon 5: Bottom-Right */}
          <View style={[styles.iconBox, { bottom: 40, right: 35 }]}>
            <Image source={images.rCircle} style={styles.iconImage} />
          </View>

          {/* Icon 6: Bottom */}
          <View style={[styles.iconBox, { bottom: -5, alignSelf: 'center' }]}>
            <Image source={images.houseMoney} style={styles.iconImage} />
          </View>

          {/* Icon 7: Bottom-Left */}
          <View style={[styles.iconBox, { bottom: 40, left: 35 }]}>
            <Image source={images.houseAnalytics} style={styles.iconImage} />
          </View>

          {/* Icon 8: Left */}
          <View style={[styles.iconBox, { top: '45%', left: 0 }]}>
            <Image source={images.houseLeft} style={styles.iconImage} />
          </View>

        </View>
      </View>

      {/* Bottom Button */}
      <TouchableOpacity style={styles.button} onPress={()=>{Navigator.navigate("Register")}}>
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
  circleContainer: {
    width: 320,
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
    // Debugging ke liye border laga ke dekh sakte ho
    // borderWidth: 1, borderColor: 'red', 
  },
  logoWrapper: {
    width: 180,
    height: 180,
    borderRadius: 100,
    backgroundColor: '#ddf3f1ff', // Grey circle background
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainLogoImage: {
    width: 130, // Logo size adjust kar lena
    height: 100,
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
});

export default OnboardingScreen;