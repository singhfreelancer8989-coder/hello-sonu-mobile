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
  Image,
  Alert,
  Modal,
  FlatList,
  TouchableWithoutFeedback
} from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import images from '../../assets/images';
import OTPPopup from '../../components/Auth/OTPPopup';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
  const Navigator = useNavigation();

  // --- STATE: FORM ---
  const [username, setUsername] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');

  // --- STATE: VISIBILITY ---
  const [isCityModalVisible, setCityModalVisible] = useState(false);
  const [isOtpVisible, setOtpVisible] = useState(false);

  const citiesList = ['Hyderabad', 'Bangalore', 'Mumbai', 'Pune', 'Delhi', 'Chennai'];

  // --- LOGIC: SIGN UP ---
  const handleSignUp = () => {
    if (!username || !mobile || !email || !city) {
      Alert.alert("Arey bhai!", "Sab fields bharna padta na.");
      return;
    }
    setOtpVisible(true);
  };

  // --- LOGIC: CITY SELECT ---
  const handleSelectCity = (selectedCity) => {
    setCity(selectedCity);
    setCityModalVisible(false);
  };

  // --- LOGIC: FINAL VERIFY (Jo OTP Popup se call hoga) ---
  const handleFinalVerification = () => {
    setOtpVisible(false);
    console.log("User Verified & Registered:", { username, mobile, email, city });
    Alert.alert("Mubarak ho!", "Welcome to the App!");
    Navigator.navigate("Home")
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Logo */}
        <View style={styles.logoPlaceholder}>
          <Image source={images.mainLogo} style={styles.mainLogoImage} resizeMode='contain' />
        </View>

        <Text style={styles.pageTitle}>SignUp</Text>

        {/* Username */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input} placeholder="Enter your name" placeholderTextColor="#999"
            value={username} onChangeText={setUsername}
          />
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
              value={mobile} onChangeText={setMobile} maxLength={10}
            />
          </View>
        </View>

        {/* City Dropdown */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>City</Text>
          <TouchableOpacity style={styles.dropdownInput} onPress={() => setCityModalVisible(true)}>
            <Text style={[styles.inputText, !city && { color: '#999' }]}>{city || "Select City"}</Text>
            <View style={{ flex: 1 }} />
            <Entypo name="chevron-down" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Gmail */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>G-Mail</Text>
          <TextInput
            style={styles.input} keyboardType="email-address" placeholder="example@gmail.com" placeholderTextColor="#999"
            value={email} onChangeText={setEmail} autoCapitalize="none"
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
        mobile={mobile}
        onClose={() => setOtpVisible(false)}
        onVerify={(otpCode) => {
          handleFinalVerification()
        }}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ... Styles wahi purane wale same rahenge ...
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContainer: { padding: 24, flexGrow: 1 },
  logoPlaceholder: { height: 120, justifyContent: 'center', alignItems: 'center', marginBottom: 30, marginTop: 20 },
  mainLogoImage: { width: "100%", height: "100%" },
  pageTitle: { fontSize: 30, fontWeight: 'bold', color: '#000', marginBottom: 25 },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 8 },
  input: { height: 50, borderWidth: 1.5, borderColor: '#000', borderRadius: 8, paddingHorizontal: 16, fontSize: 16, color: '#000' },
  mobileContainer: { height: 50, borderWidth: 1.5, borderColor: '#000', borderRadius: 8, flexDirection: 'row', alignItems: 'center', overflow: 'hidden' },
  countryCode: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: '100%' },
  countryText: { fontSize: 16, color: '#000', fontWeight: '500' },
  verticalDivider: { width: 1.5, height: '60%', backgroundColor: '#000' },
  phoneInput: { flex: 1, height: '100%', paddingHorizontal: 12, fontSize: 16, color: '#000' },
  dropdownInput: { height: 50, borderWidth: 1.5, borderColor: '#000', borderRadius: 8, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' },
  inputText: { fontSize: 16, color: '#000' },
  signupButton: { height: 55, backgroundColor: '#5B75FF', borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 20, elevation: 8 },
  signupButtonText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '80%', backgroundColor: '#FFF', borderRadius: 12, padding: 20, maxHeight: '50%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  modalItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  modalItemText: { fontSize: 16, textAlign: 'center' },
  closeButton: { marginTop: 15, backgroundColor: '#000', padding: 10, borderRadius: 8, alignItems: 'center' },
  closeButtonText: { color: '#FFF', fontWeight: 'bold' }
});

export default RegisterScreen;