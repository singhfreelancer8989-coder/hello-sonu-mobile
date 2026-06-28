import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Keyboard, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { OLA_MAPS_API_KEY } from '@env';
import LeafletMap from '../../components/LeafletMap/LeafletMap';
import axios from 'axios';
import { getUserLocation } from '../../services/location.service';

// Modular UI Components
import LocationPickerHeader from '../../components/LocationPicker/LocationPickerHeader';
import LocationSearchBar from '../../components/LocationPicker/LocationSearchBar';
import LocationPickerOverlay from '../../components/LocationPicker/LocationPickerOverlay';

const LocationPickerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const { initialLat, initialLng, returnScreen, onLocationSelected } = route.params || {};

  const [selectedLocation, setSelectedLocation] = useState(
    initialLat && initialLng ? { latitude: initialLat, longitude: initialLng } : null
  );
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [mapCenter, setMapCenter] = useState(
    initialLat && initialLng ? { latitude: initialLat, longitude: initialLng } : null
  );
  
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [initializing, setInitializing] = useState(!initialLat && !initialLng);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (!initialLat && !initialLng) {
      handleMyLocation(true);
    }
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    const timeoutId = setTimeout(async () => {
      setSearching(true);
      try {
        const response = await axios.get(`https://api.olamaps.io/places/v1/autocomplete?input=${encodeURIComponent(searchQuery)}&api_key=${OLA_MAPS_API_KEY}`, {
          headers: {
            'X-Request-Id': Date.now().toString()
          }
        });
        if (response.data && response.data.predictions && response.data.predictions.length > 0) {
          setSuggestions(response.data.predictions);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.log('Search error:', error);
      } finally {
        setSearching(false);
      }
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = () => {
    Keyboard.dismiss();
    if (suggestions.length > 0) {
      handleSelectSuggestion(suggestions[0]);
    }
  };

  const handleSelectSuggestion = (item) => {
    const newLocation = {
      latitude: parseFloat(item.geometry.location.lat),
      longitude: parseFloat(item.geometry.location.lng)
    };
    setMapCenter(newLocation);
    setSelectedLocation(newLocation);
    setSearchQuery(item.description.split(',')[0]); 
    setShowSuggestions(false);
    Keyboard.dismiss();
  };

  const handleMyLocation = async (isInitialLoad = false) => {
    setSearching(true);
    try {
      const loc = await getUserLocation();
      if (loc) {
        setUserLocation(loc);
        setMapCenter(loc);
        setSelectedLocation(loc);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not fetch your current location.');
    } finally {
      setSearching(false);
      if (isInitialLoad) setInitializing(false);
    }
  };

  const handleLocationSelected = (loc) => {
    setSelectedLocation(loc);
  };

  const handleConfirm = () => {
    if (!selectedLocation) {
      Alert.alert('No Location Selected', 'Please tap on the map to select a location.');
      return;
    }
    
    const locString = `${selectedLocation.latitude.toFixed(6)}, ${selectedLocation.longitude.toFixed(6)}`;
    
    // Most robust way: use the callback if provided
    if (onLocationSelected) {
      onLocationSelected(locString);
      navigation.goBack();
      return;
    }
    
    // Fallback if callback is stripped by React Navigation
    // Navigate back to the returning screen using nested routing
    if (returnScreen === 'Menu' || returnScreen === 'SalesForm') {
      navigation.navigate('MainTabs', {
        screen: 'Menu',
        params: { selectedLocation: locString }
      });
    } else if (returnScreen === 'EditProperty' || returnScreen === 'EditPropertyScreen') {
      navigation.navigate('MainTabs', {
        screen: 'SettingsStack', 
        params: { 
          screen: 'EditProperty', 
          params: { selectedLocation: locString } 
        }
      });
    } else if (returnScreen) {
      navigation.navigate(returnScreen, {
        selectedLocation: locString
      });
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <LocationPickerHeader onBackPress={() => navigation.goBack()} />

      <View style={styles.mapContainer}>
        {initializing ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={{ marginTop: 12, color: '#555', fontFamily: 'Poppins-Medium' }}>Finding your location...</Text>
          </View>
        ) : (
          <>
            <LocationSearchBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searching={searching}
              handleSearch={handleSearch}
              handleMyLocation={() => handleMyLocation(false)}
              showSuggestions={showSuggestions}
              suggestions={suggestions}
              handleSelectSuggestion={handleSelectSuggestion}
            />

            <LeafletMap 
              mode="pick" 
              markers={userLocation ? [{ id: 'user_location', latitude: userLocation.latitude, longitude: userLocation.longitude, title: 'Your Location' }] : []}
              initialRegion={{
                latitude: mapCenter?.latitude || initialLat || 28.6139,
                longitude: mapCenter?.longitude || initialLng || 77.2090,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05
              }}
              centerPosition={mapCenter}
              onLocationSelected={handleLocationSelected} 
              olaMapsApiKey={OLA_MAPS_API_KEY}
            />
            
            <LocationPickerOverlay 
              onConfirm={handleConfirm}
              disabled={!selectedLocation}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#eee' // Placeholder while webview loads
  },
});

export default LocationPickerScreen;
