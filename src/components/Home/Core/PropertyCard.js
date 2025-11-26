import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const PropertyCard = ({ item }) => {
  const Navigator = useNavigation();
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={()=>Navigator.navigate("PropertyDetails")}>
      
    <View style={styles.card}>
      {/* IMAGE */}
      <Image
        source={{ uri: item?.image }}
        style={styles.image}
      />

      {/* HEADER ROW */}
      <View style={styles.rowBetween}>
        <Text style={styles.type}>{item?.propertyType}</Text>

        {/* VERIFIED BADGE */}
        {(item?.isVerified || 1) && (
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        )}
      </View>

      {/* CITY NAME */}
      <Text style={styles.city}>{item?.city || "Unknown City"}</Text>

      {/* PRICE */}
      <Text style={styles.price}>₹ {item?.demandPrice}</Text>

      {/* META INFO */}
      <View style={styles.metaRow}>
        <Text style={styles.meta}>{item?.length} x {item?.width}</Text>
        <Text style={styles.meta}>{item?.size}</Text>
      </View>
    </View>
    </TouchableOpacity>
  );
};

export default PropertyCard;

const styles = StyleSheet.create({
  card: {
    width: 190,
    marginRight: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  image: {
    width: "100%",
    height: 120,
    borderRadius: 12,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },

  type: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
    maxWidth: 110,
  },

  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F8E8",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },

  verifiedText: {
    fontSize: 11,
    marginLeft: 2,
    color: "#2E7D32",
    fontWeight: "500",
  },

  city: {
    fontSize: 13,
    color: "#777",
    marginTop: 2,
  },

  price: {
    fontSize: 17,
    fontWeight: "700",
    color: "#5D5FEF",
    marginVertical: 4,
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },

  meta: {
    fontSize: 12,
    color: "#555",
  },
});
