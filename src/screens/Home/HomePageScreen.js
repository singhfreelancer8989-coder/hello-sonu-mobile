import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import AppHeader from '../../components/Home/Layout/AppHeader'
import SearchFiltersHeader from '../../components/Home/Layout/SearchFiltersHeader';
import PropertySlider from '../../components/Home/Core/PropertySlider';
import { useDispatch, useSelector } from 'react-redux';
import { filterPropertiesByCategory } from '../../utility/propertyUtilities';
import { useEffect } from 'react';
import { fetchPropertiesAsync, fetchSavedPropertiesAsync } from '../../store/slices/propertySlices';
import useAuth from '../../hooks/useAuth';

import { useNavigation } from '@react-navigation/native';

const HomePageScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { userData } = useAuth();
  const properties = useSelector((state) => state.property.properties);

  useEffect(() => {
    async function fetchProperties() {
      await dispatch(fetchPropertiesAsync());
      if (userData?.id || userData?._id) {
        dispatch(fetchSavedPropertiesAsync(userData.id || userData._id));
      }
    }
    fetchProperties();
  }, [dispatch, userData]);



  const handleSearch = (filters) => {
    navigation.navigate('PropertyListing', {
      filters: filters,
      title: 'Search Results'
    });
  };

  return (
    <View style={styles.root}>
      <AppHeader userName={"Mohit Vaishnav"} avatarUrl={"https://i.pinimg.com/736x/d0/00/fb/d000fb29aa999d3b97aeb648a88d8014.jpg"} />
      <ScrollView>
        <SearchFiltersHeader onSearch={handleSearch} />
        <PropertySlider title={"Plots/Projects"} category="plots" data={filterPropertiesByCategory(properties, "plots")} />
        <PropertySlider title={"Houses, Apartment and Flats"} category="house_apartment" data={filterPropertiesByCategory(properties, "House/Apartment/Flat")} />
        <PropertySlider title={"Shops, Godowns and Offices"} category="office_shop" data={filterPropertiesByCategory(properties, "Shop/Godown/Office")} />
        <PropertySlider title={"Agricultural Lands and FarmHouses"} category="agriculture_land" data={filterPropertiesByCategory(properties, "AgriculturalLand/FarmHouses")} />
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