import React, { useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchFiltersHeader from '../../components/Home/Layout/SearchFiltersHeader'
import SavedCard from '../../components/Saved/SavedCard'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSavedPropertiesAsync, removeSavedPropertyAsync } from '../../store/slices/propertySlices';
import useAuth from '../../hooks/useAuth';

const SavedScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { userData } = useAuth();
  const { savedPropertiesList, savedPropertiesStatus, } = useSelector(state => state.property);

  const fetchSaved = useCallback(() => {
    if (userData?.id || userData?._id) {
      dispatch(fetchSavedPropertiesAsync(userData.id || userData._id));
    }
  }, [dispatch, userData]);

  useFocusEffect(
    useCallback(() => {
      fetchSaved();
    }, [fetchSaved])
  );

  // useEffect(()=>{
  //   // console.log(savedPropertiesList)
  // }, [savedPropertiesList])

  const handleRemove = (propertyId) => {
    Alert.alert("Remove", "Remove this property from saved?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          dispatch(removeSavedPropertyAsync({
            userId: userData.id || userData._id,
            propertyId
          }));
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.root}>

      {/* Header with back button + title */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconWrapper}>
          <Ionicons name="chevron-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.heading}>Saved Properties</Text>
      </View>

      {/* <SearchFiltersHeader /> */}

      {savedPropertiesStatus === 'loading' && savedPropertiesList.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#3a75cd" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={savedPropertiesStatus === 'loading'} onRefresh={fetchSaved} />}
        >
          {savedPropertiesList.length === 0 ? (
            <View style={{ alignItems: 'center', marginTop: hp('10%') }}>
              <Text style={{ fontFamily: 'Poppins-Regular', color: '#888' }}>No saved properties yet.</Text>
            </View>
          ) : (
            savedPropertiesList.map((item, index) => (
              <SavedCard key={item.id || item._id || index} property={{ ...item.property }} onRemove={handleRemove} />
            ))
          )}
          <View style={{ height: 50 }} />
        </ScrollView>
      )}

    </SafeAreaView>
  )
}


export default SavedScreen

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: hp('1%'),
    backgroundColor: "#fff",
  },

  /** Back + Title container */
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('0.8%'),
    gap: wp('1.5%'),
  },
  iconWrapper: {
    padding: 4,
    borderRadius: 20,
  },

  heading: {
    fontSize: wp('6%'), // 24
    fontFamily: 'Poppins-Bold',
    color: "#000",
  },
})
