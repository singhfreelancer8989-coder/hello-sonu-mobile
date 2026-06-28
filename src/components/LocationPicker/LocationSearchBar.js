import React, { useEffect } from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator, FlatList, Text, StyleSheet, LayoutAnimation, UIManager, Platform } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const LocationSearchBar = ({
  searchQuery,
  setSearchQuery,
  searching,
  handleSearch,
  handleMyLocation,
  showSuggestions,
  suggestions,
  handleSelectSuggestion
}) => {
  // Enable LayoutAnimation for Android
  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  // Wrapper for showing/hiding suggestions with animation
  const toggleSuggestions = (show) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    // showSuggestions state is managed by the parent, so we need to intercept it.
    // Wait, the parent manages showSuggestions. If we want it to animate, the parent should call it,
    // OR we just intercept it in a useEffect here!
  };

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [showSuggestions, suggestions.length]);

  return (
    <View style={styles.searchContainer}>
      <View style={{ flexDirection: 'row', width: '100%' }}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search city, area, etc."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity style={styles.clearIcon} onPress={() => {
              setSearchQuery('');
            }}>
              <Ionicons name="close-circle" size={18} color="#aaa" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.searchIcon} onPress={handleSearch}>
            {searching ? <ActivityIndicator size="small" color="#3a75cd" /> : <Feather name="search" size={20} color="#3a75cd" />}
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.myLocationButton} onPress={handleMyLocation}>
          <Ionicons name="locate" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.place_id || item.reference}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.suggestionItem} onPress={() => handleSelectSuggestion(item)}>
                <Ionicons name="location-outline" size={20} color="#666" style={{ marginRight: 10 }} />
                <Text style={styles.suggestionText} numberOfLines={2}>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    position: 'absolute',
    top: hp('8%'), // Clears the floating back button
    left: wp('5%'),
    right: wp('5%'),
    zIndex: 20,
    flexDirection: 'column',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 25, // Pill shape
    alignItems: 'center',
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: hp('1.2%'),
    fontFamily: 'Poppins-Regular',
    fontSize: wp('3.6%'),
    color: '#000',
  },
  clearIcon: {
    padding: 8,
  },
  searchIcon: {
    padding: 10,
    paddingRight: 15,
  },
  myLocationButton: {
    marginLeft: 10,
    backgroundColor: '#3a75cd',
    width: 48,
    height: 48,
    borderRadius: 24, // Circular
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  suggestionsContainer: {
    marginTop: 12,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    maxHeight: hp('35%'),
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f4',
  },
  suggestionText: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: wp('3.2%'),
    color: '#333',
  },
});

export default LocationSearchBar;
