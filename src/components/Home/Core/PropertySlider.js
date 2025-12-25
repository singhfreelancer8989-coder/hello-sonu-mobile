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
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from "@react-navigation/native";

const MAX_SLIDER_CARDS = 5;

const PropertySlider = ({ title = "Properties", data = [], category }) => {
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

        {/* 2. Conditionally render the "See All" button */}
        {shouldShowSeeAll && (
          <TouchableOpacity onPress={handleSeeAllPress}>
            <Text style={styles.seeAll}>See All →</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Horizontal List */}
      {displayedData.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* 3. Map over the limited 'displayedData' */}
          {displayedData.map((item, index) => (
            <PropertyCard key={item.id || index} item={item} />
          ))}
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

  seeAll: {
    fontSize: wp('3.5%'), // 14
    color: "#32CD32",
    fontFamily: "Poppins-Medium",
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
});