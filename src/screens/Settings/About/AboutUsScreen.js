import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



// Use Dimensions to create a responsive padding scale
const { width } = Dimensions.get('window');
const PADDING = width * 0.05;

// Define the key features and their descriptions
const features = [
  {
    icon: '✅',
    title: 'Secure Access & Registration',
    description: 'Robust OTP system for email verification and a simple Registration Form ensure a secure community.',
  },
  {
    icon: '🏠',
    title: 'Effortless Property Listing',
    description: 'Intuitive Sales Form to help property sellers list and manage their properties quickly and efficiently.',
  },
  {
    icon: '💾',
    title: 'Personalized Saving',
    description: 'Keep track of properties you’re interested in with the Property like/dislike saving feature.',
  },
  {
    icon: '🔍',
    title: 'Advanced Search & Categories',
    description: 'Intelligent filtration and category-wise listing to help you find Residential, Commercial, or Land properties faster.',
  },
  {
    icon: '🗺️',
    title: 'Integrated Mapping',
    description: 'Seamless Google Map Services to check property locations and nearby amenities instantly.',
  },
  {
    icon: '🤖',
    title: 'AI Assistant Chat',
    description: 'Instant support and expert guidance from our AI Chat Assistant (powered by a third-party API) for all your real estate queries.',
  },
  {
    icon: '📈',
    title: 'Property Analytics',
    description: 'Gain valuable insights with detailed Property Analytics to make informed decisions.',
  },
  {
    icon: '🔔',
    title: 'Real-Time Updates',
    description: 'Stay ahead with Push Notification services for alerts on new listings and price changes.',
  },
  {
    icon: '⚙️',
    title: 'CMS Integration',
    description: 'Backed by robust CMS Integration to ensure data accuracy and timely updates across the platform.',
  },
];

/**
 * Renders the About Us Screen, detailing the app's mission and key features.
 */
const AboutUsScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f4f8" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Header and Mission */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>👋 Welcome to Hello-Sonu Mobile</Text>
          <Text style={styles.tagline}>
            Your trusted partner in seamless property buying, selling, and management.
          </Text>
        </View>

        {/* Core Value Proposition */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.paragraph}>
            Hello-Sonu Mobile is designed to revolutionize your real estate experience. We combine powerful listing tools with cutting-edge technology—from AI assistance to detailed analytics—to put the power of property search and sale directly in your hands. Whether you are looking for your next home or selling a commercial space, we make the process clear, fast, and intelligent.
          </Text>
        </View>

        {/* Key Features Spotlight */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Powerful Features at Your Fingertips</Text>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Concluding Commitment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Commitment</Text>
          <Text style={styles.paragraph}>
            We are committed to providing you with the most comprehensive, secure, and user-friendly real estate platform. We continuously innovate to ensure your property journey is successful and stress-free.
          </Text>
        </View>

        <Text style={styles.footerText}>© {new Date().getFullYear()} Hello-Sonu Mobile. All rights reserved.</Text>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f8', // Light background for the screen
  },
  container: {
    padding: PADDING,
    paddingTop: 20,
    backgroundColor: '#f0f4f8',
  },
  headerContainer: {
    marginBottom: PADDING * 1.5,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: PADDING,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1e3a8a', // Dark blue
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#374151', // Gray
    lineHeight: 24,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: PADDING * 1.5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937', // Slightly darker text for titles
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#d1d5db',
    paddingBottom: 5,
  },
  paragraph: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 22,
    backgroundColor: '#ffffff',
    padding: PADDING,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6', // Accent blue
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 10,
    marginTop: 2,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 10,
    marginBottom: 20,
  },
});

export default AboutUsScreen;