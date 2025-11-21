import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import PropertyCard from "./PropertyCard";

const PropertySlider = ({ title, data }) => {
  return (
    <View style={styles.section}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All →</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal List */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroller}>
        {data.map((item, index) => (
          <PropertyCard key={index}/>
        ))}
      </ScrollView>
    </View>
  );
};

export default PropertySlider;

const styles = StyleSheet.create({
  section: { marginTop: 15 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginBottom: 10,
    paddingVertical:10
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  seeAll: {
    fontSize: 14,
    color: "#32CD32",
    fontWeight: "600",
  },

  card: {
    width: 200,
    marginLeft: 15,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 130,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  cardBody: { paddingHorizontal: 10, paddingTop: 8 },
  type: { fontSize: 14, color: "#555" },
  price: { fontSize: 16, color: "#8A2BE2", fontWeight: "700", marginVertical: 3 },

  featuresRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  featureText: { fontSize: 12, color: "#555" },
  scroller:{padding:5}
});
