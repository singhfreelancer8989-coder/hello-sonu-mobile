import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Image,
  Switch
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { SafeAreaView } from 'react-native-safe-area-context';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';

import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { pickImage } from '../../utility/imagePicker';
import images from '../../assets/images';
import useAuth from '../../hooks/useAuth';
import { uploadImage, deleteImage } from '../../services/imageUpload.service';
import { addOrphanedKey, removeOrphanedKey } from '../../utility/orphanedImage.utility';
import { ActivityIndicator } from 'react-native';
import { createProperty } from '../../services/property.service';
import { useDispatch } from 'react-redux';
import { fetchPropertiesAsync } from '../../store/slices/propertySlices';
import { showErrorAlert } from '../../utility/error.utility';

const SalesFormScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { userData } = useAuth();

  useEffect(() => {
    if (userData?.id || userData?._id) {
      setFormData(prev => ({ ...prev, userId: userData.id || userData._id }));
      // console.log("userData:", JSON.stringify(userData, null, 2));
    }
  }, [userData]);

  const getInitialFormState = () => ({
    userId: userData?.id || userData?._id || "",
    propertyName: '',
    propertyCategory: '',
    relationToProperty: '',
    flatSize: '',
    size: '',
    lengthFt: '',
    widthFt: '',
    address: '',
    landmark: '',
    city: '',
    googleMapLink: '',
    expectedPrice: '',
    sellingPreference: 'Normal',
    description: '',
    imageUris: [],
    images: [], // { url, publicId }
    isVerified: false,
    ownerName: '',
    ownerMobileNumber: '',
    createdBy: userData?.firstName + ' ' + userData?.lastName,
    createdBy: userData?.firstName + ' ' + userData?.lastName,
    mainVideoUrl: '',//youtube video url
    coverImageUrl: '',
    coverImageKey: '',
  });

  const [formData, setFormData] = useState(getInitialFormState());

  const uploadedImagesSession = useRef([]); // Track all images uploaded in this session
  const isSubmitted = useRef(false); // Track if form is successfully submitted
  const userDataRef = useRef(userData);

  useEffect(() => {
    userDataRef.current = userData;
  }, [userData]);

  const [uploading, setUploading] = useState(false);

  const handleImagePick = async () => {
    if (formData.images.length >= 4) {
      Alert.alert("Limit Reached", "You can upload maximum 4 additional images.");
      return;
    }

    const uri = await pickImage();
    if (uri) {
      setUploading(true);
      try {
        const response = await uploadImage(uri);
        // Response structure: { data: { url, publicId }, message }
        if (response && response.data.data) {
          console.log(response);
          const newImage = {
            url: response.data.data.url,
            key: response.data.data.key
          };

          console.log("[SalesForm] Image Uploaded:", newImage.url);
          uploadedImagesSession.current.push(newImage.key);
          addOrphanedKey(newImage.key); // Persist for crash cleanup

          setFormData(prev => ({
            ...prev,
            images: [...prev.images, newImage]
          }));
        }
      } catch (error) {
        console.log(error);
        showErrorAlert("Upload Failed", "Could not upload image. Please try again.");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleImageDelete = async (key) => {
    Alert.alert(
      "Delete Image",
      "Are you sure you want to delete this image?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // // console.log(key)
              await deleteImage(key);
              setFormData(prev => ({
                ...prev,
                images: prev.images.filter(img => img.key !== key)
              }));
              // // console.log(formData);
            } catch (error) {
              showErrorAlert("Error", "Failed to delete image.");
            }
          }
        }
      ]
    );
  };

  const handleCoverImagePick = async () => {
    const uri = await pickImage();
    if (uri) {
      setUploading(true);
      try {
        const response = await uploadImage(uri);
        if (response && response.data.data) {
          // Assuming response.data.data includes url and key

          console.log("[SalesForm] Cover Image Uploaded:", response.data.data.url);
          uploadedImagesSession.current.push(response.data.data.key);
          addOrphanedKey(response.data.data.key); // Persist for crash cleanup

          setFormData(prev => ({
            ...prev,
            coverImageUrl: response.data.data.url,
            coverImageKey: response.data.data.key
          }));
        }
      } catch (error) {
        console.log(error);
        showErrorAlert("Upload Failed", "Could not upload cover image.");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleCoverImageDelete = () => {
    Alert.alert("Delete Cover Image", "Remove current cover image?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            if (formData.coverImageKey) {
              await deleteImage(formData.coverImageKey);
            }
            setFormData(prev => ({ ...prev, coverImageUrl: '', coverImageKey: '' }));
          } catch (err) {
            console.error("Failed to delete cover image", err);
            // Even if API fails, clear UI? Or show alert? Best to alert but clear UI for UX or retry.
            // For now, let's clear it to not block the user, or just alert.
            // Let's assume we want to force consistency:
            Alert.alert("Error", "Failed to delete image from server.");
          }
        }
      }
    ]);
  };

  const updateField = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const [activeModalField, setActiveModalField] = useState(null);
  const openModal = (field) => setActiveModalField(field);
  const closeModal = () => setActiveModalField(null);

  const propertyCategories = [
    { label: 'Plots', value: 'plots' },
    { label: 'House/Apartment', value: 'house_apartment' },
    { label: 'Office/Shop', value: 'office_shop' },
    { label: 'Agricultural Land', value: 'agriculture_land' }
  ];
  const relationList = ["owner", "relative", "friend", "broker"];

  const getModalData = () => {
    if (activeModalField === 'propertyCategory') return propertyCategories;
    if (activeModalField === 'relationToProperty') return relationList;
    return [];
  };

  const handleSelection = (item) => {
    const value = item.value || item;
    updateField(activeModalField, value);
    closeModal();
  };

  const getDisplayLabel = (field, value) => {
    if (field === 'propertyCategory') {
      const found = propertyCategories.find(c => c.value === value);
      return found ? found.label : value;
    }
    return value;
  };



  const handleSubmit = async () => {
    const requiredFields = [
      "propertyCategory",
      "relationToProperty",
      "expectedPrice",
      "city",
      "ownerName", // Updated from "name" as per formData key
      "ownerMobileNumber", // Updated from "mobile" as per formData key
      "userId",
      "coverImageUrl"
    ];

    for (let key of requiredFields) {
      if (!formData[key]) {
        Alert.alert("Missing Details", "Please fill all mandatory fields.");
        return;
      }
    }



    setUploading(true);
    try {
      // Create a payload with sanitized expectedPrice
      const payload = {
        ...formData,
        expectedPrice: String(formData.expectedPrice || '').replace(/,/g, '')
      };
      console.log("Submitting formData:", JSON.stringify(payload, null, 2));
      const response = await createProperty(payload);
      // // console.log("Property Created:", response);

      // RELOAD PROPERTIES
      dispatch(fetchPropertiesAsync());

      Alert.alert("Success", "Sales form submitted successfully!", [
        {
          text: "OK", onPress: async () => {
            isSubmitted.current = true;
            // Form success: These images are now permanent. Remove from orphaned list.
            for (const key of uploadedImagesSession.current) {
              await removeOrphanedKey(key);
            }
            // Fully reset the form
            setFormData(getInitialFormState());
            navigation.goBack();
          }
        }
      ]);
    } catch (error) {
      console.error("Submission Error:", error);
      showErrorAlert("Error", "Failed to submit sales form. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Cleanup effect using useFocusEffect to catch Tab Switching and Back Navigation
  useFocusEffect(
    useCallback(() => {
      // Screen Focused
      return () => {
        // Screen Blurred (Tab switch, Back, or Navigate away)
        if (!isSubmitted.current && uploadedImagesSession.current.length > 0) {
          console.log("[SalesForm] Screen blurred/unmounted without submission. Cleanup started.");

          // Clone the array to avoid concurrency issues if this runs multiple times
          const imagesToDelete = [...uploadedImagesSession.current];
          uploadedImagesSession.current = []; // Clear immediately to prevent double delete

          // Serialize cleanup to prevent race conditions
          (async () => {
            for (const key of imagesToDelete) {
              try {
                console.log("[SalesForm] Deleting orphaned image:", key);
                await deleteImage(key);
                await removeOrphanedKey(key); // Remove from persistent storage
                console.log("[SalesForm] Successfully deleted:", key);
              } catch (error) {
                console.error("[SalesForm] Failed to delete image:", key, error);
              }
            }
          })();

          // Reset Form Data on Exit/Interruption
          console.log("[SalesForm] Resetting form data.");
          setFormData({
            userId: userDataRef.current?.id || userDataRef.current?._id || "",
            propertyName: '',
            propertyCategory: '',
            relationToProperty: '',
            flatSize: '',
            size: '',
            lengthFt: '',
            widthFt: '',
            address: '',
            landmark: '',
            city: '',
            googleMapLink: '',
            expectedPrice: '',
            sellingPreference: 'Normal',
            description: '',
            imageUris: [],
            images: [],
            isVerified: false,
            ownerName: '',
            ownerMobileNumber: '',
            createdBy: userDataRef.current?.firstName + ' ' + userDataRef.current?.lastName,
            mainVideoUrl: '',
            coverImageUrl: '',
            coverImageKey: '',
          });
        }
      };
    }, [])
  );

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

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cover Image (Main)</Text>
          {formData.coverImageUrl ? (
            <View style={styles.uploadedImageWrapper}>
              <Image source={{ uri: formData.coverImageUrl }} style={styles.uploadedImage} resizeMode="cover" />
              <TouchableOpacity
                style={styles.deleteIcon}
                onPress={handleCoverImageDelete}
              >
                <Ionicons name="close-circle" size={28} color="#ff4444" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={[styles.uploadButton, { width: '100%', justifyContent: 'center' }]} onPress={handleCoverImagePick} disabled={uploading}>
              {uploading ? <ActivityIndicator color="#fff" /> : <MaterialIcons name="add-photo-alternate" size={22} color="#fff" />}
              <Text style={styles.uploadButtonText}>{uploading ? "Uploading..." : "Upload Cover Image"}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* title */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Property Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter"
            placeholderTextColor="#aaa"
            value={formData.propertyName}
            onChangeText={(v) => updateField("propertyName", v)}
          />
        </View>

        {/* PROPERTY CATEGORY */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Property Category</Text>
          <TouchableOpacity style={styles.dropdownInput} onPress={() => openModal('propertyCategory')}>
            <Text style={[styles.inputText, !formData.propertyCategory && styles.placeholder]}>
              {getDisplayLabel('propertyCategory', formData.propertyCategory) || "Select Category"}
            </Text>
            <Entypo name="chevron-down" size={22} color="#333" />
          </TouchableOpacity>
        </View>


        {/* PROPERTY RELATION */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Relation to Property</Text>
          <TouchableOpacity style={styles.dropdownInput} onPress={() => openModal('relationToProperty')}>
            <Text style={[styles.inputText, !formData.relationToProperty && styles.placeholder]}>
              {formData.relationToProperty || "Select"}
            </Text>
            <Entypo name="chevron-down" size={22} color="#333" />
          </TouchableOpacity>
        </View>

        {(formData.propertyCategory == 'house_apartment') && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Flat size(in BHK)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter"
              placeholderTextColor="#aaa"
              value={formData.flatSize}
              onChangeText={(v) => updateField("flatSize", v)}
            />
          </View>
        )}

        {/* Size */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Size</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter"
            placeholderTextColor="#aaa"
            value={formData.size}
            onChangeText={(v) => updateField("size", v)}
            keyboardType="numeric"
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
              keyboardType="numeric"
              value={formData.lengthFt}
              onChangeText={(v) => updateField("lengthFt", v)}
            />
          </View>

          <View style={styles.dimWrapper}>
            <Text style={styles.label}>Width (ft)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 30"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={formData.widthFt}
              onChangeText={(v) => updateField("widthFt", v)}
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
            value={formData.address}
            onChangeText={(v) => updateField("address", v)}
          />
        </View>


        {/* CITY */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter City"
            placeholderTextColor="#aaa"
            value={formData.city}
            onChangeText={(v) => updateField("city", v)}
          />
        </View>

        {/* LANDMARK */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Landmark</Text>
          <TextInput
            style={styles.input}
            placeholder="Near City Center"
            placeholderTextColor="#aaa"
            value={formData.landmark}
            onChangeText={(v) => updateField("landmark", v)}
          />
        </View>

        {/* GOOGLE MAP LINK */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Google Map Link</Text>
          <TextInput
            style={styles.input}
            placeholder="Paste Google Map Link here"
            placeholderTextColor="#aaa"
            value={formData.googleMapLink}
            onChangeText={(v) => updateField("googleMapLink", v)}
          />
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

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Upload Additional Images (Required, max 4)</Text>

          <ScrollView horizontal style={{ marginTop: 8, paddingTop: 10, marginBottom: 8 }} contentContainerStyle={{ paddingRight: 10 }}>
            {formData.images.map((img, idx) => (
              <View key={idx} style={styles.uploadedImageWrapper}>
                <Image source={{ uri: img.url }} style={styles.uploadedImage} />
                <TouchableOpacity
                  style={styles.deleteIcon}
                  onPress={() => handleImageDelete(img.key)}
                >
                  <Ionicons name="close-circle" size={24} color="#ff4444" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {formData.images.length < 4 && (
            <TouchableOpacity style={styles.uploadButton} onPress={handleImagePick} disabled={uploading}>
              {uploading ? <ActivityIndicator color="#fff" /> : <MaterialIcons name="file-upload" size={20} color="#fff" />}
              <Text style={styles.uploadButtonText}>{uploading ? "Uploading..." : "Upload"}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* MAIN VIDEO URL */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>YouTube Video URL</Text>
          <TextInput
            style={styles.input}
            placeholder="https://youtu.be/..."
            placeholderTextColor="#aaa"
            value={formData.mainVideoUrl}
            onChangeText={(v) => updateField("mainVideoUrl", v)}
          />
        </View>

        {/* PRICE */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Expected Price</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={formData.expectedPrice}
            onChangeText={(v) => updateField("expectedPrice", v)}
          />
        </View>

        {/* SELLING PREFERENCE */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Selling Preference</Text>
          <View style={styles.radioRow}>
            {["urgent", "flexible", "normal"].map((pref) => (
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

        {/* VERIFIED TOGGLE */}
        <View style={styles.rowBetween}>
          <Text style={styles.label}>Verified Property?</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#3a75cd" }}
            thumbColor={formData.isVerified ? "#fff" : "#f4f3f4"}
            onValueChange={(v) => updateField("isVerified", v)}
            value={formData.isVerified}
          />
        </View>


        <Text style={styles.sectionHeader}>Owner Details</Text>

        {/* OWNER NAME */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Owner Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Owner Name"
            placeholderTextColor="#aaa"
            value={formData.ownerName}
            onChangeText={(v) => updateField("ownerName", v)}
          />
        </View>

        {/* OWNER MOBILE */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Owner Mobile</Text>
          <TextInput
            style={styles.input}
            placeholder="10 digits"
            keyboardType="phone-pad"
            maxLength={10}
            value={formData.ownerMobileNumber}
            onChangeText={(v) => updateField("ownerMobileNumber", v)}
          />
        </View>

        {/* SUBMIT */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={uploading}>
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Submit</Text>
          )}
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
                keyExtractor={(item) => item.value || item}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.modalItem} onPress={() => handleSelection(item)}>
                    <Text style={styles.modalItemText}>{item.label || item}</Text>
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
    padding: wp('3.5%'),
    gap: 6,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: wp('5.5%'), // 22
    color: "#000",
  },

  scrollContainer: { padding: wp('4%'), paddingBottom: hp('7.5%') },

  /* LOGO */
  logoHolder: {
    alignItems: 'center',
    marginBottom: hp('1.25%'),
  },
  mainLogoImage: {
    width: '55%',
    height: hp('10%'),
  },

  /* TITLES + LABELS */
  pageTitle: {
    fontSize: wp('5%'), // 20
    fontFamily: "Poppins-Bold",
    color: '#000',
    marginBottom: hp('2.5%'),
  },

  inputGroup: { marginBottom: hp('2%') },

  label: {
    fontFamily: "Poppins-Medium",
    fontSize: wp('3.5%'), // 14
    marginBottom: hp('0.75%'),
    color: '#333',
  },

  /* INPUTS */
  input: {
    fontFamily: "Poppins-Regular",
    fontSize: wp('3.8%'), // 15
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1.25%'),
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
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1.25%'),
  },

  inputText: {
    fontFamily: "Poppins-Regular",
    fontSize: wp('3.8%'), // 15
    color: "#000",
  },

  textArea: {
    fontFamily: "Poppins-Regular",
    fontSize: wp('3.8%'), // 15
    minHeight: hp('12.5%'),
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1.25%'),
    textAlignVertical: 'top',
    color: '#000',
  },

  /* DIMENSIONS */
  dimensionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('2%'),
  },
  dimWrapper: { flex: 0.48 },

  /* IMAGES */
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3a75cd',
    paddingVertical: hp('1.25%'),
    paddingHorizontal: wp('3%'),
    borderRadius: 6,
    gap: 6,
    width: wp('32.5%'),
  },
  uploadButtonText: {
    color: '#fff',
    fontFamily: "Poppins-Medium",
    fontSize: wp('3.5%'),
  },
  uploadedImage: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: 8,
    overflow: 'visible'
  },
  uploadedImageWrapper: {
    width: wp('20%'),
    height: wp('20%'),
    marginRight: 10,
    position: 'relative',
  },
  deleteIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },

  /* RADIO */
  radioRow: { flexDirection: 'row', gap: 12, marginTop: 6 },
  radioOption: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  radioCircle: {
    height: wp('5%'),
    width: wp('5%'),
    borderRadius: wp('2.5%'),
    borderWidth: 2,
    borderColor: '#3a75cd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioFill: {
    height: wp('3%'),
    width: wp('3%'),
    borderRadius: wp('1.5%'),
    backgroundColor: '#3a75cd',
  },
  radioLabel: {
    fontFamily: "Poppins-Regular",
    fontSize: wp('3.5%'),
  },

  /* SUBMIT BTN */
  submitButton: {
    backgroundColor: '#3a75cd',
    paddingVertical: hp('1.75%'),
    borderRadius: 6,
    alignItems: 'center',
    marginTop: hp('2.25%'),
  },
  submitText: {
    color: '#fff',
    fontSize: wp('4%'),
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
    fontSize: wp('4%'),
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
    fontSize: wp('3.8%'), // 15
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
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1%'),
    paddingRight: wp('2%')
  },
  sectionHeader: {
    fontFamily: "Poppins-Bold",
    fontSize: wp('4.5%'),
    color: '#000',
    marginTop: hp('1%'),
    marginBottom: hp('1.5%'),
  },
});
