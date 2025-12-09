import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const dummyProperties = [
    {
        id: 2,
        images: [
            "https://i.pinimg.com/1200x/98/4e/7a/984e7afee7eae7b9644453057e80f201.jpg",
            "https://i.pinimg.com/736x/08/39/28/083928363559c12f69700ee25cab4117.jpg",
            "https://images.unsplash.com/photo-1494526585095-c41746248156",
            "https://i.pinimg.com/736x/08/39/28/083928363559c12f69700ee25cab4117.jpg",
        ],
        propertyType: "Residential Plot",
        demandPrice: "42,50,000",
        city: "Udaipur",
        address: "Sector 14, Hiran Magri, Udaipur",
        isVerified: true,
        size: "1500 sq.ft",
        length: 30,
        width: 50,
        ownerName: "Ravi Kumar",
        ownerPhone: "9876543210",
    },
];

const PropertyDetailsScreen = ({ route }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const Navigator = useNavigation();
    const { id } = { id: 2 };
    const property = dummyProperties.find((p) => p.id === id);

    if (!property) {
        return (
            <View style={styles.center}>
                <Text style={{ fontSize: wp('4.5%') }}>Property not found</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.headerBar}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => Navigator.goBack()}
                >
                    <Ionicons name="chevron-back" size={26} color="#111" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Property Details</Text>
            </View>


            {/* ========== IMAGE CAROUSEL ========== */}
            <View style={styles.carouselContainer}>
                <Image
                    source={{ uri: property.images[currentIndex] }}
                    style={styles.image}
                    resizeMode="cover"
                />

                {/* LEFT BUTTON */}
                <TouchableOpacity
                    style={[styles.navBtn, { left: 10 }]}
                    onPress={() =>
                        setCurrentIndex((prev) =>
                            prev === 0 ? property.images.length - 1 : prev - 1
                        )
                    }
                >
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>

                {/* RIGHT BUTTON */}
                <TouchableOpacity
                    style={[styles.navBtn, { right: 10 }]}
                    onPress={() =>
                        setCurrentIndex((prev) =>
                            prev === property.images.length - 1 ? 0 : prev + 1
                        )
                    }
                >
                    <Ionicons name="chevron-forward" size={24} color="#fff" />
                </TouchableOpacity>

                {/* DOTS */}
                <View style={styles.dots}>
                    {property.images.map((_, i) => (
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

            {/* ========== HEADER ========== */}
            <View style={styles.header}>
                <Text style={styles.type}>{property.propertyType}</Text>

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

            {/* PRICE */}
            <Text style={styles.price}>₹ {property.demandPrice}</Text>

            {/* ========== META ========== */}
            <View style={styles.metaBox}>
                <View style={styles.metaItem}>
                    <FontAwesome5 name="ruler-combined" size={18} color="#555" />
                    <Text style={styles.metaText}>
                        {property.length} x {property.width} ft
                    </Text>
                </View>

                <View style={styles.metaItem}>
                    <MaterialIcons name="square-foot" size={20} color="#555" />
                    <Text style={styles.metaText}>{property.size}</Text>
                </View>
            </View>

            {/* ========== MAP PREVIEW ========== */}
            <View style={styles.mapPreview}>
                <Ionicons name="map" size={20} color="#666" />
                <Text style={styles.mapText}>View on Map</Text>
            </View>

            {/* ========== DESCRIPTION ========== */}
            <View style={styles.descriptionBox}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.descriptionText}>
                    This property is located in a prime residential area with wide roads,
                    nearby schools, hospitals, and public transport connectivity.
                    Ideal for personal use or investment with high future appreciation value.
                    The site has a clear title and is suitable for construction.
                </Text>
            </View>

            {/* ========== OWNER DETAILS ========== */}
            <View style={styles.ownerBox}>
                <Text style={styles.ownerTitle}>Owner Details</Text>
                <View style={styles.ownerRow}>
                    <Ionicons name="person-circle-outline" size={40} color="#333" />
                    <View style={{ marginLeft: 10 }}>
                        <Text style={styles.ownerName}>{property.ownerName}</Text>
                        <Text style={styles.ownerPhone}>📞 {property.ownerPhone}</Text>
                    </View>
                </View>
            </View>

            {/* ========== ACTION BUTTONS ========== */}
            <View style={styles.btnRow}>
                <TouchableOpacity style={styles.btn}>
                    <Ionicons name="call-outline" size={20} color="#fff" />
                    <Text style={styles.btnText}>Call</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.btn, { backgroundColor: "#25D366" }]}>
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
    headerBar: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: hp('1.75%'),
        paddingHorizontal: wp('3.5%'),
        borderBottomWidth: 1,
        borderColor: "#eee",
        gap: 8,
    },
    backBtn: {
        padding: wp('1.5%'),
        borderRadius: 8,
    },
    headerTitle: {
        fontSize: wp('4.5%'), // 18
        fontFamily: "Poppins-SemiBold",
        color: "#111",
    },
    /* IMAGE */
    carouselContainer: {
        width: "100%",
        height: hp('32%'), // 260
        position: "relative",
        backgroundColor: "#000",
    },
    image: {
        width: "100%",
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
