import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const LocationPickerOverlay = ({ onConfirm, disabled }) => {
  return (
    <View style={styles.bottomSheet}>
      <View style={styles.grabber} />
      
      <View style={styles.textContainer}>
        <Text style={styles.sheetTitle}>Set Location</Text>
        <Text style={styles.instructionsText}>
          Pan and zoom the map to set the exact property location.
        </Text>
      </View>

      <TouchableOpacity 
        style={[styles.confirmButton, disabled && styles.disabledButton]} 
        onPress={onConfirm}
        disabled={disabled}
      >
        <Text style={styles.confirmText}>
          Confirm Location
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: hp('4%'),
    paddingHorizontal: wp('6%'),
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    zIndex: 10,
  },
  grabber: {
    width: 40,
    height: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 16,
  },
  textContainer: {
    marginBottom: hp('2.5%'),
    alignItems: 'center',
  },
  sheetTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: wp('5%'),
    color: '#111',
    marginBottom: 4,
  },
  instructionsText: {
    fontFamily: 'Poppins-Regular',
    color: '#666',
    fontSize: wp('3.5%'),
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: '#3a75cd',
    paddingVertical: hp('2%'),
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: "#3a75cd",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc'
  },
  confirmText: {
    color: '#fff',
    fontFamily: 'Poppins-Bold',
    fontSize: wp('4%'),
    letterSpacing: 0.5,
  },
});

export default LocationPickerOverlay;
