import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchFiltersHeader from '../../components/Home/Layout/SearchFiltersHeader'
import SavedCard from '../../components/Saved/SavedCard'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';

const SavedScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.root}>
      
      {/* Header with back button + title */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconWrapper}>
          <Ionicons name="chevron-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.heading}>Saved</Text>
      </View>

      <SearchFiltersHeader />

      <ScrollView showsVerticalScrollIndicator={false}>
        {[1, 2, 3, 4].map((item, index) => (
          <SavedCard key={index} />
        ))}
      </ScrollView>

    </SafeAreaView>
  )
}

export default SavedScreen

const styles = StyleSheet.create({
  root: {
    flex: 1,  
    paddingTop: 10,
    backgroundColor: "#fff",
  },

  /** Back + Title container */
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 6,
    gap: 6,
  },
  iconWrapper: {
    padding: 4,
    borderRadius: 20,
  },

  heading: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: "#000",
  },
})
