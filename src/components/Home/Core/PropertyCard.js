import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const PropertyCard = ({ item }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: "https://i.pinimg.com/1200x/7d/34/84/7d348438789ab4dc3ab666cbaeb0b225.jpg" }} style={styles.image} />

      <Text style={styles.type}>FarmHouse</Text>

      <Text style={styles.price}>50000</Text>

      <View style={styles.row}>
        <Text style={styles.meta}>200 🛏</Text>
        <Text style={styles.meta}>00 🛁</Text>
        <Text style={styles.meta}>1200 sqft</Text>
      </View>
    </View>
  );
};

export default PropertyCard;

const styles = StyleSheet.create({
  card: {
    width: 180,
    marginRight: 14,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 10,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 110,
    borderRadius: 12,
  },
  type: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#5D5FEF",
    marginTop: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  meta: {
    fontSize: 12,
    color: "#555",
  },
});
