import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const PropertyCard = ({ item }) => {
  const Navigator = useNavigation();
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={() => Navigator.navigate("PropertyDetails")}>

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
    width: wp('47.5%'), // 190 typical
    marginRight: wp('4%'),
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: wp('2.5%'),
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  image: {
    width: "100%",
    height: hp('15%'), // 120
    borderRadius: 12,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: hp('1%'),
  },

  type: {
    fontSize: wp('3.25%'), // 13
    fontFamily: "Poppins-Medium",
    color: "#111",
    maxWidth: wp('27.5%'),
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
    fontSize: wp('2.75%'), // 11
    marginLeft: 2,
    color: "#2E7D32",
    fontFamily: "Poppins-Regular"
  },

  city: {
    fontSize: wp('3.25%'), // 13
    fontFamily: "Poppins-Regular",
    color: "#777",
  },

  price: {
    fontSize: wp('4.25%'), // 17
    fontFamily: "Poppins-Bold",
    color: "#5D5FEF",
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },

  meta: {
    fontSize: wp('3%'), // 12
    color: "#555",
    fontFamily: "Poppins-Regular",
  },
});
