import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import AppHeader from '../../components/Home/Layout/AppHeader'
import SearchFiltersHeader from '../../components/Home/Layout/SearchFiltersHeader';
import PropertySlider from '../../components/Home/Core/PropertySlider';
const HomePageScreen = () => {
  return (
      <SafeAreaView style={styles.root}>
            <AppHeader userName={"Mohit Vaishnav"} avatarUrl={"https://i.pinimg.com/736x/d0/00/fb/d000fb29aa999d3b97aeb648a88d8014.jpg"} />
        <ScrollView>  
            <SearchFiltersHeader />
            <PropertySlider title={"Houses & Apartment"} data={[1, 2, 3, 4, 4]}/>
            <PropertySlider title={"Houses & Apartment"} data={[1, 2, 3, 4, 4]}/>
            <PropertySlider title={"Houses & Apartment"} data={[1, 2, 3, 4, 4]}/>
            <PropertySlider title={"Houses & Apartment"} data={[1, 2, 3, 4, 4]}/>
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