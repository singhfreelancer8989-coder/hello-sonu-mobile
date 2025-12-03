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
const MAX_SLIDER_CARDS = 5;
const handleSeeAllPress = (title, allData) => {
  console.log(`Navigating to "See All ${title}" page with ${allData.length} properties.`);
};


const PropertySlider = ({ title = "Properties", data = [] }) => {

  // 1. Slice the data to show only the first 5 cards
  const displayedData = data.slice(0, MAX_SLIDER_CARDS);

  // Determine if the "See All" button should be visible
  const shouldShowSeeAll = data.length > MAX_SLIDER_CARDS;

  return (
    <View style={styles.section}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>{title}</Text>

        {/* 2. Conditionally render the "See All" button */}
        {shouldShowSeeAll && (
          <TouchableOpacity onPress={() => handleSeeAllPress(title, data)}>
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
    paddingHorizontal: 15,
    marginBottom: 0,
    paddingVertical: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#000",
  },

  seeAll: {
    fontSize: 14,
    color: "#32CD32",
    fontFamily: "Poppins-Medium",
  },

  scrollContent: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },

  emptyText: {
    paddingHorizontal: 15,
    color: "#555",
    fontFamily: "Poppins-Regular",
  },
});