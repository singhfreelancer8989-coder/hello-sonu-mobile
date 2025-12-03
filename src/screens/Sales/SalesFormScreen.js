import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  Alert,
  Image
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';
import { pickImage } from '../../utility/imagePicker';
import images from '../../assets/images';

const SalesFormScreen = () => {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    propertyCategory: '',
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
    description: '',
    name: '',
    mobile: '',
    whatsapp: '',
    imageUris: []
  });

  const updateField = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const [activeModalField, setActiveModalField] = useState(null);
  const openModal = (field) => setActiveModalField(field);
  const closeModal = () => setActiveModalField(null);

  const citiesList = ['Hyderabad', 'Bangalore', 'Mumbai', 'Pune', 'Delhi'];
  const propertyCategories = ['Residential', 'Commercial', 'Agriculture', 'Rental'];
  const propertyTypes = ['House', 'Plot', 'Shop', 'Office', 'Land', 'Flat'];
  const relationList = ['Owner', 'Relative', 'Friend', 'Broker'];

  const getModalData = () => {
    if (activeModalField === 'propertyCategory') return propertyCategories;
    if (activeModalField === 'propertyType') return propertyTypes;
    if (activeModalField === 'propertyRelation') return relationList;
    if (activeModalField === 'city') return citiesList;
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
    if (uri) updateField("imageUris", [...formData.imageUris, uri]);
  };

  const handleSubmit = () => {
    const requiredFields = [
      "propertyType",
      "propertyCategory",
      "city",
      "name",
      "mobile"
    ];

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

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Sales Form</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* LOGO */}
        <View style={styles.logoHolder}>
          <Image style={styles.mainLogoImage} source={images.mainLogo} resizeMode="contain" />
        </View>

        {/* PROPERTY CATEGORY */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Property Category</Text>
          <TouchableOpacity style={styles.dropdownInput} onPress={() => openModal('propertyCategory')}>
            <Text style={[styles.inputText, !formData.propertyCategory && styles.placeholder]}>
              {formData.propertyCategory || "Select Category"}
            </Text>
            <Entypo name="chevron-down" size={22} color="#333" />
          </TouchableOpacity>
        </View>

        {/* PROPERTY TYPE */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Property Type</Text>
          <TouchableOpacity style={styles.dropdownInput} onPress={() => openModal('propertyType')}>
            <Text style={[styles.inputText, !formData.propertyType && styles.placeholder]}>
              {formData.propertyType || "Select Type"}
            </Text>
            <Entypo name="chevron-down" size={22} color="#333" />
          </TouchableOpacity>
        </View>

        {/* PROPERTY RELATION */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Relation to Property</Text>
          <TouchableOpacity style={styles.dropdownInput} onPress={() => openModal('propertyRelation')}>
            <Text style={[styles.inputText, !formData.propertyRelation && styles.placeholder]}>
              {formData.propertyRelation || "Select"}
            </Text>
            <Entypo name="chevron-down" size={22} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Size */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Size</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter"
            placeholderTextColor="#aaa"
            value={formData.size}
            onChangeText={(v) => updateField("size", v)}
          />
        </View>

        {/* Length / Width */}
        <View style={styles.dimensionContainer}>
          <View style={styles.dimWrapper}>
            <Text style={styles.label}>Length (ft)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 40"
              placeholderTextColor="#aaa"
              value={formData.length}
              onChangeText={(v) => updateField("length", v)}
            />
          </View>

          <View style={styles.dimWrapper}>
            <Text style={styles.label}>Width (ft)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 30"
              placeholderTextColor="#aaa"
              value={formData.width}
              onChangeText={(v) => updateField("width", v)}
            />
          </View>
        </View>

        {/* Location */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location / Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter"
            placeholderTextColor="#aaa"
            value={formData.location}
            onChangeText={(v) => updateField("location", v)}
          />
        </View>

        {/* Landmark */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Landmark</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter"
            placeholderTextColor="#aaa"
            value={formData.landmark}
            onChangeText={(v) => updateField("landmark", v)}
          />
        </View>

        {/* CITY */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>City</Text>
          <TouchableOpacity style={styles.dropdownInput} onPress={() => openModal('city')}>
            <Text style={[styles.inputText, !formData.city && styles.placeholder]}>
              {formData.city || "Select City"}
            </Text>
            <Entypo name="chevron-down" size={22} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Property Description</Text>
          <TextInput
            style={styles.textArea}
            multiline
            placeholder="Explain details about the property"
            placeholderTextColor="#aaa"
            value={formData.description}
            onChangeText={(v) => updateField("description", v)}
          />
        </View>

        {/* UPLOAD IMAGES */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Upload Images (max 5)</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={handleImagePick}>
            <MaterialIcons name="file-upload" size={20} color="#fff" />
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
          <Text style={styles.label}>Expected Price</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={formData.demandPrice}
            onChangeText={(v) => updateField("demandPrice", v)}
          />
        </View>

        {/* SELLING PREFERENCE */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Selling Preference</Text>
          <View style={styles.radioRow}>
            {['Urgent', 'Flexible', 'Normal'].map((pref) => (
              <TouchableOpacity
                key={pref}
                style={styles.radioOption}
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
          <Text style={styles.label}>Your Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter"
            placeholderTextColor="#aaa"
            value={formData.name}
            onChangeText={(v) => updateField("name", v)}
          />
        </View>

        {/* MOBILE */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            placeholder="10 digits"
            keyboardType="phone-pad"
            maxLength={10}
            value={formData.mobile}
            onChangeText={(v) => updateField("mobile", v)}
          />
        </View>

        {/* SUBMIT */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* MODAL */}
      <Modal
        visible={!!activeModalField}
        animationType="fade"
        transparent
      >
        <TouchableOpacity activeOpacity={1} style={styles.modalOverlay} onPressOut={closeModal}>
          <TouchableWithoutFeedback>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Select {activeModalField}</Text>

              <FlatList
                data={getModalData()}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.modalItem} onPress={() => handleSelection(item)}>
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />

              <TouchableOpacity style={styles.closeBtn} onPress={closeModal}>
                <Text style={styles.closeBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default SalesFormScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },

  /* =============== HEADER =============== */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 6,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 22,
    color: "#000",
  },

  scrollContainer: { padding: 16, paddingBottom: 60 },

  /* LOGO */
  logoHolder: {
    alignItems: 'center',
    marginBottom: 10,
  },
  mainLogoImage: {
    width: '55%',
    height: 80,
  },

  /* TITLES + LABELS */
  pageTitle: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    color: '#000',
    marginBottom: 20,
  },

  inputGroup: { marginBottom: 16 },

  label: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
  },

  /* INPUTS */
  input: {
    fontFamily: "Poppins-Regular",
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#000',
  },
  placeholder: { color: '#777' },

  dropdownInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  inputText: {
    fontFamily: "Poppins-Regular",
    fontSize: 15,
    color: "#000",
  },

  textArea: {
    fontFamily: "Poppins-Regular",
    fontSize: 15,
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlignVertical: 'top',
    color: '#000',
  },

  /* DIMENSIONS */
  dimensionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dimWrapper: { flex: 0.48 },

  /* IMAGES */
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3a75cd',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 6,
    width: 130,
  },
  uploadButtonText: {
    color: '#fff',
    fontFamily: "Poppins-Medium",
    fontSize: 14,
  },
  uploadedImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 8,
  },

  /* RADIO */
  radioRow: { flexDirection: 'row', gap: 12, marginTop: 6 },
  radioOption: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#3a75cd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioFill: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#3a75cd',
  },
  radioLabel: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
  },

  /* SUBMIT BTN */
  submitButton: {
    backgroundColor: '#3a75cd',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 18,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.4)',
    justifyContent: 'center',
    padding: 18,
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    maxHeight: '70%',
  },
  modalTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    marginBottom: 10,
    color: "#000",
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalItemText: {
    fontFamily: "Poppins-Regular",
    fontSize: 15,
    color: "#333",
  },
  closeBtn: {
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: "#3a75cd",
  },
  closeBtnText: {
    fontFamily: "Poppins-Medium",
    color: "#fff",
    textAlign: 'center',
  },
});
