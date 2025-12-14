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
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

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
    description: 'Filter and browse by Residential, Commercial or Land properties with intelligent categorization.',
  },
  {
    icon: '🗺️',
    title: 'Integrated Mapping',
    description: 'Seamless Google Map Services to check property locations and nearby amenities instantly.',
  },
  {
    icon: '🤖',
    title: 'AI Assistant Chat',
    description: 'Instant support from our AI Chat Assistant (powered by a third-party API) for real estate queries.',
  },
  {
    icon: '📈',
    title: 'Property Analytics',
    description: 'Gain valuable insights with detailed Property Analytics to make informed decisions.',
  },
  {
    icon: '🔔',
    title: 'Real-Time Updates',
    description: 'Push Notification alerts for new listings, offers, and price changes.',
  },
  {
    icon: '⚙️',
    title: 'CMS Integration',
    description: 'Managed by a robust CMS backend ensuring data accuracy and reliable updates across the platform.',
  },
];

const AboutUsScreen = ({ navigation }) => {
  const handleGoBack = () => {
    if (navigation?.goBack) navigation.goBack();
  };

  return (
    <>
      {/* HEADER */}
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Us</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>

        {/* HERO */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>👋 Welcome to Hello-Sonu Mobile</Text>
          <Text style={styles.tagline}>
            Your trusted partner in seamless property buying, selling, and management.
          </Text>
        </View>

        {/* MISSION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.paragraph}>
            Hello-Sonu Mobile is designed to revolutionize your real estate journey. We combine powerful
            listing tools with cutting-edge technology—from AI assistance to detailed analytics—to put the
            power of property search and sale directly in your hands. Whether you are looking for a home
            or selling commercial space, we make the process smart, fast, and simple.
          </Text>
        </View>

        {/* FEATURES */}
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

        {/* PROMISE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Commitment</Text>
          <Text style={styles.paragraph}>
            We are committed to providing you with the most secure, intuitive, and comprehensive real estate
            experience. Your success is our mission, and we continuously improve our platform to deliver
            the best results.
          </Text>
        </View>

        {/* FOOTER */}
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
    backgroundColor: '#f0f4f8',
  },
  container: {
    padding: wp('5%'),
    paddingBottom: hp('2.5%'),
    backgroundColor: '#f0f4f8',
  },

  /** TOP HEADER **/
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('5%'),
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: hp('2.5%'),
    width: '100%',
  },
  backButton: {
    paddingRight: wp('3.75%'),
    paddingVertical: hp('0.75%'),
  },
  headerTitle: {
    fontSize: wp('6%'), // 24
    color: '#000',
    fontFamily: 'Poppins-SemiBold',
  },

  /** HERO SECTION **/
  headerContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: wp('5%'),
    marginBottom: hp('3.5%'),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  title: {
    fontSize: wp('6.5%'), // 26
    color: '#1e3a8a',
    marginBottom: hp('1%'),
    fontFamily: 'Poppins-Bold',
  },
  tagline: {
    fontSize: wp('4%'), // 16
    color: '#374151',
    lineHeight: wp('6%'),
    fontFamily: 'Poppins-Regular',
  },

  /** CONTENT BLOCKS **/
  section: {
    marginBottom: hp('3.5%'),
  },
  sectionTitle: {
    fontSize: wp('5%'), // 20
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: hp('1.25%'),
    borderBottomWidth: 2,
    borderBottomColor: '#d1d5db',
    paddingBottom: hp('0.6%'),
    fontFamily: 'Poppins-SemiBold',
  },
  paragraph: {
    fontSize: wp('3.5%'), // 14
    color: '#4b5563',
    lineHeight: wp('5.5%'),
    backgroundColor: '#ffffff',
    padding: wp('5%'),
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
    fontFamily: 'Poppins-Regular',
  },

  /** FEATURE BLOCK **/
  featureItem: {
    flexDirection: 'row',
    marginBottom: hp('1.8%'),
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: wp('3.75%'),
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    elevation: 1,
  },
  featureIcon: {
    fontSize: wp('5.5%'), // 22
    marginRight: wp('2.5%'),
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: wp('4%'), // 16
    color: '#1f2937',
    marginBottom: 3,
    fontFamily: 'Poppins-Medium',
  },
  featureDescription: {
    fontSize: wp('3.25%'), // 13
    color: '#6b7280',
    lineHeight: wp('4.5%'),
    fontFamily: 'Poppins-Regular',
  },

  /** FOOTER **/
  footerText: {
    textAlign: 'center',
    fontSize: wp('3%'), // 12
    color: '#9ca3af',
    marginBottom: hp('2.5%'),
    fontFamily: 'Poppins-Regular',
  },
});

export default AboutUsScreen;
