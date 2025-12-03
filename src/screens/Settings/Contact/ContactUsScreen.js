import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Linking,
    ScrollView,
    Image,
    Platform
} from "react-native";
import { AntDesign, Feather, FontAwesome, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Make sure this path matches where your logo is stored
import images from '../../../assets/images'; 

const ContactUsScreen = () => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const openLink = (url) => Linking.openURL(url).catch(() => null);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Feather name="chevron-left" size={24} color="#2d3436" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Contact Us</Text>
            </View>

            <ScrollView 
                contentContainerStyle={styles.body} 
                showsVerticalScrollIndicator={false}
            >

                {/* --- BRANDING SECTION (Logo & Address) --- */}
                <View style={styles.brandingSection}>
                    <View style={styles.logoContainer}>
                        <Image 
                            source={images.mainLogo} 
                            style={styles.logo} 
                            resizeMode="contain" 
                        />
                    </View>
                    
                    <Text style={styles.companyName}>Ramratan Infra</Text>
                    
                    <View style={styles.addressContainer}>
                        <Ionicons name="location-outline" size={16} color="#636e72" style={{marginTop: 2}} />
                        <Text style={styles.addressText}>
                            Vinoba Gali, Khachrod 456224
                        </Text>
                    </View>
                </View>

                {/* --- CONNECT SECTION --- */}
                <Text style={styles.sectionTitle}>Get in Touch</Text>

                {/* WhatsApp */}
                <ContactItem
                    label="Chat on WhatsApp"
                    subLabel="+91 XXXXX XXXXX"
                    icon={<FontAwesome name="whatsapp" size={24} color="#fff" />}
                    iconBg="#25D366"
                    onPress={() => openLink("https://wa.me/message/NYY43FRJDUI4P1")}
                />

                {/* Call */}
                <ContactItem
                    label="Call Support"
                    subLabel="Mon - Sat, 9am - 6pm"
                    icon={<Feather name="phone-call" size={22} color="#fff" />}
                    iconBg="#4834d4" // Primary Blue
                    onPress={() => openLink("tel:+916264779078")}
                />

                {/* Instagram */}
                <ContactItem
                    label="Follow on Instagram"
                    subLabel="@hellosonu_"
                    icon={<AntDesign name="instagram" size={24} color="#fff" />}
                    iconBg="#C13584"
                    onPress={() => openLink("https://www.instagram.com/hellosonu_/")}
                />

                {/* Facebook */}
                <ContactItem
                    label="Like us on Facebook"
                    subLabel="Hello Sonu | Khachrod"
                    icon={<FontAwesome name="facebook-f" size={22} color="#fff" />}
                    iconBg="#4267B2"
                    onPress={() => openLink("https://www.facebook.com/SonuBhaiyaaaa")}
                />

                {/* Website */}
                <ContactItem
                    label="Visit Website"
                    subLabel="www.hellosonu.in"
                    icon={<Feather name="globe" size={22} color="#fff" />}
                    iconBg="#2d3436"
                    onPress={() => openLink("https://hellosonu.in")}
                />

                {/* Bottom Spacer */}
                <View style={{ height: 40 }} />
                
            </ScrollView>
        </View>
    );
};

const ContactItem = ({ icon, label, subLabel, onPress, iconBg }) => {
    return (
        <TouchableOpacity style={styles.itemCard} onPress={onPress} activeOpacity={0.7}>
            <View style={[styles.iconWrapper, { backgroundColor: iconBg }]}>
                {icon}
            </View>
            <View style={styles.textWrapper}>
                <Text style={styles.itemLabel}>{label}</Text>
                {subLabel && <Text style={styles.itemSubLabel}>{subLabel}</Text>}
            </View>
            <Feather name="chevron-right" size={20} color="#b2bec3" />
        </TouchableOpacity>
    );
};

export default ContactUsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB", // Very light grey bg for modern feel
    },
    
    // Header
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    backButton: {
        padding: 5,
        marginLeft: -5,
    },
    headerTitle: {
        fontSize: 18,
        color: "#2d3436",
        marginLeft: 15,
        fontFamily: "Poppins-SemiBold",
    },

    body: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },

    // Branding Section
    brandingSection: {
        alignItems: 'center',
        marginBottom: 30,
        backgroundColor: '#fff',
        paddingVertical: 25,
        borderRadius: 16,
        // Shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    logoContainer: {
        height: 80,
        width: 150, // Adjustable based on your logo aspect ratio
        marginBottom: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    companyName: {
        fontSize: 22,
        fontFamily: "Poppins-Bold",
        color: "#2d3436",
        marginBottom: 5,
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    addressText: {
        fontSize: 14,
        fontFamily: "Poppins-Regular",
        color: "#636e72",
        textAlign: 'center',
        marginLeft: 5,
        lineHeight: 20,
    },

    // List Section
    sectionTitle: {
        fontSize: 16,
        fontFamily: "Poppins-SemiBold",
        color: "#b2bec3",
        marginBottom: 15,
        marginLeft: 5,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },

    // Item Card
    itemCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 12,
        borderRadius: 12,
        // Card Shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
        borderWidth: 1,
        borderColor: '#f1f2f6',
    },
    iconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    textWrapper: {
        flex: 1,
        marginLeft: 15,
    },
    itemLabel: {
        fontSize: 15,
        fontFamily: "Poppins-Medium",
        color: "#2d3436",
    },
    itemSubLabel: {
        fontSize: 12,
        fontFamily: "Poppins-Regular",
        color: "#b2bec3",
        marginTop: 2,
    },
});