import React from 'react';
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

const RegisterScreen = () => {
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* 1. Logo Placeholder */}
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>LOGO</Text>
        </View>

        {/* 2. Heading */}
        <Text style={styles.pageTitle}>SignUp</Text>

        {/* 3. Username Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput 
            style={styles.input} 
            placeholder="" 
          />
        </View>

        {/* 4. Mobile Number Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mobile Number</Text>
          <View style={styles.mobileContainer}>
            {/* Country Code Section */}
            <TouchableOpacity style={styles.countryCode}>
              <Icon name="chevron-down" size={20} color="#000" style={{marginRight: 4}} />
              <Text style={styles.countryText}>+91</Text>
            </TouchableOpacity>
            
            {/* Vertical Divider */}
            <View style={styles.verticalDivider} />

            {/* Phone Input */}
            <TextInput 
              style={styles.phoneInput} 
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* 5. City Input (Dropdown Simulation) */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>City</Text>
          <TouchableOpacity style={styles.dropdownInput}>
            {/* Empty View to push icon to right, or placeholder text */}
            <View style={{flex: 1}} /> 
            <Icon name="chevron-down" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* 6. G-Mail Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>G-Mail</Text>
          <TextInput 
            style={styles.input} 
            keyboardType="email-address"
          />
        </View>

        {/* 7. Sign Up Button */}
        <TouchableOpacity style={styles.signupButton}>
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>

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
  },
  // Logo
  logoPlaceholder: {
    height: 120,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  // Title
  pageTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 25,
  },
  // Standard Inputs
  inputGroup: {
    marginBottom: 15,
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
  // Mobile Number Specifics
  mobileContainer: {
    height: 50,
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden', // Ensures children stay inside border radius
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: '100%',
    backgroundColor: '#fff',
  },
  countryText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  verticalDivider: {
    width: 1.5,
    height: '60%', // Not full height to look like a separator
    backgroundColor: '#000',
  },
  phoneInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#000',
  },
  // City Dropdown Specifics
  dropdownInput: {
    height: 50,
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Button
  signupButton: {
    height: 55,
    backgroundColor: '#5B75FF', // Matching Blue
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  signupButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;