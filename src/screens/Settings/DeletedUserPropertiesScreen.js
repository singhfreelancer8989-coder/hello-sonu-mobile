
import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    Image,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { getDeletedUserProperties, deleteProperty } from '../../services/property.service';

const DeletedUserPropertiesScreen = () => {
    const navigation = useNavigation();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getDeletedUserProperties();
            if (response && response.data && response.data.data) {
                // Assuming API returns { data: [ ... ] } or simple array
                // Adjust based on actual API response structure if needed
                setProperties(Array.isArray(response.data.data) ? response.data.data : []);
            } else if (Array.isArray(response.data)) {
                setProperties(response.data);
            } else {
                setProperties([]);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load deleted properties.");
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    const handleCardPress = (property) => {
        if (property?._id || property?.id) {
            navigation.navigate('PropertyDetails', { propertyId: property._id || property.id });
        }
    };

    const handleDelete = (propertyId) => {
        Alert.alert(
            "Delete Permanently",
            "Are you sure you want to PERMANENTLY delete this property? This cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteProperty(propertyId);
                            // Refresh list locally
                            await loadData();
                            Alert.alert("Success", "Property deleted permanently.");
                        } catch (error) {
                            Alert.alert("Error", "Failed to delete property");
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => {
        const imageUri = item.coverImageUrl || item.mainImage || (item.media && item.media.length > 0 ? item.media[0].imageUrl : "https://via.placeholder.com/150");

        return (
            <TouchableOpacity style={styles.card} onPress={() => handleCardPress(item)} activeOpacity={0.9}>
                <Image source={{ uri: imageUri }} style={styles.cardImage} />
                <View style={styles.cardContent}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{item.propertyName || item.propertyType}</Text>
                    <Text style={styles.cardPrice}>₹ {item.expectedPrice || item.demandPrice}</Text>
                    <Text style={styles.cardLocation} numberOfLines={1}>{item.city}, {item.location || item.address}</Text>

                    <View style={styles.statusRow}>
                        <View style={styles.deletedBadge}>
                            <Text style={styles.deletedText}>Deleted User Property</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleDelete(item._id || item.id)} style={{ padding: 8 }}>
                            <MaterialIcons name="delete" size={22} color="#ff4444" />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
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
                <Text style={styles.headerTitle}>Deleted User Properties</Text>
                <View style={{ width: 26 }} />
            </View>

            {/* ERROR VIEW */}
            {error && (
                <View style={styles.center}>
                    <Text style={{ color: 'red', fontFamily: 'Poppins-Regular' }}>{error}</Text>
                    <TouchableOpacity onPress={loadData} style={{ marginTop: 10 }}>
                        <Text style={{ color: '#3a75cd', fontFamily: 'Poppins-Bold' }}>Retry</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* LIST */}
            {!loading && !error && properties.length === 0 ? (
                <View style={styles.center}>
                    <Text style={styles.emptyText}>No deleted user properties found.</Text>
                </View>
            ) : (
                <FlatList
                    data={properties}
                    keyExtractor={(item) => item._id || item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
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
    headerTitle: { fontFamily: "Poppins-Bold", fontSize: wp('4.5%'), color: "#000" },
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
    deletedBadge: {
        backgroundColor: '#ffebee',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4
    },
    deletedText: { fontFamily: "Poppins-Medium", fontSize: wp('2.8%'), color: '#c62828' }

});

export default DeletedUserPropertiesScreen;
