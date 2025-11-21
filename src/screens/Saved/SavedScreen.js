import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native'
import SearchFiltersHeader from '../../components/Home/Layout/SearchFiltersHeader'
import SavedCard from '../../components/Saved/SavedCard'

const SavedScreen = () => {
  return (
    // Fix: Yahan style={styles.root} add kiya
    <SafeAreaView style={styles.root}>
        <SearchFiltersHeader />
        <Text style={styles.heading}>
            Saved
        </Text>
        <ScrollView>
        {[1, 2, 3, 4,].map((item, index) => <SavedCard key={index} />)}

        </ScrollView>
    </SafeAreaView>
  )
}

export default SavedScreen

const styles = StyleSheet.create({
 
  root: {
    paddingTop:50,
    flex: 1,  
    backgroundColor: "#fff",
  },
  text: {
    color: "#000",
    fontSize: 20 
  },
  heading: {
    fontSize: 28,
    marginLeft:20
  }
})