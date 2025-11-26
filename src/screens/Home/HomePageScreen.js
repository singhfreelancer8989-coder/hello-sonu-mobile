import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import AppHeader from '../../components/Home/Layout/AppHeader'
import SearchFiltersHeader from '../../components/Home/Layout/SearchFiltersHeader';
import PropertySlider from '../../components/Home/Core/PropertySlider';
import { useSelector } from 'react-redux';
import { filterPropertiesByCategory } from '../../utility/propertyUtilities';
const HomePageScreen = () => {
  const properties = useSelector((state) => state.property.properties);
  return (
      <SafeAreaView style={styles.root}>
            <AppHeader userName={"Mohit Vaishnav"} avatarUrl={"https://i.pinimg.com/736x/d0/00/fb/d000fb29aa999d3b97aeb648a88d8014.jpg"} />
        <ScrollView>  
            <SearchFiltersHeader />
            <PropertySlider title={"Houses, Apartment and Flats"} data={filterPropertiesByCategory(properties, "House/Apartment/Flat")}/>
            <PropertySlider title={"Shops, Godowns and Offices"} data={filterPropertiesByCategory(properties, "Shop/Godown/Office")}/>
            <PropertySlider title={"Agricultural Lands and FarmHouses"} data={filterPropertiesByCategory(properties, "AgriculturalLand/FarmHouses")}/>
            <PropertySlider title={"Plots"} data={filterPropertiesByCategory(properties, "plots")}/>
        </ScrollView>
      </SafeAreaView>
  )
}

export default HomePageScreen

const styles = StyleSheet.create({

  root: {
    flex: 1,
    backgroundColor: "#fff"
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: "#000",
    fontSize: 20
  }
})