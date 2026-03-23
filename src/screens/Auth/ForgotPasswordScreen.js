import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import images from '../../assets/images';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { forgotPassword } from '../../services/user.service';
import { showErrorAlert } from '../../utility/error.utility';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const response = await forgotPassword(email);
      if (response) {
        Alert.alert(
          "Check Your Email",
          "If an account exists for this email, you will receive a password reset link shortly.",
          [{ text: "OK", onPress: () => navigation.navigate('Login') }]
        );
      }
    } catch (e) {
      showErrorAlert("Submission Failed", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.logoPlaceholder}>
          <Image style={styles.mainLogoImage} source={images.mainLogo} resizeMode="contain" />
        </View>

        {/* Heading */}
        <Text style={styles.pageTitle}>Forgot Password</Text>
        <Text style={styles.subTitle}>Enter your email address to receive a reset link.</Text>

        {/* Email Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="example@mail.com"
            placeholderTextColor="#AAA"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          onPress={handleForgotPassword} 
          style={styles.submitButton} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitButtonText}>SEND RESET LINK</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    padding: wp('6%'),
    flexGrow: 1,
    paddingTop: hp('5%'),
  },
  backButton: {
    marginBottom: hp('2%'),
    marginLeft: -5,
  },
  logoPlaceholder: {
    height: hp('15%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('2.5%'),
  },
  mainLogoImage: {
    width: "100%",
    height: "100%",
  },
  pageTitle: {
    fontSize: wp('7%'),
    color: '#000',
    fontFamily: 'Poppins-Bold',
    marginBottom: hp('1%'),
  },
  subTitle: {
    fontSize: wp('3.8%'),
    color: '#666',
    fontFamily: 'Poppins-Regular',
    marginBottom: hp('3%'),
  },
  inputGroup: {
    marginBottom: hp('3%'),
  },
  label: {
    fontSize: wp('4%'),
    color: '#000',
    fontFamily: 'Poppins-Bold',
    marginBottom: hp('1%'),
  },
  input: {
    height: wp('12.5%'),
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 8,
    paddingHorizontal: wp('4%'),
    fontSize: wp('4%'),
    color: '#000',
    fontFamily: 'Poppins-Regular',
  },
  submitButton: {
    height: wp('13.5%'),
    backgroundColor: '#5B75FF',
    borderRadius: wp('7%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('1%'),
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: wp('4%'),
    letterSpacing: 1,
    fontFamily: 'Poppins-Bold',
  },
});

export default ForgotPasswordScreen;
