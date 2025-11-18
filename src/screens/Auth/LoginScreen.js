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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LoginScreen = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* 1. Logo Placeholder */}
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>LOGO</Text>
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

        {/* 4. Password Input (with Eye Icon) */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              secureTextEntry={!isPasswordVisible}
            />
            <TouchableOpacity 
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              style={styles.eyeIcon}
            >
              <Icon 
                name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} 
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
              <Icon name="google" size={30} color="#333" style={styles.socialIcon} />
            </TouchableOpacity>
            
            {/* Apple */}
            <TouchableOpacity>
              <Icon name="apple" size={30} color="#333" style={styles.socialIcon} />
            </TouchableOpacity>
            
            {/* Facebook */}
            <TouchableOpacity>
              <Icon name="facebook" size={30} color="#333" style={styles.socialIcon} />
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
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
  // Logo Box
  logoPlaceholder: {
    height: 150,
    backgroundColor: '#D9D9D9', // Light grey
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  // Heading
  pageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
  },
  // Inputs
  inputGroup: {
    marginBottom: 20,
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
  // Password Specifics
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
  eyeIcon: {
    marginLeft: 10,
  },
  // Forgot Password
  forgotContainer: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotText: {
    color: '#555',
    fontSize: 14,
  },
  // Button
  loginButton: {
    height: 55,
    backgroundColor: '#5B75FF', // Matches the blue in your image
    borderRadius: 28, // Rounded pill shape
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
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
    marginBottom: 20,
  },
  socialRow: {
    flexDirection: 'row',
    width: 150,
    justifyContent: 'space-between',
  },
  socialIcon: {
    // Optional: Add spacing if not using justify 'space-between'
  }
});

export default LoginScreen;