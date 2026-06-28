import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LeafletMap from '../../../components/LeafletMap/LeafletMap';
import { getNearbyProperties } from '../../../services/property.service';
import { useLocation } from '../../../hooks/useLocation';
import { OLA_MAPS_API_KEY } from '@env';

const MapScreen = () => {
  const navigation = useNavigation();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const loadProperties = async () => {
    if (!location) return;
    setLoading(true);
    try {
      const response = await getNearbyProperties({
        latitude: location.latitude,
        longitude: location.longitude,
      });
      if (response && response.data) {
        setProperties(response.data);
      } else {
        setProperties([]);
      }
    } catch (error) {
      console.log('Error fetching properties for map:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [location]);

  // Removed solid header to allow full-screen map

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <View style={styles.mapContainer}>
        {/* The map itself */}
        {(() => {
          if (properties.length === 0 && !loading) return null; // Will show empty state overlay

          const mapMarkers = properties.map((property) => ({
            id: property._id || property.id,
            latitude: property.latitude,
            longitude: property.longitude,
            title: property.propertyName || "Property",
            price: property.price,
            category: property.propertyCategory || "default",
          }));

          if (location && location.latitude && location.longitude) {
            mapMarkers.push({
              id: 'user_location',
              latitude: location.latitude,
              longitude: location.longitude,
              title: 'Your Location',
            });
          }

          return (
            <LeafletMap
              mode="view"
              markers={mapMarkers}
              initialRegion={{
                latitude: location?.latitude || 20.5937,
                longitude: location?.longitude || 78.9629,
                latitudeDelta: 2,
                longitudeDelta: 2,
              }}
              olaMapsApiKey={OLA_MAPS_API_KEY}
              onMarkerPress={(id) => {
                if (id !== 'user_location') {
                  navigation.navigate('PropertyDetails', { propertyId: id });
                }
              }}
            />
          );
        })()}

        {/* Floating Controls Overlay */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.floatingBackButton}>
          <Ionicons name="chevron-back" size={26} color="#333" />
        </TouchableOpacity>

        <View style={styles.floatingTitlePill}>
          <Text style={styles.floatingTitleText}>Nearby Properties</Text>
        </View>

        {/* Loading / Empty States overlaid transparently */}
        {loading && (
          <View style={styles.overlayContainer}>
            <ActivityIndicator size="large" color="#3a75cd" />
          </View>
        )}

        {!loading && properties.length === 0 && (
          <View style={styles.overlayContainer}>
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No properties found with location data.</Text>
            </View>
          </View>
        )}

        {/* Floating Refresh Pill over Map */}
        {!loading && (
          <TouchableOpacity style={styles.floatingRefreshPill} onPress={loadProperties}>
            <Ionicons name="refresh" size={20} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.floatingRefreshText}>Search this Area</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};


export default MapScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#e0e0e0',
  },
  floatingBackButton: {
    position: 'absolute',
    top: hp('1.5%'),
    left: wp('4%'),
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    zIndex: 10,
  },
  floatingTitlePill: {
    position: 'absolute',
    top: hp('2%'),
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    zIndex: 10,
  },
  floatingTitleText: {
    fontSize: wp('4%'),
    color: '#333',
    fontFamily: 'Poppins-Bold',
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    zIndex: 5,
  },
  emptyCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  emptyText: {
    fontSize: wp('3.5%'),
    color: '#555',
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },
  floatingRefreshPill: {
    position: 'absolute',
    bottom: hp('4%'),
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: '#3a75cd',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: "#3a75cd",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    zIndex: 10,
  },
  floatingRefreshText: {
    color: '#fff',
    fontFamily: 'Poppins-Bold',
    fontSize: wp('3.8%'),
  }
});