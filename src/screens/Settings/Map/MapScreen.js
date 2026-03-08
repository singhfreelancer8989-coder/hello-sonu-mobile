import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MapView, { Marker } from 'react-native-maps';
import { getNearbyProperties } from '../../../services/property.service';
import { useLocation } from '../../../hooks/useLocation';

const MapScreen = () => {
  const navigation = useNavigation();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const loadProperties = async () => {
  };

  useEffect(() => {
    if (!location) return;

    // console.log(location.latitude, location.longitude)

    const fetchProperties = async () => {
      setLoading(true);
      try {
        const response = await getNearbyProperties({
          // latitude: location.latitude,
          // longitude: location.longitude,
          latitude: 23.3315,
          longitude: 75.0367,
        });
        if (response && response.data) {
          // Filter out properties that don't have valid coordinates
          // console.log(response.data);
          setProperties(response.data);
        } else {
          setProperties([]);
        }
      } catch (error) {
        console.log("Error fetching properties for map:", error);
        setProperties([]);
      } finally {
        setLoading(false);
      }

    };

    fetchProperties();

  }, [location]);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Map at Hello Sonu</Text>
        <View style={{ width: 24 }} /> {/* Balance for back button */}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      {renderHeader()}

      <View style={styles.mapContainer}>
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#007bff" />
          </View>
        ) : properties.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>No properties found with location data.</Text>
            <TouchableOpacity style={styles.refreshButton} onPress={loadProperties}>
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            {/* User Current Location Marker */}
            {location && location.latitude && location.longitude && (
              <Marker
                coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                title="Your Location"
                pinColor="blue"
              />
            )}

            {properties.map((property, index) => {
              const { longitude, latitude } = property;
              return (
                <Marker
                  key={property._id || property.id || index.toString()}
                  coordinate={{ latitude, longitude }}
                  title={property.propertyName || "Property"}
                  description={property.price ? `₹${property.price}` : ""}
                  onCalloutPress={() => {
                    navigation.navigate('PropertyDetails', { propertyId: property._id || property.id });
                  }}
                />
              );
            })}
          </MapView>
        )}

        {/* Floating Refresh Button over Map */}
        {!loading && properties.length > 0 && (
          <TouchableOpacity style={styles.floatingRefresh} onPress={loadProperties}>
            <Ionicons name="refresh" size={24} color="#fff" />
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
  headerContainer: {
    backgroundColor: '#fff',
    paddingBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
  },
  headerTitle: {
    fontSize: wp('4.5%'),
    color: '#333',
    fontFamily: 'Poppins-Bold',
  },
  backButton: {
    padding: 4,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: wp('4%'),
    color: '#888',
    fontFamily: 'Poppins-Regular',
    marginBottom: 10,
  },
  refreshButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#fff',
    fontFamily: 'Poppins-Medium',
  },
  floatingRefresh: {
    position: 'absolute',
    bottom: hp('3%'),
    right: wp('5%'),
    backgroundColor: '#007AFF',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  }
});