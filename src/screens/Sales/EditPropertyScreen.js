import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    Alert,
    ActivityIndicator,
    Modal,
    FlatList,
    TouchableWithoutFeedback
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { pickImage } from '../../utility/imagePicker';
import { uploadImage, deleteImage } from '../../services/imageUpload.service';
import { addOrphanedKey, removeOrphanedKey } from '../../utility/orphanedImage.utility';
import { deleteProperty, updateProperty, updatePropertyCoverImage } from '../../services/property.service';
import { fetchPropertyByIdAsync, fetchListingPropertiesAsync, fetchPropertiesAsync } from '../../store/slices/propertySlices';

const EditPropertyScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const route = useRoute();
    const existingProperty = route.params?.property;

    const [mediaList, setMediaList] = useState(() => {
        if (existingProperty?.media && Array.isArray(existingProperty.media)) {
            return [...existingProperty.media];
        }
        return [];
    });

    // Initialize cover image state from existing property
    const [coverImageState, setCoverImageState] = useState({
        url: existingProperty?.coverImageUrl || existingProperty?.mainImage || '',
        key: existingProperty?.coverImageKey || existingProperty?.mainImageKey || ''
    });

    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [formData, setFormData] = useState({
        propertyName: existingProperty?.propertyName || '',
        propertyCategory: existingProperty?.propertyCategory || '',
        relationToProperty: existingProperty?.relationToProperty || '',
        flatSize: existingProperty?.flatSize || '',
        size: existingProperty?.size ? String(existingProperty.size) : '',
        lengthFt: existingProperty?.lengthFt || '',
        widthFt: existingProperty?.widthFt || '',
        address: existingProperty?.address || '',
        landmark: existingProperty?.landmark || '',
        city: existingProperty?.city || '',
        googleMapLink: existingProperty?.googleMapLink || '',
        expectedPrice: existingProperty?.expectedPrice ? String(existingProperty.expectedPrice) : '',
        sellingPreference: existingProperty?.sellingPreference || 'Normal',
        description: existingProperty?.description || '',
        mainVideoUrl: existingProperty?.mainVideoUrl || '',
        ownerName: existingProperty?.ownerName || '',
        ownerMobileNumber: existingProperty?.ownerMobileNumber || '',
    });

    const updateField = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const [deletedMediaIds, setDeletedMediaIds] = useState([]);
    const [newImages, setNewImages] = useState([]);

    const uploadedImagesSession = useRef([]); // Track all images uploaded in this session
    const isSubmitted = useRef(false); // Track if form is successfully submitted

    // Modal Logic for Dropdown
    const [activeModalField, setActiveModalField] = useState(null);
    const openModal = (field) => setActiveModalField(field);
    const closeModal = () => setActiveModalField(null);

    const relationList = ["owner", "relative", "friend", "broker"];

    const getModalData = () => {
        if (activeModalField === 'relationToProperty') return relationList;
        return [];
    };

    const handleSelection = (item) => {
        const value = item.value || item;
        updateField(activeModalField, value);
        closeModal();
    };

    // UI-Only handlers for batch update
    const handleDeleteImage = (id) => {
        Alert.alert("Delete Image", "Remove this image?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete", style: "destructive", onPress: () => {
                    // Check if it's an existing image (has UUID) or a newly added one (local only)
                    const isExisting = existingProperty?.media?.find(m => m.id === id || m._id === id);

                    if (isExisting) {
                        setDeletedMediaIds(prev => [...prev, id]);
                    } else {
                        // It's a newly added image in this session, remove from newImages
                        setNewImages(prev => prev.filter(img => img.key !== id));
                    }

                    // Remove from UI list
                    setMediaList(prev => prev.filter(img => img._id !== id && img.id !== id && img.key !== id));
                }
            }
        ]);
    };

    const handleAddImage = async () => {
        if (mediaList.length >= 5) {
            Alert.alert("Limit Reached", "Max 5 images.");
            return;
        }
        const uri = await pickImage();
        if (!uri) return;

        setUploading(true);
        try {
            const res = await uploadImage(uri);
            if (res && res.data && res.data.data) {
                const uploadedData = res.data.data; // { url, key, publicId }

                // console.log("[EditProperty] Image Uploaded:", uploadedData.url);
                uploadedImagesSession.current.push(uploadedData.key); // Track for cleanup
                addOrphanedKey(uploadedData.key); // Persistent tracking

                const newImageObj = {
                    imageUrl: uploadedData.url,
                    imageKey: uploadedData.key,
                    isPrimary: false
                };

                // Add to newImages state
                setNewImages(prev => [...prev, newImageObj]);

                // Add to visual list
                // We use 'key' as temporary ID for deletion handling before save
                setMediaList(prev => [...prev, { ...newImageObj, _id: uploadedData.key, key: uploadedData.key }]);
            }
        } catch (e) {
            console.error(e);
            Alert.alert("Error", "Failed to add image");
        } finally {
            setUploading(false);
        }
    };

    const handleChangeCoverImage = async () => {
        const uri = await pickImage();
        if (!uri) return;

        setUploading(true);
        try {
            const res = await uploadImage(uri);
            if (res && res.data && res.data.data) {
                const uploadedData = res.data.data; // { url, key }

                // console.log("[EditProperty] Cover Image Uploaded:", uploadedData.url);
                uploadedImagesSession.current.push(uploadedData.key); // Track for cleanup
                addOrphanedKey(uploadedData.key); // Persistent tracking

                // DEFERRED UPDATE: Update local state ONLY. Do not call API yet.
                setCoverImageState({
                    url: uploadedData.url,
                    key: uploadedData.key
                });
            }
        } catch (error) {
            console.error("Change Cover Image / Upload Error:", error);
            const msg = error.response?.data?.message || "Failed to upload cover image.";
            Alert.alert("Error", msg);
        } finally {
            setUploading(false);
        }
    };

    const handleSaveChanges = async () => {
        setUploading(true);
        try {
            const propertyId = existingProperty?.id || existingProperty?._id;
            if (!propertyId) {
                Alert.alert("Error", "Property ID missing");
                return;
            }

            // Construct Property Object
            const propertyData = {
                propertyName: formData.propertyName,
                propertyCategory: formData.propertyCategory,
                relationToProperty: formData.relationToProperty,
                flatSize: formData.flatSize,
                size: formData.size,
                lengthFt: formData.lengthFt,
                widthFt: formData.widthFt,
                address: formData.address,
                landmark: formData.landmark,
                city: formData.city,
                googleMapLink: formData.googleMapLink,
                expectedPrice: Number(formData.expectedPrice), // Parse as number
                sellingPreference: formData.sellingPreference,
                description: formData.description,
                mainVideoUrl: formData.mainVideoUrl,
                ownerName: formData.ownerName,
                ownerMobileNumber: formData.ownerMobileNumber
            };

            // Composite Payload
            const payload = {
                property: propertyData,
                deleteMediaIds: deletedMediaIds,
                newImages: newImages,
            };

            // console.log("Saving Changes Payload:", JSON.stringify(payload, null, 2));

            // Call update API (which now handles this composite structure)
            await updateProperty(propertyId, payload);

            // DEFERRED COVER IMAGE UPDATE Check
            // If local state is different from existing, call the update API now
            const originalCoverKey = existingProperty?.coverImageKey || existingProperty?.mainImageKey;
            if (coverImageState.key && coverImageState.key !== originalCoverKey) {
                // console.log("[EditProperty] Saving new cover image...");
                const coverPayload = {
                    imageUrl: coverImageState.url,
                    imageKey: coverImageState.key
                };
                await updatePropertyCoverImage(propertyId, coverPayload);
            }

            Alert.alert("Success", "Property updated successfully!", [
                {
                    text: "OK", onPress: () => {
                        isSubmitted.current = true;
                        // Determine which images are now permanent
                        // 1. Any image in newImages is permanent
                        newImages.forEach(img => removeOrphanedKey(img.imageKey));
                        // 2. The new cover image (if changed) is permanent
                        if (coverImageState.key && coverImageState.key !== originalCoverKey) {
                            removeOrphanedKey(coverImageState.key);
                        }

                        dispatch(fetchPropertyByIdAsync(propertyId));
                        dispatch(fetchPropertiesAsync());
                        navigation.goBack();
                    }
                }
            ]);

        } catch (error) {
            console.error("Update Error:", error);
            Alert.alert("Error", "Failed to update property.");
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteProperty = () => {
        Alert.alert(
            "Delete Property",
            "Are you sure you want to delete this property? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        setDeleting(true);
                        try {
                            const propertyId = existingProperty?.id || existingProperty?._id;
                            if (!propertyId) {
                                Alert.alert("Error", "Property ID not found");
                                return;
                            }
                            await deleteProperty(propertyId);
                            dispatch(fetchListingPropertiesAsync({ page: 1, limit: 10 })); // Refresh listing
                            dispatch(fetchPropertiesAsync()); // Refresh home screen
                            Alert.alert("Success", "Property deleted successfully", [
                                { text: "OK", onPress: () => navigation.popToTop() }
                            ]);
                        } catch (error) {
                            console.error("Delete Error:", error);
                            Alert.alert("Error", `Failed to delete property. ${error.message || ''}`);
                        } finally {
                            setDeleting(false);
                        }
                    }
                }
            ]
        );
    };

    // Cleanup effect using useFocusEffect to catch Tab Switching and Back Navigation
    useFocusEffect(
        useCallback(() => {
            // Screen Focused
            return () => {
                // Screen Blurred (Tab switch, Back, or Navigate away)
                if (!isSubmitted.current && uploadedImagesSession.current.length > 0) {
                    // console.log("[EditProperty] Screen blurred/unmounted without submission. Cleanup started.");

                    const imagesToDelete = [...uploadedImagesSession.current];
                    uploadedImagesSession.current = []; // Prevent double delete

                    imagesToDelete.forEach(async (key) => {
                        try {
                            // console.log("[EditProperty] Deleting orphaned image:", key);
                            await deleteImage(key);
                            await removeOrphanedKey(key);
                            // console.log("[EditProperty] Successfully deleted:", key);
                        } catch (error) {
                            // console.error("[EditProperty] Failed to cleanup image:", key, error);
                        }
                    });
                }
            };
        }, [])
    );

    if (!existingProperty) return null;

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={26} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Property</Text>
                <View style={{ width: 26 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Property Name</Text>
                    <TextInput style={styles.input} value={formData.propertyName} onChangeText={(v) => updateField("propertyName", v)} />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Property Category</Text>
                    <TextInput style={styles.input} value={formData.propertyCategory} editable={false} />
                    <Text style={{ fontSize: 10, color: '#888' }}>Category cannot be changed here</Text>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Relation to Property</Text>
                    <TouchableOpacity style={styles.dropdownInput} onPress={() => openModal('relationToProperty')}>
                        <Text style={[styles.inputText, !formData.relationToProperty && styles.placeholder]}>
                            {formData.relationToProperty || "Select"}
                        </Text>
                        <Entypo name="chevron-down" size={22} color="#333" />
                    </TouchableOpacity>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Size</Text>
                    <TextInput style={styles.input} value={formData.size} onChangeText={v => updateField("size", v)} />
                </View>

                <View style={styles.dimensionContainer}>
                    <View style={styles.dimWrapper}>
                        <Text style={styles.label}>Length (ft)</Text>
                        <TextInput style={styles.input} value={formData.lengthFt} onChangeText={v => updateField("lengthFt", v)} keyboardType="numeric" />
                    </View>
                    <View style={styles.dimWrapper}>
                        <Text style={styles.label}>Width (ft)</Text>
                        <TextInput style={styles.input} value={formData.widthFt} onChangeText={v => updateField("widthFt", v)} keyboardType="numeric" />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Address</Text>
                    <TextInput style={styles.input} value={formData.address} onChangeText={v => updateField("address", v)} />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>City</Text>
                    <TextInput style={styles.input} value={formData.city} onChangeText={v => updateField("city", v)} />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Landmark</Text>
                    <TextInput style={styles.input} value={formData.landmark} onChangeText={v => updateField("landmark", v)} />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Google Map Link</Text>
                    <TextInput style={styles.input} value={formData.googleMapLink} onChangeText={v => updateField("googleMapLink", v)} placeholder="Paste Link" placeholderTextColor="#aaa" />
                </View>

                {/* Cover Image Section */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Cover Image</Text>
                    {coverImageState.url ? (
                        <View style={styles.uploadedImageWrapper}>
                            <Image source={{ uri: coverImageState.url }} style={styles.uploadedImage} />
                            <TouchableOpacity style={styles.editIcon} onPress={handleChangeCoverImage} disabled={uploading}>
                                <MaterialIcons name="edit" size={16} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.uploadButton} onPress={handleChangeCoverImage} disabled={uploading}>
                            {uploading ? <ActivityIndicator color="#fff" /> : <MaterialIcons name="add-photo-alternate" size={20} color="#fff" />}
                            <Text style={styles.uploadButtonText}>{uploading ? "Uploading..." : "Add Cover Image"}</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Property Images (max 4)</Text>
                    <ScrollView horizontal style={{ marginTop: 8, marginBottom: 8, paddingTop: 8 }} contentContainerStyle={{ paddingRight: 10 }}>
                        {mediaList.map((img, idx) => (
                            <View key={img._id || img.id || idx} style={styles.uploadedImageWrapper}>
                                <Image source={{ uri: img.imageUrl || img.url }} style={styles.uploadedImage} />
                                <TouchableOpacity style={styles.deleteIcon} onPress={() => handleDeleteImage(img._id || img.id)}>
                                    <Ionicons name="close-circle" size={24} color="#ff4444" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>

                    {mediaList.length < 4 && (
                        <TouchableOpacity style={styles.uploadButton} onPress={handleAddImage} disabled={uploading}>
                            {uploading ? <ActivityIndicator color="#fff" /> : <MaterialIcons name="add-photo-alternate" size={20} color="#fff" />}
                            <Text style={styles.uploadButtonText}>{uploading ? "Adding..." : "Add Image"}</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput style={styles.textArea} multiline value={formData.description} onChangeText={v => updateField("description", v)} />
                </View>

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

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Price</Text>
                    <TextInput style={styles.input} value={formData.expectedPrice} onChangeText={v => updateField("expectedPrice", v)} keyboardType="numeric" />
                </View>

                <Text style={styles.sectionHeader}>Owner Details</Text>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput style={styles.input} value={formData.ownerName} onChangeText={v => updateField("ownerName", v)} />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mobile</Text>
                    <TextInput style={styles.input} value={formData.ownerMobileNumber} onChangeText={v => updateField("ownerMobileNumber", v)} keyboardType="phone-pad" />
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleSaveChanges} disabled={uploading}>
                    {uploading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Save Changes</Text>}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.submitButton, { backgroundColor: '#ff4444', marginTop: hp('2%') }]}
                    onPress={handleDeleteProperty}
                    disabled={deleting}
                >
                    {deleting ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.submitText}>Delete Property</Text>
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

export default EditPropertyScreen;

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row', alignItems: 'center', padding: wp('3.5%'), gap: 6,
        borderBottomWidth: 1, borderBottomColor: '#eee', justifyContent: 'space-between'
    },
    backBtn: { padding: 4 },
    headerTitle: { fontFamily: "Poppins-Bold", fontSize: wp('5%'), color: "#000" },
    scrollContainer: { padding: wp('4%'), paddingBottom: hp('7.5%') },
    inputGroup: { marginBottom: hp('2%') },
    label: { fontFamily: "Poppins-Medium", fontSize: wp('3.5%'), marginBottom: hp('0.75%'), color: '#333' },
    input: {
        fontFamily: "Poppins-Regular", fontSize: wp('3.8%'), borderWidth: 1, borderColor: '#ddd',
        borderRadius: 6, paddingHorizontal: wp('3%'), paddingVertical: hp('1.25%'), color: '#000',
    },
    textArea: {
        fontFamily: "Poppins-Regular", fontSize: wp('3.8%'), minHeight: hp('12.5%'), borderWidth: 1,
        borderColor: '#ddd', borderRadius: 6, paddingHorizontal: wp('3%'), paddingVertical: hp('1.25%'),
        textAlignVertical: 'top', color: '#000',
    },
    dimensionContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: hp('2%') },
    dimWrapper: { flex: 0.48 },
    sectionHeader: { fontFamily: "Poppins-Bold", fontSize: wp('4.5%'), color: '#000', marginTop: hp('1%'), marginBottom: hp('1.5%') },
    submitButton: { backgroundColor: '#3a75cd', paddingVertical: hp('1.75%'), borderRadius: 6, alignItems: 'center', marginTop: hp('2.25%') },
    submitText: { color: '#fff', fontSize: wp('4%'), fontFamily: "Poppins-Bold" },
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
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    deleteIcon: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#fff',
        borderRadius: 12,
    },
    editIcon: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#3a75cd',
        borderRadius: 12,
        padding: 4
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3a75cd',
        paddingVertical: hp('1.25%'),
        paddingHorizontal: wp('3%'),
        borderRadius: 6,
        gap: 6,
        alignSelf: 'flex-start'
    },
    uploadButtonText: {
        color: '#fff',
        fontFamily: "Poppins-Medium",
        fontSize: wp('3.5%'),
    },
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
    placeholder: { color: '#777' },
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
        borderBottomColor: '#f0f0f0',
    },
    modalItemText: {
        fontFamily: "Poppins-Regular",
        fontSize: wp('4%'),
        color: '#333',
    },
    closeBtn: {
        marginTop: 14,
        alignItems: 'center',
        padding: 10,
    },
    closeBtnText: {
        fontFamily: "Poppins-Bold",
        color: '#ff4444',
    }
});
