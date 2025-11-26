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
  Alert,
  Image
} from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { pickImage } from '../../utility/imagePicker';
import images from '../../assets/images';

const SalesFormScreen = () => {

  // -------------------------
  // SINGLE STATE OBJECT
  // -------------------------
  const [formData, setFormData] = useState({
    propertyType: '',
    propertyRelation: '',
    size: '',
    length: '',
    width: '',
    location: '',
    landmark: '',
    city: '',
    mapLink: '',
    demandPrice: '',
    sellingPreference: 'Normal',
    name: '',
    mobile: '',
    whatsapp: '',
    imageUris: []
  });

  // Helper to update any field
  const updateField = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // MODAL HANDLERS
  const [activeModalField, setActiveModalField] = useState(null);

  const openModal = (field) => setActiveModalField(field);
  const closeModal = () => setActiveModalField(null);

  const citiesList = ['Hyderabad', 'Bangalore', 'Mumbai', 'Pune', 'Delhi'];
  const propertyTypes = ['House/Apartment/Flats', 'Plots', 'Shop/Godown/Office', 'Agriculture Land/Farm House'];
  const relationList = ['Owner', 'Relative', 'Friend', 'Broker'];

  const getModalData = () => {
    if (activeModalField === 'city') return citiesList;
    if (activeModalField === 'propertyType') return propertyTypes;
    if (activeModalField === 'propertyRelation') return relationList;
    return [];
  };

  const handleSelection = (item) => {
    updateField(activeModalField, item);
    closeModal();
  };

  const handleImagePick = async () => {
    if (formData.imageUris.length >= 5) {
      Alert.alert("Limit Reached", "You can upload maximum 5 images.");
      return;
    }
    const uri = await pickImage();
    if (uri) {
      updateField("imageUris", [...formData.imageUris, uri]);
    }
  };

  // SUBMIT
  const handleSubmit = () => {
    const requiredFields = ["propertyType", "city", "name", "mobile", "propertyRelation"];
    for (let key of requiredFields) {
      if (!formData[key]) {
        Alert.alert("Missing Details", "Please fill all mandatory fields.");
        return;
      }
    }
    console.log("FORM DATA → ", formData);
    Alert.alert("Success", "Sales form submitted successfully!");
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#E5E5E5" />

      <View style={styles.headerBar}>
        <View style={styles.logoPlaceholder}>
          <Image style={styles.mainLogoImage} source={images.mainLogo} resizeMode="contain" />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.pageTitle}>SALES FORM</Text>

        {/* PROPERTY TYPE */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Property Type</Text>
          <TouchableOpacity style={styles.dropdownInput} onPress={() => openModal('propertyType')}>
            <Text style={[styles.inputText, !formData.propertyType && styles.placeholderColor]}>
              {formData.propertyType || "Select"}
            </Text>
            <Entypo name="chevron-down" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* PROPERTY RELATION */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Property Relation</Text>
          <TouchableOpacity style={styles.dropdownInput} onPress={() => openModal('propertyRelation')}>
            <Text style={[styles.inputText, !formData.propertyRelation && styles.placeholderColor]}>
              {formData.propertyRelation || "Select"}
            </Text>
            <Entypo name="chevron-down" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Size */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Size</Text>
          <TextInput
            style={styles.input}
            placeholder="enter"
            placeholderTextColor="#999"
            value={formData.size}
            onChangeText={(v) => updateField("size", v)}
          />
        </View>

        {/* Length + Width */}
        <View style={styles.dimensionContainer}>
          <View style={styles.dimensionInputWrapper}>
            <Text style={styles.label}>Length (ft)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter length"
              placeholderTextColor="#999"
              value={formData.length}
              onChangeText={(v) => updateField("length", v)}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.dimensionInputWrapper}>
            <Text style={styles.label}>Width (ft)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter width"
              placeholderTextColor="#999"
              value={formData.width}
              onChangeText={(v) => updateField("width", v)}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Location */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location/Address</Text>
          <TextInput
            style={styles.input}
            placeholder="enter"
            placeholderTextColor="#999"
            value={formData.location}
            onChangeText={(v) => updateField("location", v)}
          />
        </View>

        {/* Landmark */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Landmark</Text>
          <TextInput
            style={styles.input}
            placeholder="enter"
            placeholderTextColor="#999"
            value={formData.landmark}
            onChangeText={(v) => updateField("landmark", v)}
          />
        </View>

        {/* CITY */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>City</Text>
          <TouchableOpacity style={styles.dropdownInput} onPress={() => openModal('city')}>
            <Text style={[styles.inputText, !formData.city && styles.placeholderColor]}>
              {formData.city || "Select"}
            </Text>
            <Entypo name="chevron-down" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* MAP */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Google Map Location</Text>
          <View style={styles.mapInputContainer}>
            <TextInput
              style={styles.mapInput}
              placeholder="Select"
              placeholderTextColor="#999"
              value={formData.mapLink}
              onChangeText={(v) => updateField("mapLink", v)}
            />
            <TouchableOpacity style={styles.mapIconBox}>
              <Entypo name="location-pin" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* IMAGES */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Upload Images (Max 5)</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={handleImagePick}>
            <MaterialIcons name="file-upload" size={20} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.uploadButtonText}>Upload</Text>
          </TouchableOpacity>

          <ScrollView horizontal style={{ marginTop: 8 }}>
            {formData.imageUris.map((uri, idx) => (
              <Image key={idx} source={{ uri }} style={styles.uploadedImage} />
            ))}
          </ScrollView>
        </View>

        {/* PRICE */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Demand / Expected Price</Text>
          <TextInput
            style={styles.input}
            placeholder="enter"
            placeholderTextColor="#999"
            value={formData.demandPrice}
            onChangeText={(v) => updateField("demandPrice", v)}
            keyboardType="numeric"
          />
        </View>

        {/* SELLING PREF */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Selling Preference</Text>
          <View style={styles.radioGroup}>
            {['Urgent', 'Flexible', 'Normal'].map((pref) => (
              <TouchableOpacity
                key={pref}
                style={styles.radioButtonContainer}
                onPress={() => updateField("sellingPreference", pref)}
              >
                <View style={styles.radioCircle}>
                  {formData.sellingPreference === pref && <View style={styles.radioFill} />}
                </View>
                <Text style={styles.radioLabel}>{pref}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* NAME */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="enter"
            placeholderTextColor="#999"
            value={formData.name}
            onChangeText={(v) => updateField("name", v)}
          />
        </View>

        {/* MOBILE */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mobile Number</Text>
          <View style={styles.mobileContainer}>
            <View style={styles.countryCode}>
              <Entypo name="chevron-down" size={16} color="#555" style={{ marginRight: 4 }} />
              <Text style={styles.countryText}>+91</Text>
            </View>
            <View style={styles.verticalDivider} />
            <TextInput
              style={styles.phoneInput}
              keyboardType="phone-pad"
              maxLength={10}
              value={formData.mobile}
              onChangeText={(v) => updateField("mobile", v)}
            />
          </View>
        </View>

        {/* WHATSAPP */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>WhatsApp Number</Text>
          <View style={styles.mobileContainer}>
            <View style={styles.countryCode}>
              <Entypo name="chevron-down" size={16} color="#555" style={{ marginRight: 4 }} />
              <Text style={styles.countryText}>+91</Text>
            </View>
            <View style={styles.verticalDivider} />
            <TextInput
              style={styles.phoneInput}
              keyboardType="phone-pad"
              maxLength={10}
              value={formData.whatsapp}
              onChangeText={(v) => updateField("whatsapp", v)}
            />
          </View>
        </View>

        {/* SUBMIT */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>SUBMIT</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* MODAL */}
      <Modal
        visible={!!activeModalField}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={closeModal}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                Select {activeModalField}
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
  root: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { padding: 16, paddingBottom: 40 },
  headerBar: { height: 150, justifyContent: 'center', alignItems: 'center' },
  logoPlaceholder: { width: "50%" },
  mainLogoImage: { width: '100%' },
  pageTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 16, color: '#000' },
  inputGroup: { marginBottom: 18 },
  label: { marginBottom: 6, color: '#333' },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 6,
    paddingHorizontal: 12, paddingVertical: 8, color: '#000'
  },
  dropdownInput: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', borderWidth: 1, borderColor: '#ccc',
    borderRadius: 6, paddingHorizontal: 12, paddingVertical: 10
  },
  inputText: { fontSize: 16, color: '#000' },
  placeholderColor: { color: '#999' },
  dimensionContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 },
  dimensionInputWrapper: { flex: 0.48 },
  mapInputContainer: {
    flexDirection: 'row', borderWidth: 1,
    borderColor: '#ccc', borderRadius: 6, alignItems: 'center'
  },
  mapInput: { flex: 1, paddingHorizontal: 12, paddingVertical: 8, color: '#000' },
  mapIconBox: { padding: 8 },
  uploadButton: {
    width: "30%", flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#007BFF', padding: 10, borderRadius: 6
  },
  uploadButtonText: { color: '#FFF', fontSize: 16 },
  uploadedImage: { width: 60, height: 60, borderRadius: 6, marginRight: 8 },
  radioGroup: { flexDirection: 'row', marginTop: 6 },
  radioButtonContainer: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  radioCircle: {
    height: 20, width: 20, borderRadius: 10,
    borderWidth: 1, borderColor: '#333', justifyContent: 'center', alignItems: 'center'
  },
  radioFill: { height: 12, width: 12, borderRadius: 6, backgroundColor: '#333' },
  radioLabel: { marginLeft: 6 },
  mobileContainer: {
    flexDirection: 'row', borderWidth: 1,
    borderColor: '#ccc', borderRadius: 6, alignItems: 'center'
  },
  countryCode: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 },
  verticalDivider: { width: 1, backgroundColor: '#ccc', height: '100%' },
  countryText: { color: '#000' },
  phoneInput: { flex: 1, paddingHorizontal: 12, paddingVertical: 8, color: '#000' },
  submitButton: {
    backgroundColor: '#007BFF', padding: 14,
    borderRadius: 6, alignItems: 'center', marginTop: 20
  },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', padding: 20
  },
  modalContainer: { backgroundColor: '#fff', borderRadius: 6, maxHeight: '70%', padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  modalItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  modalItemText: { fontSize: 16 },
  closeButton: {
    marginTop: 12, backgroundColor: '#ccc',
    padding: 10, borderRadius: 6, alignItems: 'center'
  },
  closeButtonText: { fontSize: 16, color: '#000' }
});

export default SalesFormScreen;
