import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  Alert, Image
} from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import images from '../../assets/images';

const SalesFormScreen = () => {

  // --- STATE: FORM FIELDS ---
  const [propertyType, setPropertyType] = useState('');
  const [size, setSize] = useState('');
  const [dimension, setDimension] = useState('');
  const [location, setLocation] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [mapLink, setMapLink] = useState('');
  const [demandPrice, setDemandPrice] = useState('');
  const [sellingPreference, setSellingPreference] = useState('Normal'); // Default to Normal or empty
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  // --- STATE: MODALS ---
  const [activeModalField, setActiveModalField] = useState(null); // To track which dropdown is open

  // --- DATA LISTS ---
  const citiesList = ['Hyderabad', 'Bangalore', 'Mumbai', 'Pune', 'Delhi'];
  const propertyTypes = ['Apartment', 'Villa', 'Plot', 'Commercial'];
  const sizesList = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', 'Plot (Sq.yd)'];

  // --- HANDLERS ---
  const handleSubmit = () => {
    // Basic Validation
    if (!propertyType || !city || !name || !mobile) {
      Alert.alert("Missing Details", "Please fill all mandatory fields.");
      return;
    }
    console.log("Form Submitted:", {
      propertyType, size, dimension, location, city, mapLink,
      demandPrice, sellingPreference, name, mobile, whatsapp
    });
    Alert.alert("Success", "Sales form submitted successfully!");
  };

  const openModal = (field) => setActiveModalField(field);
  const closeModal = () => setActiveModalField(null);

  const handleSelection = (item) => {
    if (activeModalField === 'city') setCity(item);
    if (activeModalField === 'propertyType') setPropertyType(item);
    if (activeModalField === 'size') setSize(item);
    closeModal();
  };

  // Helper to get data for the active modal
  const getModalData = () => {
    if (activeModalField === 'city') return citiesList;
    if (activeModalField === 'propertyType') return propertyTypes;
    if (activeModalField === 'size') return sizesList;
    return [];
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#E5E5E5" />

      {/* HEADER (LOGO AREA) */}
      <View style={styles.headerBar}>
        <View style={styles.logoPlaceholder}>
                  <Image style={styles.mainLogoImage} source={images.mainLogo} resizeMode="contain" />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <Text style={styles.pageTitle}>SALES FORM</Text>

        {/* 1. Property Details (Dropdown) */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Property Details</Text>
          <TouchableOpacity style={styles.dropdownInput} onPress={() => openModal('propertyType')}>
            <Text style={[styles.inputText, !propertyType && styles.placeholderColor]}>
              {propertyType || "Select"}
            </Text>
            <Entypo name="chevron-down" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* 2. Size (Dropdown) */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Size</Text>
          <TouchableOpacity style={styles.dropdownInput} onPress={() => openModal('size')}>
            <Text style={[styles.inputText, !size && styles.placeholderColor]}>
              {size || "Select"}
            </Text>
            <Entypo name="chevron-down" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* 3. Dimension */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dimension</Text>
          <TextInput
            style={styles.input} placeholder="enter" placeholderTextColor="#999"
            value={dimension} onChangeText={setDimension}
          />
        </View>

        {/* 4. Location/Address */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location/Address</Text>
          <TextInput
            style={styles.input} placeholder="enter" placeholderTextColor="#999"
            value={location} onChangeText={setLocation}
          />
        </View>

        {/* 5. Landmark */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Landmark</Text>
          <TextInput
            style={styles.input} placeholder="enter" placeholderTextColor="#999"
            value={landmark} onChangeText={setLandmark}
          />
        </View>

        {/* 6. City (Dropdown) */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>City</Text>
          <TouchableOpacity style={styles.dropdownInput} onPress={() => openModal('city')}>
            <Text style={[styles.inputText, !city && styles.placeholderColor]}>
              {city || "Select"}
            </Text>
            <Entypo name="chevron-down" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* 7. Google Map Location (With Icon) */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Google Map Location</Text>
          <View style={styles.mapInputContainer}>
            <TextInput
              style={styles.mapInput} placeholder="Select" placeholderTextColor="#999"
              value={mapLink} onChangeText={setMapLink}
            />
            <TouchableOpacity style={styles.mapIconBox}>
              <Entypo name="location-pin" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 8. Image Upload */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Image Upload</Text>
          <TouchableOpacity style={styles.uploadButton}>
            <MaterialIcons name="file-upload" size={20} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.uploadButtonText}>Upload</Text>
          </TouchableOpacity>
        </View>

        {/* 9. Demand / Expected Price */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Demand / Expected Price</Text>
          <TextInput
            style={styles.input} placeholder="enter" placeholderTextColor="#999"
            value={demandPrice} onChangeText={setDemandPrice} keyboardType="numeric"
          />
        </View>

        {/* 10. Selling Preference (Radio Buttons) */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Selling Preference</Text>
          <View style={styles.radioGroup}>
            {['Urgent', 'Flexible', 'Normal'].map((pref) => (
              <TouchableOpacity
                key={pref}
                style={styles.radioButtonContainer}
                onPress={() => setSellingPreference(pref)}
              >
                <View style={styles.radioCircle}>
                  {sellingPreference === pref && <View style={styles.radioFill} />}
                </View>
                <Text style={styles.radioLabel}>{pref}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 11. Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input} placeholder="enter" placeholderTextColor="#999"
            value={name} onChangeText={setName}
          />
        </View>

        {/* 12. Mobile Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mobile Number</Text>
          <View style={styles.mobileContainer}>
            <View style={styles.countryCode}>
              <Entypo name="chevron-down" size={16} color="#555" style={{ marginRight: 4 }} />
              <Text style={styles.countryText}>+91</Text>
            </View>
            <View style={styles.verticalDivider} />
            <TextInput
              style={styles.phoneInput} keyboardType="phone-pad" placeholder=""
              value={mobile} onChangeText={setMobile} maxLength={10}
            />
          </View>
        </View>

        {/* 13. WhatsApp Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>WhatsApp Number</Text>
          <View style={styles.mobileContainer}>
            <View style={styles.countryCode}>
              <Entypo name="chevron-down" size={16} color="#555" style={{ marginRight: 4 }} />
              <Text style={styles.countryText}>+91</Text>
            </View>
            <View style={styles.verticalDivider} />
            <TextInput
              style={styles.phoneInput} keyboardType="phone-pad" placeholder=""
              value={whatsapp} onChangeText={setWhatsapp} maxLength={10}
            />
          </View>
        </View>

        {/* SUBMIT BUTTON */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>SUBMIT</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* --- REUSABLE MODAL --- */}
      <Modal
        visible={!!activeModalField}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={closeModal}
        >
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                Select {activeModalField === 'city' ? 'City' : activeModalField === 'propertyType' ? 'Property Type' : 'Size'}
              </Text>
              <FlatList
                data={getModalData()}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.modalItem} onPress={() => handleSelection(item)}>
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF', },
  logoPlaceholder: {
    height: "100%",
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainLogoImage: {
    width: "100%",
    height: "100%",
  },

  // Header Styles
  headerBar: {height: 100, width: "100%", justifyContent: 'center', paddingHorizontal: 10 },

  scrollContainer: { padding: 20, paddingBottom: 50 },
  pageTitle: { fontSize: 22, fontWeight: 'bold', color: '#3b4bf8', marginBottom: 25, marginTop: 10 },

  // Input Styles
  inputGroup: { marginBottom: 18 },
  label: { fontSize: 15, fontWeight: '500', color: '#000', marginBottom: 8 },
  input: { height: 50, borderWidth: 1, borderColor: '#CCC', borderRadius: 8, paddingHorizontal: 12, fontSize: 14, color: '#000' },
  placeholderColor: { color: '#999' },

  // Dropdown Styles
  dropdownInput: { height: 50, borderWidth: 1, borderColor: '#CCC', borderRadius: 8, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  inputText: { fontSize: 14, color: '#000' },

  // Map Input Styles
  mapInputContainer: { flexDirection: 'row', height: 50, borderWidth: 1, borderColor: '#CCC', borderRadius: 8, overflow: 'hidden' },
  mapInput: { flex: 1, paddingHorizontal: 12, fontSize: 14, color: '#000' },
  mapIconBox: { width: 50, justifyContent: 'center', alignItems: 'center', borderLeftWidth: 1, borderLeftColor: '#CCC' },

  // Upload Button
  uploadButton: { backgroundColor: '#5B5DFF', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 6, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center' },
  uploadButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },

  // Radio Button Styles
  radioGroup: { flexDirection: 'row', alignItems: 'center' },
  radioButtonContainer: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  radioCircle: { height: 20, width: 20, borderRadius: 10, borderWidth: 2, borderColor: '#555', alignItems: 'center', justifyContent: 'center', marginRight: 6 },
  radioFill: { height: 10, width: 10, borderRadius: 5, backgroundColor: '#000' },
  radioLabel: { fontSize: 14, color: '#000' },

  // Mobile Input Styles (Reused logic)
  mobileContainer: { height: 50, borderWidth: 1, borderColor: '#CCC', borderRadius: 8, flexDirection: 'row', alignItems: 'center', overflow: 'hidden' },
  countryCode: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: '100%', backgroundColor: '#F9F9F9' },
  countryText: { fontSize: 14, color: '#555', fontWeight: '500' },
  verticalDivider: { width: 1, height: '100%', backgroundColor: '#CCC' },
  phoneInput: { flex: 1, height: '100%', paddingHorizontal: 12, fontSize: 14, color: '#000' },

  // Submit Button
  submitButton: { height: 55, backgroundColor: '#5B75FF', borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginTop: 30, elevation: 5 },
  submitButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold', textTransform: 'uppercase' },

  // Modal Styles (Reused)
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '80%', backgroundColor: '#FFF', borderRadius: 12, padding: 20, maxHeight: '50%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  modalItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  modalItemText: { fontSize: 16, textAlign: 'center', color: '#333' },
  closeButton: { marginTop: 15, backgroundColor: '#000', padding: 10, borderRadius: 8, alignItems: 'center' },
  closeButtonText: { color: '#FFF', fontWeight: 'bold' }
});

export default SalesFormScreen;