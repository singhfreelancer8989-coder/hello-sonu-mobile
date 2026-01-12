import { StyleSheet, Text, View, ScrollView, RefreshControl } from 'react-native'
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import AppHeader from '../../components/Home/Layout/AppHeader'
import SearchFiltersHeader from '../../components/Home/Layout/SearchFiltersHeader';
import PropertySlider from '../../components/Home/Core/PropertySlider';
import { useDispatch, useSelector } from 'react-redux';
import { filterPropertiesByCategory } from '../../utility/propertyUtilities';
import { useEffect, useState, useCallback } from 'react';
import { fetchPropertiesAsync, fetchSavedPropertiesAsync } from '../../store/slices/propertySlices';

import useAuth from '../../hooks/useAuth';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const HomePageScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { userData } = useAuth();
  const properties = useSelector((state) => state.property.properties);
  const status = useSelector((state) => state.property.status);
  const [resetKey, setResetKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    // We don't necessarily set loading status to 'loading' if it's a background refresh on focus,
    // but fetchPropertiesAsync handles its own status.
    await dispatch(fetchPropertiesAsync());
    if (userData?.id || userData?._id) {
      dispatch(fetchSavedPropertiesAsync(userData.id || userData._id));
    }
  }, [dispatch, userData]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
      return () => {
        setResetKey((prev) => prev + 1);
      };
    }, [fetchData])
  );

  useEffect(() => {
    fetchData(); // Initial load
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);



  const handleSearch = (filters) => {
    navigation.navigate('PropertyListing', {
      filters: filters,
      title: 'Search Results'
    });
  };

  return (
    <View style={styles.root}>
      <AppHeader userName={userData ? `${userData.firstName} ${userData.lastName}` : "Welcome"} avatarUrl={"https://i.pinimg.com/736x/d0/00/fb/d000fb29aa999d3b97aeb648a88d8014.jpg"} />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#4834d4"]} />
        }
      >
        <SearchFiltersHeader key={resetKey} onSearch={handleSearch} />
        <PropertySlider loading={status === 'loading'} title={"Plots and Projects"} category="plots" data={filterPropertiesByCategory(properties, "plots")} />
        <PropertySlider loading={status === 'loading'} title={"Houses, Apartment and Flats"} category="house_apartment" data={filterPropertiesByCategory(properties, "House/Apartment/Flat")} />
        <PropertySlider loading={status === 'loading'} title={"Shops, Godowns and Offices"} category="office_shop" data={filterPropertiesByCategory(properties, "Shop/Godown/Office")} />
        <PropertySlider loading={status === 'loading'} title={"Agricultural Lands and FarmHouses"} category="agriculture_land" data={filterPropertiesByCategory(properties, "AgriculturalLand/FarmHouses")} />
      </ScrollView>
    </View>
  )
}

export default HomePageScreen

const styles = StyleSheet.create({

  root: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})