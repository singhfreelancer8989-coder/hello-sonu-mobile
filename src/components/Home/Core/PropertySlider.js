import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
// Assuming PropertyCard is in the same directory and is correctly implemented
import PropertyCard from "./PropertyCard";
import SkeletonPropertyCard from "./SkeletonPropertyCard";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const MAX_SLIDER_CARDS = 5;

const PropertySlider = ({ title = "Properties", data = [], category, loading = false }) => {
  const navigation = useNavigation();

  const handleSeeAllPress = () => {
    navigation.navigate('PropertyListing', {
      title: title,
      filters: category ? { property_category: category } : {}
    });
  };

  // 1. Slice the data to show only the first 5 cards
  const displayedData = data.slice(0, MAX_SLIDER_CARDS);

  // Determine if the "See All" button should be visible
  const shouldShowSeeAll = true; // Always show to allow "View All" access

  return (
    <View style={styles.section}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>

      {/* Horizontal List */}
      {loading ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {[1, 2, 3].map((item) => (
            <SkeletonPropertyCard key={item} style={{ marginRight: wp('4%') }} />
          ))}
        </ScrollView>
      ) : displayedData.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* 3. Map over the limited 'displayedData' */}
          {displayedData.map((item, index) => (
            <PropertyCard key={item.id || index} item={item} />
          ))}

          {/* 4. Append 'View All' Card */}
          {shouldShowSeeAll && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSeeAllPress}
              style={styles.viewAllCard}
            >
              <View style={styles.viewAllIconContainer}>
                <Ionicons name="arrow-forward" size={wp('6%')} color="#4834d4" />
              </View>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      ) : (
        <Text style={styles.emptyText}>No properties available.</Text>
      )}
    </View>
  );
};

export default PropertySlider;

const styles = StyleSheet.create({
  section: {
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: wp('3.75%'),
    marginBottom: 0,
    paddingVertical: hp('1.25%'),
  },

  sectionTitle: {
    fontSize: wp('4.5%'), // 18
    fontFamily: "Poppins-Bold",
    color: "#000",
  },

  scrollContent: {
    paddingHorizontal: wp('2.5%'),
    paddingBottom: hp('1.25%'),
  },

  emptyText: {
    paddingHorizontal: wp('3.75%'),
    color: "#555",
    fontFamily: "Poppins-Regular",
    fontSize: wp('3.5%'),
  },

  viewAllCard: {
    width: wp('35%'),
    marginRight: wp('4%'),
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    padding: wp('2.5%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },

  viewAllIconContainer: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('6%'),
    backgroundColor: '#e8e6fb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('1%'),
  },

  viewAllText: {
    fontSize: wp('3.5%'),
    fontFamily: "Poppins-Medium",
    color: "#4834d4",
  },
});