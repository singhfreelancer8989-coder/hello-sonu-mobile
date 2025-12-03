import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Responsive Design
const { width } = Dimensions.get('window');
const PADDING_HORIZONTAL = width * 0.05;
const PADDING_VERTICAL_SECTION = width * 0.04;

const PrivacyPolicyScreen = ({ navigation }) => {

  const handleGoBack = () => {
    if (navigation?.goBack) navigation.goBack();
  };

  const lastUpdated = new Date().toLocaleDateString('en-US', {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8"/>


        {/* Header */}
        <View style={styles.customHeader}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacy Policy</Text>
        </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >

        {/* 1 — Introduction */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>1. Introduction</Text>
          <Text style={styles.paragraph}>
            Welcome to Hello-Sonu Mobile. We are deeply committed to safeguarding 
            your privacy and ensuring a seamless experience on our real estate 
            platform. This policy details our practices regarding the collection, 
            use, disclosure, and protection of your information.
          </Text>

          <Text style={styles.lastUpdatedText}>
            Last Updated: {lastUpdated}
          </Text>
        </View>

        {/* 2 — Data We Collect */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>2. Information We Collect</Text>

          <Text style={styles.listItem}>
            <Text style={styles.boldText}>Personal Data:{" "}</Text>
            Includes name, email (for OTP verification/registration),
            mobile/WhatsApp number, and location details (for listings).
          </Text>

          <Text style={styles.listItem}>
            <Text style={styles.boldText}>Property Data:{" "}</Text>
            Information submitted via the Sales Form, covering property type,
            size, location, price, and descriptions.
          </Text>

          <Text style={styles.listItem}>
            <Text style={styles.boldText}>Usage Data:{" "}</Text>
            Browsing history, liked/disliked properties, and in-app interactions,
            used for analytics.
          </Text>
        </View>

        {/* 3 — Use of Information */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>

          <Text style={styles.listItem}>
            <Text style={styles.boldText}>Service Provision:{" "}</Text>
            To enable user registration, secure OTP access,
            property listing, and integrated map services.
          </Text>

          <Text style={styles.listItem}>
            <Text style={styles.boldText}>Analytics & Improvement:{" "}</Text>
            For internal research, app optimization,
            and enhancing features like property filtration & categorization.
          </Text>

          <Text style={styles.listItem}>
            <Text style={styles.boldText}>Communication:{" "}</Text>
            To deliver transactional messages, push notifications,
            and updates on relevant property listings.
          </Text>
        </View>

        {/* 4 — Third Party Services */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>4. Third-Party Services</Text>

          <Text style={styles.paragraph}>
            <Text style={styles.boldText}>AI Assistant Chat: </Text>
            Our AI assistant uses external APIs such as OpenAI. Only required
            message data is transmitted, and these services operate under their
            respective privacy policies.
          </Text>

          <Text style={styles.paragraph}>
            <Text style={styles.boldText}>Google Map Services: </Text>
            Location data services are powered by Google Maps and
            abide by Google’s Privacy Policy.
          </Text>
        </View>

        {/* 5 — Security */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>5. Data Security</Text>
          <Text style={styles.paragraph}>
            We employ industry-standard security measures to protect your
            personal and property data from unauthorized access or misuse.
            Sensitive information such as OTP tokens is protected with encryption
            and strict internal protocols.
          </Text>
        </View>

        {/* Footer */}
        <Text style={styles.footerText}>
          Please review this policy regularly for updates. By using Hello-Sonu
          Mobile, you agree to these terms.
        </Text>
        <Text style={styles.footerText}>
          © {new Date().getFullYear()} Hello-Sonu Mobile. All rights reserved.
        </Text>

      </ScrollView>
    </>
  );
};


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  container: {
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingBottom: 20,
    backgroundColor: "#f8f8f8",
  },

  /** HEADER **/
  customHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: PADDING_HORIZONTAL,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    width: "100%",
  },
  backButton: {
    paddingRight: 15,
    paddingVertical: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Poppins-SemiBold",
    color: "#000",
  },

  /** SECTIONS **/
  cardSection: {
    marginBottom: PADDING_VERTICAL_SECTION,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: PADDING_HORIZONTAL,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },

  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    color: "#333",
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: "#4b5563",
    marginBottom: 8,
    fontFamily: "Poppins-Regular",
  },

  listItem: {
    fontSize: 14,
    lineHeight: 22,
    color: "#4b5563",
    marginBottom: 8,
    paddingLeft: 10,
    marginLeft: 5,
    borderLeftWidth: 3,
    borderLeftColor: "#4CAF50",
    fontFamily: "Poppins-Regular",
  },

  boldText: {
    color: "#1f2937",
    fontFamily: "Poppins-Bold",
  },

  lastUpdatedText: {
    fontSize: 12,
    color: "#6b7280",
    fontStyle: "italic",
    marginTop: 10,
    textAlign: "right",
    fontFamily: "Poppins-Regular",
  },

  /** FOOTER **/
  footerText: {
    textAlign: "center",
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 15,
    marginBottom: 5,
    fontFamily: "Poppins-Regular",
  },
});

export default PrivacyPolicyScreen;
