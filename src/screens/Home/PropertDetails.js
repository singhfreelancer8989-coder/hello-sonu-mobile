import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Linking,
    Alert,
    FlatList,
    RefreshControl
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from "react-redux";
import { fetchPropertyByIdAsync, clearCurrentProperty, savePropertyAsync, removeSavedPropertyAsync, fetchListingPropertiesAsync, fetchPropertiesAsync } from "../../store/slices/propertySlices";
import { deleteProperty } from "../../services/property.service";
import useAuth from "../../hooks/useAuth";
import { showErrorAlert } from "../../utility/error.utility";

const PropertyDetailsScreen = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();
    const { userData } = useAuth(); // Get logged-in user

    const { propertyId } = route.params || {}; // Get ID from navigation params

    // Redux State
    const { currentProperty, currentPropertyStatus, savedPropertyIds } = useSelector((state) => state.property);

    // Check if saved
    // Check if saved
    const isSaved = savedPropertyIds.includes(propertyId);

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        if (propertyId) {
            await dispatch(fetchPropertyByIdAsync(propertyId));
        }
        setRefreshing(false);
    }, [dispatch, propertyId]);

    // CAROUSEL REF
    const flatListRef = useRef(null);

    const handleNext = () => {
        if (images.length === 0) return;
        const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        setCurrentIndex(nextIndex);
    };

    const handlePrev = () => {
        if (images.length === 0) return;
        const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
        setCurrentIndex(prevIndex);
    };

    useEffect(() => {

        // // console.log("Fetching property with ID:", propertyId);
        if (propertyId) {
            dispatch(fetchPropertyByIdAsync(propertyId));
            // console.log(currentProperty)
        }
        return () => {
            dispatch(clearCurrentProperty());
        };
    }, [dispatch, propertyId]);



    // HANDLER: Toggle Save
    const toggleSave = async () => {
        // // console.log("userData", userData);
        if (!userData?.id && !userData?._id) {
            showErrorAlert("Login Required", "Please login to save properties.");
            return;
        }

        const payload = {
            userId: userData.id || userData._id,
            propertyId: propertyId
        };

        if (isSaved) {
            await dispatch(removeSavedPropertyAsync(payload));
        } else {
            await dispatch(savePropertyAsync(payload));
        }
    };



    // HANDLER: Admin Delete
    const handleAdminDelete = () => {
        Alert.alert(
            "Admin Delete",
            "Are you sure you want to delete this property? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            if (!propertyId) {
                                showErrorAlert("Error", "Property ID missing");
                                return;
                            }
                            await deleteProperty(propertyId);
                            dispatch(fetchListingPropertiesAsync({ page: 1, limit: 10 })); // Refresh listing
                            dispatch(fetchPropertiesAsync()); // Refresh home screen
                            Alert.alert("Success", "Property deleted by Admin", [
                                { text: "OK", onPress: () => navigation.popToTop() }
                            ]);
                        } catch (error) {
                            console.error("Admin Delete Error:", error);
                            showErrorAlert("Error", "Failed to delete property");
                        }
                    }
                }
            ]
        );
    };

    // HANDLER: Open YouTube
    const openVideo = () => {
        if (currentProperty?.mainVideoUrl) {
            Linking.openURL(currentProperty.mainVideoUrl).catch(err =>
                showErrorAlert("Error", "Could not open video link.")
            );
        }
    };

    // LOADING STATE
    if (currentPropertyStatus === 'loading' || !currentProperty) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#4834d4" />
            </View>
        );
    }

    const property = currentProperty;

    // IMAGES LOGIC
    const coverUrl = property.coverImageUrl || property.mainImage;
    let imageList = [];

    // Add media images
    if (property.media && Array.isArray(property.media)) {
        imageList = property.media.map(img => img.imageUrl);
    }

    // Add cover image if strictly unique
    if (coverUrl) {
        if (!imageList.includes(coverUrl)) {
            imageList.unshift(coverUrl);
        }
    }

    const images = imageList.length > 0
        ? imageList
        : ["https://via.placeholder.com/400x300?text=No+Image"];

    // HANDLER: Open WhatsApp with Country Code
    const openWhatsApp = () => {
        let phone = property.ownerMobileNumber || '';
        // Remove non-numeric characters
        phone = phone.replace(/\D/g, '');

        // Add India Country Code (91) if missing (assuming 10-digit number)
        if (phone.length === 10) {
            phone = '91' + phone;
        }

        const message = `Hi, I'm interested in your property: ${property.propertyName || ''}`;
        const url = `whatsapp://send?phone=${phone}&text=${message}`;

        Linking.openURL(url).catch(() => {
            showErrorAlert("Error", "Could not open WhatsApp. Make sure it is installed.");
        });
    };

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#4834d4"]} />
            }
        >
            {/* ========== HEADER BAR (Renamed to prevent conflict) ========== */}
            <View style={styles.topBar}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" size={26} color="#111" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Property Details</Text>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                    {/* EDIT BUTTON (Owner Only) */}
                    {((userData?.id && property?.userId && String(userData.id) === String(property.userId)) ||
                        (userData?._id && property?.userId && String(userData._id) === String(property.userId))) && (
                            <TouchableOpacity
                                style={{ padding: 6, marginRight: 0 }}
                                onPress={() => navigation.navigate('EditProperty', { property: property })}
                            >
                                <MaterialIcons name="edit" size={24} color="#111" />
                            </TouchableOpacity>
                        )}

                    {/* DELETE BUTTON (Admin Only) */}
                    {userData?.role === 'admin' && (
                        <TouchableOpacity
                            style={{ padding: 6, marginRight: 0 }}
                            onPress={handleAdminDelete}
                        >
                            <MaterialIcons name="delete" size={24} color="#ff4444" />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.saveBtnHeader} onPress={toggleSave}>
                        <MaterialIcons
                            name={isSaved ? "bookmark" : "bookmark-border"}
                            size={26}
                            color={isSaved ? "#3a75cd" : "#111"}
                        />
                    </TouchableOpacity>
                </View>
            </View>


            {/* ========== IMAGE CAROUSEL ========== */}
            <View style={styles.carouselContainer}>
                <FlatList
                    ref={flatListRef}
                    data={images}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={16}
                    keyExtractor={(_, index) => index.toString()}
                    getItemLayout={(data, index) => ({
                        length: wp('100%'),
                        offset: wp('100%') * index,
                        index,
                    })}
                    onScrollToIndexFailed={(info) => {
                        const wait = new Promise(resolve => setTimeout(resolve, 500));
                        wait.then(() => {
                            flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
                        });
                    }}
                    onMomentumScrollEnd={(event) => {
                        const index = Math.round(event.nativeEvent.contentOffset.x / wp('100%'));
                        setCurrentIndex(index);
                    }}
                    renderItem={({ item }) => (
                        <Image
                            source={{ uri: item }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    )}
                />

                {/* LEFT BUTTON */}
                <TouchableOpacity
                    style={[styles.navBtn, { left: 10 }]}
                    onPress={handlePrev}
                >
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>

                {/* RIGHT BUTTON */}
                <TouchableOpacity
                    style={[styles.navBtn, { right: 10 }]}
                    onPress={handleNext}
                >
                    <Ionicons name="chevron-forward" size={24} color="#fff" />
                </TouchableOpacity>

                {/* DOTS */}
                <View style={styles.dots}>
                    {images.map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.dot,
                                currentIndex === i && styles.activeDot,
                            ]}
                        />
                    ))}
                </View>
            </View>

            {/* ========== TITLE / TYPE ========== */}
            <View style={styles.header}>
                <Text style={styles.type}>{property.propertyName || property.propertyType}</Text>

                {property.isVerified && (
                    <View style={styles.verifiedBadge}>
                        <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                        <Text style={styles.verifiedText}>Verified</Text>
                    </View>
                )}
            </View>

            {/* CITY + ADDRESS */}
            <Text style={styles.city}>{property.city}</Text>
            <Text style={styles.address}>{property.address}</Text>
            {property.landmark ? <Text style={styles.address}>Landmark: {property.landmark}</Text> : null}

            {/* PRICE */}
            <Text style={styles.price}>₹ {property.expectedPrice || property.demandPrice}</Text>

            {/* ========== META ========== */}
            <View style={styles.metaBox}>
                {(property.length || property.lengthFt) && (
                    <View style={styles.metaItem}>
                        <FontAwesome5 name="ruler-combined" size={18} color="#555" />
                        <Text style={styles.metaText}>
                            {property.length || property.lengthFt} x {property.width || property.widthFt} ft
                        </Text>
                    </View>
                )}

                <View style={styles.metaItem}>
                    <MaterialIcons name="square-foot" size={20} color="#555" />
                    <Text style={styles.metaText}>{property.size || property.flatSize}</Text>
                </View>
            </View>

            {/* ========== ACTION BUTTONS (Video) ========== */}
            {property.mainVideoUrl ? (
                <TouchableOpacity style={styles.videoBtn} onPress={openVideo}>
                    <FontAwesome name="youtube-play" size={24} color="#fff" />
                    <Text style={styles.videoBtnText}>Watch Video</Text>
                </TouchableOpacity>
            ) : null}

            {/* ========== MAP PREVIEW / LINK ========== */}
            {property.googleMapLink && (
                <TouchableOpacity
                    style={styles.mapPreview}
                    onPress={() => Linking.openURL(property.googleMapLink).catch(err => showErrorAlert("Error", "Could not open map link."))}
                >
                    <Ionicons name="map" size={22} color="#3a75cd" />
                    <Text style={[styles.mapText, { color: '#3a75cd', fontFamily: 'Poppins-Medium' }]}>
                        View on Google Maps
                    </Text>
                    <Ionicons name="open-outline" size={18} color="#3a75cd" style={{ marginLeft: 'auto' }} />
                </TouchableOpacity>
            )}

            {/* ========== DESCRIPTION ========== */}
            <View style={styles.descriptionBox}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.descriptionText}>
                    {property.description || "No description provided."}
                </Text>
            </View>

            {/* ========== OWNER DETAILS ========== */}
            <View style={styles.ownerBox}>
                <Text style={styles.ownerTitle}>Owner Details</Text>
                <View style={styles.ownerRow}>
                    <Ionicons name="person-circle-outline" size={40} color="#333" />
                    <View style={{ marginLeft: 10 }}>
                        <Text style={styles.ownerName}>{property.ownerName || "Owner"}</Text>
                        <Text style={styles.ownerPhone}>📞 {property.ownerMobileNumber || property.ownerPhone}</Text>
                    </View>
                </View>
            </View>

            {/* ========== FOOTER ACTIONS ========== */}
            <View style={styles.btnRow}>
                <TouchableOpacity style={styles.btn} onPress={() => Linking.openURL(`tel:${property.ownerMobileNumber}`)}>
                    <Ionicons name="call-outline" size={20} color="#fff" />
                    <Text style={styles.btnText}>Call</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.btn, { backgroundColor: "#25D366" }]}
                    onPress={openWhatsApp}
                >
                    <Ionicons name="logo-whatsapp" size={20} color="#fff" />
                    <Text style={styles.btnText}>WhatsApp</Text>
                </TouchableOpacity>
            </View>

            <View style={{ height: hp('8%') }} />
        </ScrollView>
    );
};

export default PropertyDetailsScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    /* HEADER */
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between", // Spread back btn and title/save
        paddingVertical: hp('1.75%'),
        paddingHorizontal: wp('3.5%'),
        borderBottomWidth: 1,
        borderColor: "#eee",
    },
    backBtn: {
        padding: wp('1.5%'),
        borderRadius: 8,
    },
    saveBtnHeader: {
        padding: wp('1.5%'),
    },
    headerTitle: {
        fontSize: wp('4.5%'), // 18
        fontFamily: "Poppins-SemiBold",
        color: "#111",
    },
    /* VIDEO BTN */
    videoBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF0000',
        marginHorizontal: wp('4%'),
        marginTop: hp('2%'),
        paddingVertical: hp('1.5%'),
        borderRadius: 8,
        gap: 8,
    },
    videoBtnText: {
        color: '#fff',
        fontFamily: "Poppins-Medium",
        fontSize: wp('3.8%'),
    },
    /* IMAGE */
    carouselContainer: {
        width: "100%",
        height: hp('32%'), // 260
        position: "relative",
        backgroundColor: "#000",
    },
    image: {
        width: wp('100%'), // Full width for paging
        height: "100%",
    },

    navBtn: {
        position: "absolute",
        top: "50%",
        transform: [{ translateY: -20 }],
        width: wp('9%'),
        height: wp('9%'),
        borderRadius: 50,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },

    dots: {
        position: "absolute",
        bottom: 10,
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        gap: 6,
    },
    dot: {
        width: wp('2%'),
        height: wp('2%'),
        borderRadius: wp('1.5%'),
        backgroundColor: "rgba(255,255,255,0.4)",
    },
    activeDot: {
        backgroundColor: "#fff",
    },

    /* HEADER */
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: hp('1.75%'),
        paddingHorizontal: wp('4%'),
    },
    type: { fontSize: wp('5%'), fontFamily: "Poppins-SemiBold", color: "#111" }, // 20

    verifiedBadge: {
        flexDirection: "row",
        backgroundColor: "#E8F8E8",
        paddingHorizontal: wp('2.5%'),
        paddingVertical: hp('0.25%'),
        borderRadius: 14,
        alignItems: "center",
    },
    verifiedText: { marginLeft: 4, color: "#2E7D32", fontFamily: "Poppins-Regular", fontSize: wp('3.5%') },

    city: { fontSize: wp('4%'), color: "#666", paddingHorizontal: wp('4%'), marginTop: hp('0.5%'), fontFamily: "Poppins-Regular" },
    address: { fontSize: wp('3.5%'), color: "#777", paddingHorizontal: wp('4%'), marginTop: hp('0.25%'), fontFamily: "Poppins-Regular" },

    /* PRICE */
    price: {
        fontSize: wp('6.5%'), // 26
        fontFamily: "Poppins-Bold",
        color: "#5D5FEF",
        paddingHorizontal: wp('4%'),
        marginVertical: hp('1.25%'),
    },

    /* META */
    metaBox: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: wp('4%'),
        backgroundColor: "#F9F9F9",
        padding: wp('3.5%'),
        borderRadius: 12,
    },
    metaItem: { flexDirection: "row", alignItems: "center" },
    metaText: { marginLeft: 8, fontSize: wp('3.5%'), color: "#555", fontFamily: "Poppins-Regular" },

    /* MAP */
    mapPreview: {
        margin: wp('4%'),
        padding: wp('4%'),
        backgroundColor: "#F0F0F0",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 10,
    },
    mapText: { marginLeft: 10, fontSize: wp('3.5%'), color: "#555", fontFamily: "Poppins-Regular" },

    /* DESCRIPTION */
    descriptionBox: { marginTop: hp('1.75%'), paddingHorizontal: wp('4%') },
    sectionTitle: {
        fontSize: wp('4.5%'), // 18
        fontFamily: "Poppins-SemiBold",
        marginBottom: hp('0.75%'),
        color: "#222",
    },
    descriptionText: {
        fontSize: wp('3.5%'), // 14
        lineHeight: wp('5%'),
        color: "#555",
        textAlign: "left",
        fontFamily: "Poppins-Regular",
    },

    /* OWNER */
    ownerBox: { marginTop: hp('1.25%'), paddingHorizontal: wp('4%') },
    ownerTitle: { fontSize: wp('4.5%'), fontFamily: "Poppins-SemiBold", marginBottom: hp('1%') },
    ownerRow: { flexDirection: "row", alignItems: "center" },
    ownerName: { fontSize: wp('4%'), fontFamily: "Poppins-Medium" },
    ownerPhone: { color: "#444", marginTop: 2, fontSize: wp('3.5%') },

    /* ACTION BTN */
    btnRow: {
        flexDirection: "row",
        gap: wp('2.5%'),
        marginTop: hp('2.75%'),
        paddingHorizontal: wp('4%'),
    },
    btn: {
        width: "32%",
        backgroundColor: "#5D5FEF",
        paddingVertical: hp('1.5%'),
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
    },
    btnText: { color: "#fff", fontFamily: "Poppins-Medium", fontSize: wp('3.5%') },
});
