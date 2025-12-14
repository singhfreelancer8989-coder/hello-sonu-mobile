import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import images from '../../assets/images';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const OnboardingScreen = () => {
  const Navigator = useNavigation();

  return (
    <>
      <View style={styles.container}>
        {/* Taglines */}
        {/* <View style={styles.taglineWrapper}>
           <Text style={styles.taglineName}>
            Hello Sonu
          </Text> 
          <Text style={styles.taglineHindi}>
            सही प्रॉपर्टी की सही जगह
          </Text>
        </View> */}

        {/* LOGO */}
        <View style={styles.logoWrapper}>
          <Image
            source={images.mainLogo}
            style={styles.mainLogoImage}
            resizeMode="contain"
          />
        </View>

        {/* Taglines */}
        <View style={styles.taglineWrapper}>
          <Text style={styles.taglineName}>
            Hello Sonu - <Text style={styles.taglineHindi}>
              सही प्रॉपर्टी की सही जगह
            </Text>
          </Text>

        </View>

      </View>

      {/* Bottom Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => Navigator.navigate('Login')}
      >
        <Text style={styles.buttonText}>Getting Started</Text>
      </TouchableOpacity>

    </>
  );
};

export default OnboardingScreen;

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
    width: wp('70%'),
    height: hp('40%'),
    justifyContent: 'center',
    alignItems: 'center',
  },

  mainLogoImage: {
    width: '100%',
    height: '100%',
  },

  /*  Tagline Styles */
  taglineWrapper: {
    marginTop: -30,
    alignItems: 'center',
  },

  taglineName: {
    fontSize: wp('5%'), // Approx 20
    fontFamily: 'Poppins-SemiBold',
    color: '#0E0E0E',
    opacity: 0.95,
    letterSpacing: 0.3,
  },

  taglineHindi: {
    fontSize: wp('5%'), // Approx 20
    fontFamily: 'Poppins-Medium',
    color: '#0E0E0E',
    opacity: 0.85,
    marginTop: 4,
    letterSpacing: 0.2,
    // textDecorationLine: 'underline',
    textDecorationColor: '#8a0808ff',
    textDecorationStyle: 'solid',
  },

  button: {
    height: wp('14%'), // Approx 56
    backgroundColor: '#34C759',
    borderRadius: wp('7%'), // Half of height
    marginHorizontal: 24,
    marginBottom: hp('10%'), // Approx 80
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },

  buttonText: {
    fontSize: wp('5%'), // Approx 20
    color: '#fff',
    fontFamily: "Poppins-SemiBold"
  },
});
