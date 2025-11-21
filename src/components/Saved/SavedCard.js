import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Assuming you are using Expo for icons

const SavedCard = () => {
  return (
    <View style={styles.card}>
      <View style={styles.contentContainer}>
        {/* Left Section - Image and Back Button */}
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: 'https://i.pinimg.com/736x/6e/f8/a3/6ef8a3670220ea6fd0556bf77eec6b20.jpg' }} // Replace with your actual image URL or local asset
            style={styles.image}
            resizeMode="cover"
          />
          {/* Back Button Overlay */}
          <TouchableOpacity style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Right Section - Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>B- Farmhouse</Text>
          <Text style={styles.price}>Rs 12,00,000</Text>
          <Text style={styles.description}>
            Escape to your dream farmhouse surrounded by lush greenery and serene landscapes.
          </Text>
          <Text style={styles.details}>
            This spacious property features modern amenities, open fields, and peaceful living just minutes from the city.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    // Mimics the card's overall container and shadow/elevation
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 16,
    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android Elevation
    elevation: 5,
    overflow: 'hidden', // Ensures the border radius applies cleanly
  },
  contentContainer: {
    flexDirection: 'row', // Lays out the image and text side-by-side
    width: '100%',
    minHeight: 200, // Ensure minimum height to fit content
  },
  imageWrapper: {
    width: '40%', // Adjust width as needed
    position: 'relative', // To position the back button absolutely
  },
  image: {
    flex: 1, // Fills the imageWrapper
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // White with slight transparency
    borderRadius: 50, // Makes it circular
    padding: 4,
  },
  textContainer: {
    width: '60%', // Adjust width as needed
    padding: 15,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#000',
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
  },
  details: {
    fontSize: 12,
    color: '#666',
  },
});

export default SavedCard;