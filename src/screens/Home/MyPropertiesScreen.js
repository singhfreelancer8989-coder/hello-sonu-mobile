
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    Image,
    Alert,
    RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import useAuth from '../../hooks/useAuth';
import { fetchMyPropertiesAsync, fetchPropertiesAsync } from '../../store/slices/propertySlices';
import { deleteProperty } from '../../services/property.service';

const MyPropertiesScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { userData } = useAuth();

    const { myProperties, myPropertiesStatus } = useSelector((state) => state.property);

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        if (userData?.id || userData?._id) {
            await dispatch(fetchMyPropertiesAsync(userData.id || userData._id));
        }
        setRefreshing(false);
    }, [dispatch, userData]);

    useEffect(() => {
        if (userData?.id || userData?._id) {
            dispatch(fetchMyPropertiesAsync(userData.id || userData._id));
        }
    }, [dispatch, userData]);

    const handleCardPress = (property) => {
        navigation.navigate('PropertyDetails', { propertyId: property._id || property.id });
    };

    const handleDelete = (propertyId) => {
        Alert.alert(
            "Delete Property",
            "Are you sure you want to delete this property?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteProperty(propertyId);
                            // Refresh list
                            if (userData?.id || userData?._id) {
                                dispatch(fetchMyPropertiesAsync(userData.id || userData._id));
                                dispatch(fetchPropertiesAsync()); // Sync home feed too
                            }
                        } catch (error) {
                            Alert.alert("Error", "Failed to delete property");
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => {
        const imageUri = item.mainImage || item.media?.[0]?.imageUrl || 'https://via.placeholder.com/150';

        return (
            <TouchableOpacity style={styles.card} onPress={() => handleCardPress(item)}>
                <Image source={{ uri: imageUri }} style={styles.cardImage} />
                <View style={styles.cardContent}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{item.propertyName || item.propertyType}</Text>
                    <Text style={styles.cardPrice}>₹ {item.expectedPrice || item.demandPrice}</Text>
                    <Text style={styles.cardLocation} numberOfLines={1}>{item.city}, {item.location || item.address}</Text>

                    <View style={styles.statusRow}>
                        <View style={[styles.statusBadge, { backgroundColor: item.isVerified ? '#e8f5e9' : '#fff3e0' }]}>
                            <Text style={[styles.statusText, { color: item.isVerified ? '#2e7d32' : '#ef6c00' }]}>
                                {item.isVerified ? 'Verified' : 'Pending'}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <TouchableOpacity onPress={() => navigation.navigate('EditProperty', { property: item })} style={{ padding: 4 }}>
                                <MaterialIcons name="edit" size={22} color="#3a75cd" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDelete(item._id || item.id)} style={{ padding: 4 }}>
                                <MaterialIcons name="delete" size={22} color="#ff4444" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    if (myPropertiesStatus === 'loading') {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#3a75cd" />
            </View>
        );
    }


    return (
        <SafeAreaView style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={26} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Properties</Text>
                <View style={{ width: 26 }} />
            </View>

            {/* LIST */}
            {myProperties.length === 0 && myPropertiesStatus !== 'loading' ? (
                <View style={styles.center}>
                    <Text style={styles.emptyText}>No properties posted yet.</Text>
                </View>
            ) : (
                <FlatList
                    data={myProperties}
                    keyExtractor={(item) => item._id || item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#3a75cd"]} />
                    }
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        flexDirection: 'row', alignItems: 'center', padding: wp('4%'),
        justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#eee'
    },
    backBtn: { padding: 4 },
    headerTitle: { fontFamily: "Poppins-Bold", fontSize: wp('5%'), color: "#000" },
    listContent: { padding: wp('4%') },
    emptyText: { fontFamily: "Poppins-Regular", color: '#888', fontSize: wp('4%') },

    /* CARD */
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: hp('2%'),
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#f0f0f0'
    },
    cardImage: {
        width: wp('30%'),
        height: '100%',
        backgroundColor: '#eee'
    },
    cardContent: {
        flex: 1,
        padding: wp('3%'),
        justifyContent: 'space-between'
    },
    cardTitle: { fontFamily: "Poppins-SemiBold", fontSize: wp('4%'), color: '#333' },
    cardPrice: { fontFamily: "Poppins-Bold", fontSize: wp('4.5%'), color: '#3a75cd', marginVertical: 4 },
    cardLocation: { fontFamily: "Poppins-Regular", fontSize: wp('3.2%'), color: '#666' },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4
    },
    statusText: { fontFamily: "Poppins-Medium", fontSize: wp('3%') }

});

export default MyPropertiesScreen;
