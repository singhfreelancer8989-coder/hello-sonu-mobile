import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getAllBrokers, deleteBroker } from '../../../services/broker.service';
import { showErrorAlert, getErrorMessage } from '../../../utility/error.utility';

const BrokersListScreen = () => {
    const navigation = useNavigation();
    const [brokers, setBrokers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const fetchBrokers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllBrokers();
            if (response && response.data) {
                setBrokers(response.data);
            } else {
                setError(response?.message || "Failed to fetch brokers");
            }
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchBrokers();
        }, [fetchBrokers])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchBrokers();
    };

    const handleDelete = (id) => {
        Alert.alert(
            "Delete Broker",
            "Are you sure you want to delete this broker?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const response = await deleteBroker(id);
                            if (response) {
                                setBrokers(prev => prev.filter(item => item.id !== id));
                                Alert.alert("Success", "Broker deleted successfully");
                            } else {
                                showErrorAlert("Error", response?.message || "Failed to delete broker");
                            }
                        } catch (err) {
                            showErrorAlert("Error", err);
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={[styles.avatar, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#E8F5E9', marginRight: 12 }]}>
                    <FontAwesome5 name="user-tie" size={24} color="#4CAF50" />
                </View>
                <View style={styles.headerInfo}>
                    <View style={styles.nameRow}>
                        <Text style={styles.name}>{item.fullName}</Text>
                        {item.status === 'approved' && <MaterialIcons name="verified" size={16} color="#2196F3" style={{ marginLeft: 4 }} />}
                    </View>
                    <Text style={styles.occupation}>{item.occupation || 'Broker'}</Text>
                    <Text style={styles.location}>
                        <MaterialIcons name="location-pin" size={14} color="#757575" /> {item.city}
                    </Text>
                </View>
                <View style={[styles.statusBadge,
                { backgroundColor: item.status === 'approved' ? '#E3F2FD' : item.status === 'pending' ? '#FFF3E0' : '#FFEBEE' }
                ]}>
                    <Text style={[styles.statusText,
                    { color: item.status === 'approved' ? '#1976D2' : item.status === 'pending' ? '#EF6C00' : '#C62828' }
                    ]}>{item.status?.toUpperCase()}</Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.statsRow}>
                {item.age && (
                    <View style={styles.statItem}>
                        <FontAwesome5 name="user" size={14} color="#666" />
                        <Text style={styles.statText}>Age: {item.age}</Text>
                    </View>
                )}

                <View style={styles.statItem}>
                    <MaterialIcons name="phone" size={16} color="#4CAF50" />
                    <Text style={styles.statText}>{item.mobileNumber}</Text>
                </View>

                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                    <MaterialIcons name="delete" size={20} color="#FF3B30" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Broker Management</Text>
            </View>

            {loading && !refreshing && !brokers.length ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            ) : error ? (
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity onPress={fetchBrokers} style={styles.retryButton}>
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={brokers}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#007AFF']} />
                    }
                    ListEmptyComponent={
                        <View style={styles.centerContainer}>
                            <Text style={styles.emptyText}>No brokers found.</Text>
                        </View>
                    }
                />
            )}
        </View >
    );
};

export default BrokersListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F7',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: hp('2%'),
        paddingHorizontal: wp('5%'),
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    backButton: {
        padding: 8,
        marginRight: 8,
    },
    headerTitle: {
        fontSize: wp('5%'),
        color: '#000',
        fontFamily: 'Poppins-SemiBold',
    },
    listContent: {
        paddingHorizontal: wp('4%'),
        paddingTop: hp('2%'),
        paddingBottom: hp('4%'),
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: wp('4%'),
        marginBottom: hp('1.5%'),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    headerInfo: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        fontSize: wp('4%'),
        color: '#333',
        fontFamily: 'Poppins-Medium',
    },
    occupation: {
        fontSize: wp('3.2%'),
        color: '#555',
        fontFamily: 'Poppins-Regular',
        marginBottom: 2,
    },
    location: {
        fontSize: wp('3.2%'),
        color: '#757575',
        fontFamily: 'Poppins-Regular',
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    statusText: {
        fontSize: wp('2.8%'),
        fontFamily: 'Poppins-Medium',
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 12,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statText: {
        fontSize: wp('3.2%'),
        color: '#666',
        fontFamily: 'Poppins-Regular',
    },
    viewButton: {
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    viewButtonText: {
        fontSize: wp('3%'),
        color: '#333',
        fontFamily: 'Poppins-Medium',
    },
    deleteButton: {
        padding: 5,
        marginLeft: 10,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    errorText: {
        fontSize: wp('3.5%'),
        color: '#FF3B30',
        fontFamily: 'Poppins-Regular',
        textAlign: 'center',
        marginBottom: 10,
    },
    retryButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 8,
    },
    retryText: {
        color: '#fff',
        fontWeight: '600',
        fontFamily: 'Poppins-Medium',
    },
    emptyText: {
        fontSize: wp('3.5%'),
        color: '#8E8E93',
        fontFamily: 'Poppins-Medium',
    },
});
