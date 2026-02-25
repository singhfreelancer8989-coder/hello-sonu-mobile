import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import { savePropertyAsync, removeSavedPropertyAsync } from '../../../store/slices/propertySlices';
import useAuth from '../../../hooks/useAuth';

const PropertyCard = ({ item, style }) => {
  const Navigator = useNavigation();
  const dispatch = useDispatch();
  const { userData } = useAuth();
  const { savedPropertyIds } = useSelector((state) => state.property);

  const propertyId = item?.id || item?._id;
  const isSaved = savedPropertyIds.includes(propertyId);

  const handleSaveToggle = () => {
    if (!userData) {
      Alert.alert("Login Required", "Please login to save properties.");
      return;
    }
    const payload = {
      userId: userData.id || userData._id,
      propertyId: propertyId
    };

    if (isSaved) {
      dispatch(removeSavedPropertyAsync(payload));
    } else {
      dispatch(savePropertyAsync(payload));
    }
  };

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={() => Navigator.navigate("PropertyDetails", { propertyId: propertyId })}>

      <View style={[styles.card, style]}>
        {/* IMAGE */}
        <Image
          source={{ uri: item?.coverImageUrl || item?.mainImage || item?.images?.[0]?.url || item?.image }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* SAVE BUTTON OVERLAY */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSaveToggle} activeOpacity={0.7}>
          <MaterialIcons
            name={isSaved ? "bookmark" : "bookmark-border"}
            size={wp('5%')}
            color={isSaved ? "#3a75cd" : "#fff"}
          />
        </TouchableOpacity>

        {/* HEADER ROW */}
        <View style={styles.rowBetween}>
          {/* Title takes available space */}
          <Text numberOfLines={1} style={styles.type}>{item?.propertyName || item?.propertyCategory || item?.propertyType}</Text>

          {/* VERIFIED BADGE */}
          {(item?.isVerified) && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}
        </View>

        {/* CITY NAME */}
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color="#777" />
          <Text numberOfLines={1} style={styles.city}>{item?.city || "Unknown City"}</Text>
        </View>

        {/* PRICE */}
        <Text numberOfLines={1} adjustsFontSizeToFit style={styles.price}>₹ {item?.expectedPrice || item?.demandPrice}</Text>

        {/* META INFO */}
        <View style={styles.metaRow}>
          <Text numberOfLines={1} style={[styles.meta, { flex: 1, marginRight: 4 }]}>
            {item?.widthFt || item?.width} x {item?.lengthFt || item?.length}
          </Text>
          <Text numberOfLines={1} style={[styles.meta, { flex: 0.8, textAlign: 'right' }]}>{item?.size}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PropertyCard;

const styles = StyleSheet.create({
  card: {
    width: wp('47.5%'), // Default width for horizontal list
    marginRight: wp('4%'),
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: wp('2.5%'),
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 5, // Small bottom margin for shadow visibility
  },

  image: {
    width: "100%",
    height: hp('14%'),
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: hp('1%'),
  },

  type: {
    fontSize: wp('3%'),
    fontFamily: "Poppins-Medium",
    color: "#333",
    flex: 1,
    marginRight: 4,
  },

  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F8E8",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },

  verifiedText: {
    fontSize: wp('2.5%'),
    marginLeft: 2,
    color: "#2E7D32",
    fontFamily: "Poppins-Regular"
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  city: {
    fontSize: wp('3%'),
    fontFamily: "Poppins-Regular",
    color: "#777",
    marginLeft: 4,
    flex: 1,
  },

  price: {
    fontSize: wp('4%'),
    fontFamily: "Poppins-Bold",
    color: "#5D5FEF",
    marginTop: 6,
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 8,
  },

  meta: {
    fontFamily: "Poppins-Regular",
  },

  saveBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.2)', // Semi-transparent bg for visibility on image
    padding: 6,
    borderRadius: 20,
    zIndex: 10,
  }
});
