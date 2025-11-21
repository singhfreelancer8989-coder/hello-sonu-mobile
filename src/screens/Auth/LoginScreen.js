import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image, Platform
} from 'react-native';
import images from '../../assets/images';
import AntDesign from '@expo/vector-icons/AntDesign'
import Entypo from '@expo/vector-icons/Entypo';

const LoginScreen = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <>
      <StatusBar barStyle="dark-content" />

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
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>LOGIN</Text>
        </TouchableOpacity>

        {/* 7. Footer (Socials) */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Sign In? or continue with</Text>

          <View style={styles.socialRow}>
            {/* Google */}
            <TouchableOpacity>
              <AntDesign name="google" size={30} color="#333" style={styles.socialImage} />
            </TouchableOpacity>

            {/* Apple */}
            {Platform.OS === 'ios' && (
              <TouchableOpacity>
                <AntDesign name="apple1" size={30} color="#000" style={styles.socialImage} />
              </TouchableOpacity>
            )}

            {/* Facebook */}
            <TouchableOpacity>
              <Entypo name="facebook" size={30} color="#333" style={styles.socialImage} />
            </TouchableOpacity>
          </View>
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
    padding: 24,
    flexGrow: 1,
    justifyContent: 'center',
  },
  logoPlaceholder: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  mainLogoImage: {
    width: "100%",
    height: "100%",
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000',
  },
  passwordContainer: {
    height: 50,
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#000',
  },
  eyeImage: {
    marginLeft: 10,
  },
  // Forgot Password
  forgotContainer: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotText: {
    color: '#555',
    fontSize: 14,
  },
  // Button
  loginButton: {
    height: 55,
    backgroundColor: '#5B75FF',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  // Footer
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 25,
    marginTop: 0,
  },
  socialImage: {
    // Optional: Add spacing if not using justify 'space-between'
  }
});

export default LoginScreen;