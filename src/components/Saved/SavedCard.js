import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SavedCard = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('PropertyDetailsScreen')}
    >
      {/* Image */}
      <Image
        source={{
          uri: 'https://i.pinimg.com/736x/6e/f8/a3/6ef8a3670220ea6fd0556bf77eec6b20.jpg',
        }}
        style={styles.image}
      />

      {/* Content */}
      <View style={styles.info}>
        <Text style={styles.title}>B-Farmhouse</Text>
        <Text style={styles.price}>₹ 12,00,000</Text>

        <Text style={styles.subText}>
          Surrounded by greenery • Peaceful location
        </Text>

        {/* Bookmark / Save action */}
        <TouchableOpacity style={styles.saveBtn}>
          <MaterialIcons name="bookmark" size={22} color="#3a75cd" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default SavedCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    height: 120,
    marginHorizontal: 16,
    marginVertical: 10,
    overflow: "hidden",

    // shadow
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },

  image: {
    width: 110,
    height: "100%",
  },

  info: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
    position: "relative",
  },

  title: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: "#000",
  },

  price: {
    fontFamily: "Poppins-Bold",
    fontSize: 15,
    marginTop: 2,
    color: "#3a75cd",
  },

  subText: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    marginTop: 5,
    color: "#666",
  },

  saveBtn: {
    position: "absolute",
    right: 10,
    top: 10,
    padding: 4,
  },
});
