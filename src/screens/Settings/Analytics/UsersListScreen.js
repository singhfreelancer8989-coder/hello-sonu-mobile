import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';


import { getUsersByRole, deleteUser } from '../../../services/user.service';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { showErrorAlert, getErrorMessage } from '../../../utility/error.utility';

const UsersListScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { role = 'customer' } = route.params || {};

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const screenTitle = role === 'admin' ? 'Admins' : 'Users';

    const fetchUsers = React.useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getUsersByRole(role);
            if (response && response.data) {
                // Map role for UI consistency
                setUsers(response.data.map(u => ({ ...u, role })));
            } else {
                setError(response?.message || `Failed to fetch ${screenTitle}`);
            }
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [role, screenTitle]);

    useFocusEffect(
        React.useCallback(() => {
            fetchUsers();
            return () => { setUsers([]); setLoading(false); }; // Cleanup
        }, [fetchUsers])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchUsers();
    };

    const handleDelete = (id) => {
        Alert.alert(
            `Delete ${role === 'admin' ? 'Admin' : 'User'}`,
            `Are you sure you want to delete this ${role === 'admin' ? 'admin' : 'user'}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const response = await deleteUser(role, id);
                            if (response) {
                                setUsers(prev => prev.filter(item => item.id !== id));
                                Alert.alert("Success", `${role === 'admin' ? 'Admin' : 'User'} deleted successfully`);
                            } else {
                                showErrorAlert("Error", response?.message || "Failed to delete");
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
        <View style={styles.userCard}>
            <View style={[styles.avatar, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#E3F2FD' }]}>
                <FontAwesome5 name={item.role === 'admin' ? "user-shield" : "user"} size={24} color="#007AFF" />
            </View>
            <View style={styles.userInfo}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.userName}>{item.firstName + " " + item.lastName || 'Unknown User'}</Text>
                    {item.role === 'admin' && <MaterialIcons name="admin-panel-settings" size={16} color="#FF9800" />}
                </View>
                <Text style={styles.userEmail}>{item.email || item.mobileNumber || 'No contact info'}</Text>
                <Text style={styles.userDate}>Joined: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</Text>
            </View>
            <View style={styles.statusContainer}>
                <View style={[styles.statusBadge,
                { backgroundColor: item.status === 'active' ? '#E8F5E9' : item.status === 'inactive' ? '#FFF3E0' : '#FFEBEE' }
                ]}>
                    <Text style={[styles.statusText,
                    { color: item.status === 'active' ? '#2E7D32' : item.status === 'inactive' ? '#EF6C00' : '#C62828' }
                    ]}>{item.status ? item.status.toUpperCase() : 'UNKNOWN'}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: '#F3E5F5', marginTop: 4 }]}>
                    <Text style={[styles.statusText, { color: '#7B1FA2', fontSize: 10 }]}>{item.role ? item.role.toUpperCase() : 'USER'}</Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionButton}>
                    <MaterialIcons name="delete-outline" size={24} color="#FF3B30" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>All {screenTitle}</Text>
            </View>

            {loading && !refreshing && !users.length ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            ) : error ? (
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity onPress={fetchUsers} style={styles.retryButton}>
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={users}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => item.id || index.toString()}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#007AFF']} />
                    }
                    ListEmptyComponent={
                        <View style={styles.centerContainer}>
                            <Text style={styles.emptyText}>No {role === 'customer' ? 'users' : 'admins'} found.</Text>
                        </View>
                    }
                />
            )}
        </View >
    );
};


export default UsersListScreen;

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
    userCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: wp('4%'),
        borderRadius: 12,
        marginBottom: hp('1.5%'),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: wp('4%'),
        backgroundColor: '#E0E0E0',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: wp('4%'),
        color: '#333',
        fontFamily: 'Poppins-Medium',
    },
    userEmail: {
        fontSize: wp('3.2%'),
        color: '#757575',
        fontFamily: 'Poppins-Regular',
        marginVertical: 2,
    },
    userDate: {
        fontSize: wp('3%'),
        color: '#9E9E9E',
        fontFamily: 'Poppins-Light',
    },
    statusContainer: {
        alignItems: 'flex-end',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginBottom: 8,
    },
    statusText: {
        fontSize: wp('3%'),
        fontFamily: 'Poppins-Medium',
    },
    actionButton: {
        padding: 4,
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
