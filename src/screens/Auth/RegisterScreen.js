import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
  Alert,
  Modal,
  FlatList,
  TouchableWithoutFeedback
} from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import images from '../../assets/images';
import OTPPopup from '../../components/Auth/OTPPopup';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { registerUser } from '../../services/auth/auth.service';
import { showErrorAlert } from '../../utility/error.utility';

const RegisterScreen = ({ }) => {
  const Navigator = useNavigation();
  const route = useRoute();
  const { setIsLogin } = route.params || {};
  // --- STATE: FORM ---
  // --- STATE: FORM ---
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    city: '',
    password: ''
  });

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- STATE: VISIBILITY ---
  const [isCityModalVisible, setCityModalVisible] = useState(false);
  const [isOtpVisible, setOtpVisible] = useState(false);

  const citiesList = ['Hyderabad', 'Bangalore', 'Mumbai', 'Pune', 'Delhi', 'Chennai'];

  // --- LOGIC: SIGN UP ---
  const handleSignUp = async () => {
    const { firstName, lastName, mobile, email, city, password } = formData;
    if (!firstName || !lastName || !mobile || !email || !city || !password) {
      showErrorAlert("Missing Fields", "All fields are required");
      return;
    }

    // Check if we need to verify before popup or just show popup
    // Usually we just show OTP popup here if validation passes
    // But the original code had complete registration logic here too (lines 47-58 were weirdly duplicated/incomplete logic)
    // Assuming the flow is: Validate -> Show OTP -> Verify -> Register

    // BYPASS OTP FOR NOW: Redirect directly to Login
    try {
      const userData = {
        first_name: firstName,
        last_name: lastName,
        // mobile,
        email,
        // city,
        password
      };
      await registerUser(userData);
      Alert.alert("Congratulations", "Registration Successful! Please Login.", [
        { text: "OK", onPress: () => Navigator.navigate('Login') }
      ]);
      // setIsLogin(1);  
    } catch (error) {
      Alert.alert("Registration Failed", error.message || "Something went wrong");
    }

    // setOtpVisible(true);
  };

  // --- LOGIC: CITY SELECT ---
  const handleSelectCity = (selectedCity) => {
    handleChange('city', selectedCity);
    setCityModalVisible(false);
  };

  // --- LOGIC: FINAL VERIFY (Jo OTP Popup se call hoga) ---
  // --- LOGIC: FINAL VERIFY (Jo OTP Popup se call hoga) ---
  // --- LOGIC: FINAL VERIFY (Jo OTP Popup se call hoga) ---
  const handleFinalVerification = async () => {
    setOtpVisible(false);
    const { firstName, lastName, mobile, email, city, password } = formData;
    console.log("User Verified & Registered:", formData);

    try {
      const userData = {
        first_name: firstName,
        last_name: lastName,
        // mobile,
        email,
        // city,
        password
      };
      await registerUser(userData);
      Alert.alert("Congratulations", "Welcome to the App!");
      // setIsLogin(1);  
    } catch (error) {
      Alert.alert("Registration Failed", error.message || "Something went wrong");
    }
  };

  return (
    <>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Logo */}
        <View style={styles.logoPlaceholder}>
          <Image source={images.mainLogo} style={styles.mainLogoImage} resizeMode='contain' />
        </View>

        <Text style={styles.pageTitle}>SignUp</Text>

        {/* First & Last Name */}
        <View style={[styles.inputGroup, { flexDirection: 'row', justifyContent: 'space-between' }]}>
          <View style={{ width: '48%' }}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input} placeholder="First Name" placeholderTextColor="#999"
              value={formData.firstName} onChangeText={(text) => handleChange('firstName', text)}
            />
          </View>
          <View style={{ width: '48%' }}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input} placeholder="Last Name" placeholderTextColor="#999"
              value={formData.lastName} onChangeText={(text) => handleChange('lastName', text)}
            />
          </View>
        </View>

        {/* Mobile */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mobile Number</Text>
          <View style={styles.mobileContainer}>
            <TouchableOpacity style={styles.countryCode}>
              <Entypo name="chevron-down" size={20} color="#000" style={{ marginRight: 4 }} />
              <Text style={styles.countryText}>+91</Text>
            </TouchableOpacity>
            <View style={styles.verticalDivider} />
            <TextInput
              style={styles.phoneInput} keyboardType="phone-pad" placeholder="00000 00000" placeholderTextColor="#999"
              value={formData.mobile} onChangeText={(text) => handleChange('mobile', text)} maxLength={10}
            />
          </View>
        </View>

        {/* City Dropdown */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>City</Text>
          <TouchableOpacity style={styles.dropdownInput} onPress={() => setCityModalVisible(true)}>
            <Text style={[styles.inputText, !formData.city && { color: '#999' }]}>{formData.city || "Select City"}</Text>
            <View style={{ flex: 1 }} />
            <Entypo name="chevron-down" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Gmail */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input} keyboardType="email-address" placeholder="example@gmail.com" placeholderTextColor="#999"
            value={formData.email} onChangeText={(text) => handleChange('email', text)} autoCapitalize="none"
          />
        </View>

        {/* Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input} placeholder="Password" placeholderTextColor="#999"
            value={formData.password} onChangeText={(text) => handleChange('password', text)} secureTextEntry
          />
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* --- CITY MODAL --- */}
      <Modal
        visible={isCityModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setCityModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setCityModalVisible(false)}
        >
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Select Your City</Text>
              <FlatList
                data={citiesList}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.modalItem} onPress={() => handleSelectCity(item)}>
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity style={styles.closeButton} onPress={() => setCityModalVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>

      <OTPPopup
        visible={isOtpVisible}
        mobile={formData.mobile}
        onClose={() => setOtpVisible(false)}
        onVerify={(otpCode) => {
          handleFinalVerification()
        }}
      />

    </>
  );
};

const styles = StyleSheet.create({
  // ... Styles wahi purane wale same rahenge ...
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContainer: { padding: wp('6%'), flexGrow: 1 },
  logoPlaceholder: { height: hp('15%'), justifyContent: 'center', alignItems: 'center', marginBottom: hp('3%'), marginTop: hp('2%') },
  mainLogoImage: { width: "100%", height: "100%" },
  pageTitle: { fontSize: wp('7.5%'), fontFamily: "Poppins-Bold", color: '#000', },
  inputGroup: { marginBottom: hp('2%') },
  label: { fontSize: wp('4%'), fontFamily: "Poppins-SemiBold", color: '#000', marginBottom: hp('1%') },
  input: { height: wp('12.5%'), borderWidth: 1.5, borderColor: '#000', borderRadius: 8, paddingHorizontal: wp('4%'), fontSize: wp('4%'), color: '#000', fontFamily: 'Poppins-Regular' },
  mobileContainer: { height: wp('12.5%'), borderWidth: 1.5, borderColor: '#000', borderRadius: 8, flexDirection: 'row', alignItems: 'center', overflow: 'hidden' },
  countryCode: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: '100%' },
  countryText: { fontSize: wp('4%'), color: '#000', fontFamily: 'Poppins-Regular' },
  verticalDivider: { width: 1.5, height: '60%', backgroundColor: '#000' },
  phoneInput: { flex: 1, height: '100%', paddingHorizontal: 12, fontSize: wp('4%'), color: '#000', fontFamily: 'Poppins-Regular' },
  dropdownInput: { height: wp('12.5%'), borderWidth: 1.5, borderColor: '#000', borderRadius: 8, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' },
  inputText: { fontSize: wp('4%'), color: '#000', fontFamily: 'Poppins-Regular' },
  signupButton: { height: wp('13.5%'), backgroundColor: '#5B75FF', borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 20, elevation: 8 },
  signupButtonText: { color: '#FFF', fontSize: wp('5%'), fontFamily: 'Poppins-SemiBold' },
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '80%', backgroundColor: '#FFF', borderRadius: 12, padding: 20, maxHeight: '50%' },
  modalTitle: { fontSize: wp('5%'), fontFamily: 'Poppins-SemiBold', marginBottom: 15, textAlign: 'center' },
  modalItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  modalItemText: { fontSize: wp('4%'), textAlign: 'center', fontFamily: 'Poppins-Regular' },
  closeButton: { marginTop: 15, backgroundColor: '#000', padding: 10, borderRadius: 8, alignItems: 'center' },
  closeButtonText: { color: '#FFF', fontFamily: 'Poppins-Regular' }
});

export default RegisterScreen;