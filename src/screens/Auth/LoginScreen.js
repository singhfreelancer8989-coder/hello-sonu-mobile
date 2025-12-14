import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image, Platform,
  Linking
} from 'react-native';
import images from '../../assets/images';
import Entypo from '@expo/vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const LoginScreen = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const Navigator = useNavigation();
  return (
    <>

      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* 1. Logo Placeholder */}
        <View style={styles.logoPlaceholder}>
          <Image style={styles.mainLogoImage} source={images.mainLogo} resizeMode="contain" />
        </View>

        {/* 2. Heading */}
        <Text style={styles.pageTitle}>Login</Text>

        {/* 3. Username Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder=""
          />
        </View>

        {/* 4. Password Input (with Eye Image) */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              secureTextEntry={!isPasswordVisible}
            />
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              style={styles.eyeImage}
            >
              <Entypo
                name={isPasswordVisible ? "eye-with-line" : "eye"}
                size={24}
                color="#000"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* 5. Forgot Password */}
        <TouchableOpacity style={styles.forgotContainer}>
          <Text style={styles.forgotText}>Forget Password?</Text>
        </TouchableOpacity>

        {/* 6. Login Button */}
        <TouchableOpacity onPress={() => { }} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>LOGIN</Text>
        </TouchableOpacity>

        {/* 7. Footer (Socials) */}
        <View style={styles.footer}>
          {/* We combine all elements in one Text component for inline flow */}
          <Text style={styles.footerText}>
            {/* Removed conflicting height/padding/overflow styles from TouchableOpacity */}
            <Text onPress={() => { Navigator.navigate("Register") }} style={styles.signUpLinkText}>Sign Up ?</Text>
            <Text> Don't Have an account</Text>
          </Text>
        </View>

      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    padding: wp('6%'), // 24
    flexGrow: 1,
    justifyContent: 'center',
  },
  logoPlaceholder: {
    height: hp('20%'), // 150 approx
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('2.5%'), // 20
  },
  mainLogoImage: {
    width: "100%",
    height: "100%",
  },
  logoText: {
    fontSize: wp('6%'), // 24
    fontWeight: 'bold',
    color: '#000',
  },
  pageTitle: {
    fontSize: wp('8%'), // 32
    // fontWeight: 'bold',
    color: '#000',
    fontFamily: Platform.OS === 'android' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  inputGroup: {
    marginBottom: hp('1.5%'), // 10
  },
  label: {
    fontSize: wp('4%'), // 16
    // fontWeight: 'bold',
    color: '#000',
    fontFamily: Platform.OS === 'android' ? 'Poppins-Bold' : 'Poppins-Bold',
    marginBottom: hp('1%'), // 8
  },
  input: {
    height: wp('12.5%'), // 50
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 8,
    paddingHorizontal: wp('4%'),
    fontSize: wp('4%'), // 16
    color: '#000',
    fontFamily: Platform.OS === 'android' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  passwordContainer: {
    height: wp('12.5%'), // 50
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    fontSize: wp('4%'), // 16
    fontFamily: Platform.OS === 'android' ? 'Poppins-Regular' : 'Poppins-Regular',
    color: '#000',
  },
  eyeImage: {
    marginLeft: 10,
  },
  // Forgot Password
  forgotContainer: {
    alignSelf: 'flex-end',
    marginBottom: hp('2.5%'), // 20
  },
  forgotText: {
    color: '#555',
    fontFamily: Platform.OS === 'android' ? 'Poppins-Regular' : 'Poppins-Regular',
    fontSize: wp('3.5%'), // 14
  },
  // Button
  loginButton: {
    height: wp('13.5%'), // 55
    backgroundColor: '#5B75FF',
    borderRadius: wp('7%'), // 28
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: Platform.OS === 'android' ? 'Poppins-Regular' : 'Poppins-Regular',
    marginBottom: hp('2.5%'),
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: wp('4.5%'), // 18
    // fontWeight: 'bold',
    letterSpacing: 1,
    fontFamily: Platform.OS === 'android' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  // Footer
  footer: {
    alignItems: 'center',
  },
  footerText: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    fontSize: wp('3.5%'), // 14
    color: '#333',
    fontFamily: 'Poppins-Regular',
    // Align text elements inline
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  signUpLinkText: {
    color: "blue",
    fontFamily: "Poppins-Regular",
    marginRight: '4.6%',
    height: wp('4%'),
  }
});

export default LoginScreen;