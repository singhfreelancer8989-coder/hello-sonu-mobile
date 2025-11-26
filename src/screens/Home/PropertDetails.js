import React from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

/* -------------------------
   HARDCODED PROPERTY DATA
--------------------------*/
const dummyProperties = [
    {
        id: 2,
        images: [
            "https://i.pinimg.com/1200x/98/4e/7a/984e7afee7eae7b9644453057e80f201.jpg",
            "https://images.unsplash.com/photo-1494526585095-c41746248156",
            "https://i.pinimg.com/736x/08/39/28/083928363559c12f69700ee25cab4117.jpg"
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
    {
        id: "P002",
        images: [
            "https://i.pinimg.com/1200x/98/4e/7a/984e7afee7eae7b9644453057e80f201.jpg",
            "https://images.unsplash.com/photo-1556911220-bff31c812dba",
        ],
        propertyType: "2 BHK Flat",
        demandPrice: "32,90,000",
        city: "Jaipur",
        address: "Mansarovar Ext., Jaipur",
        isVerified: false,
        size: "900 sq.ft",
        length: 30,
        width: 30,
        ownerName: "Sohan Singh",
        ownerPhone: "9988776655",
    },
    {
        id: "P003",
        images: [
            "https://images.unsplash.com/photo-1501183638710-841dd1904471",
            "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6",
        ],
        propertyType: "Luxury Villa",
        demandPrice: "1,85,00,000",
        city: "Ahmedabad",
        address: "SG Highway, Ahmedabad",
        isVerified: true,
        size: "2400 sq.ft",
        length: 40,
        width: 60,
        ownerName: "Karan Patel",
        ownerPhone: "9100012345",
    },
    {
        id: "P004",
        images: [
            "https://images.unsplash.com/photo-1507086182422-97bd7ca241fa",
            "https://images.unsplash.com/photo-1556912167-f556f1f39b24",
        ],
        propertyType: "Commercial Shop",
        demandPrice: "58,75,000",
        city: "Kota",
        address: "Aerodrome Circle, Kota",
        isVerified: false,
        size: "600 sq.ft",
        length: 20,
        width: 30,
        ownerName: "Ankit Garg",
        ownerPhone: "9090909090",
    },
];

const PropertyDetailsScreen = ({ route }) => {
    const { id } = { id: 2 };

    // Get the selected property
    const property = dummyProperties.find((p) => p.id === id);

    if (!property) {
        return (
            <View style={styles.center}>
                <Text style={{ fontSize: 18 }}>Property not found</Text>
            </View>
        );
    }

    const media = [
        { type: "image", url: "https://picsum.photos/800/400?1" },
        { type: "image", url: "https://picsum.photos/800/400?2" },
        { type: "image", url: "https://picsum.photos/800/400?3" },
        { type: "image", url: "https://picsum.photos/800/400?4" },
        { type: "image", url: "https://picsum.photos/800/400?5" },
        {
            type: "video",
            url: "https://www.w3schools.com/html/mov_bbb.mp4",
        },
    ];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* 🔹 IMAGE CAROUSEL */}
            <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
                {property.images.map((img, index) => (
                    <Image key={index} source={{ uri: img }} style={styles.image} />
                ))}
            </ScrollView>

            {/* <PropertyCarousel media={media} /> */}
            <View style={styles.header}>
                <Text style={styles.type}>{property.propertyType}</Text>

                {property.isVerified && (
                    <View style={styles.verifiedBadge}>
                        <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                        <Text style={styles.verifiedText}>Verified</Text>
                    </View>
                )}
            </View>

            {/* 🔹 CITY + ADDRESS */}
            <Text style={styles.city}>{property.city}</Text>
            <Text style={styles.address}>{property.address}</Text>

            {/* 🔹 PRICE */}
            <Text style={styles.price}>₹ {property.demandPrice}</Text>

            {/* 🔹 META BOX */}
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

            {/* 🔹 MAP PREVIEW */}
            <View style={styles.mapPreview}>
                <Ionicons name="map" size={20} color="#666" />
                <Text style={styles.mapText}>View on Map</Text>
            </View>

            {/* 🔹 OWNER BOX */}
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

            {/* 🔹 ACTION BUTTONS */}
            <View style={styles.btnRow}>
                <TouchableOpacity style={styles.btn}>
                    <Ionicons name="call-outline" size={20} color="#fff" />
                    <Text style={styles.btnText}>Call</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.btn, { backgroundColor: "#25D366" }]}>
                    <Ionicons name="logo-whatsapp" size={20} color="#fff" />
                    <Text style={styles.btnText}>WhatsApp</Text>
                </TouchableOpacity>
{/* 
                <TouchableOpacity style={styles.bookBtn}>
                    <Text style={styles.bookText}>Book Visit</Text>
                </TouchableOpacity> */}
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

export default PropertyDetailsScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },

    center: { flex: 1, justifyContent: "center", alignItems: "center" },

    image: { width: 385, height: 260 },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 14,
        paddingHorizontal: 16,
    },

    type: { fontSize: 20, fontWeight: "700", color: "#111" },

    verifiedBadge: {
        flexDirection: "row",
        backgroundColor: "#E8F8E8",
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 14,
        alignItems: "center",
    },

    verifiedText: { marginLeft: 4, color: "#2E7D32", fontWeight: "600" },

    city: {
        fontSize: 16,
        color: "#666",
        paddingHorizontal: 16,
        marginTop: 4,
    },

    address: {
        fontSize: 14,
        color: "#777",
        paddingHorizontal: 16,
        marginTop: 2,
    },

    price: {
        fontSize: 26,
        fontWeight: "700",
        color: "#5D5FEF",
        paddingHorizontal: 16,
        marginVertical: 10,
    },

    metaBox: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 16,
        backgroundColor: "#F9F9F9",
        padding: 14,
        borderRadius: 12,
    },

    metaItem: { flexDirection: "row", alignItems: "center" },

    metaText: { marginLeft: 8, fontSize: 14, color: "#555" },

    mapPreview: {
        margin: 16,
        padding: 16,
        backgroundColor: "#F0F0F0",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 10,
    },

    mapText: { marginLeft: 10, fontSize: 14, color: "#555" },

    ownerBox: { marginTop: 10, paddingHorizontal: 16 },

    ownerTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },

    ownerRow: { flexDirection: "row", alignItems: "center" },

    ownerName: { fontSize: 16, fontWeight: "600" },

    ownerPhone: { color: "#444", marginTop: 2 },

    btnRow: {
        flexDirection: "row",
        justifyContent: "start",
        gap:10,
        marginTop: 22,
        paddingHorizontal: 16,
    },

    btn: {
        width: "32%",
        backgroundColor: "#5D5FEF",
        paddingVertical: 12,
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
    },

    btnText: { color: "#fff", fontWeight: "600" },

    bookBtn: {
        width: "32%",
        backgroundColor: "#333",
        paddingVertical: 12,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },

    bookText: { color: "#fff", fontWeight: "700" },
});
