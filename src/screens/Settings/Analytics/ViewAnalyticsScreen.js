import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import useAnalytics from '../../../hooks/useAnalytics';

/* --- COMPONENTS --- */

const SummaryCard = ({ title, value, icon, color, subValue, subLabel }) => (
    <View style={[styles.summaryCard, { borderTopColor: color }]}>
        <View style={styles.summaryIconBox}>
            <View style={[styles.iconCircle, { backgroundColor: color + '15' }]}>
                {icon}
            </View>
        </View>
        <Text style={styles.summaryValue}>{value}</Text>
        <Text style={styles.summaryTitle}>{title}</Text>
        {!!subValue && (
            <View style={styles.summaryFooter}>
                <Text style={[styles.summarySubValue, { color: color }]}>{subValue}</Text>
                <Text style={styles.summarySubLabel}>{subLabel}</Text>
            </View>
        )}
    </View>
);

const StatusRow = ({ label, count, color, total }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
        <View style={styles.statusRow}>
            <View style={styles.statusLabelContainer}>
                <View style={[styles.statusDot, { backgroundColor: color }]} />
                <Text style={styles.statusLabel}>{label}</Text>
            </View>
            <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${percentage}%`, backgroundColor: color }]} />
            </View>
            <Text style={styles.statusCount}>{count}</Text>
        </View>
    );
};

const CategoryBar = ({ label, count, color, total }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    if (count === 0) return null;

    return (
        <View style={styles.categoryItem}>
            <View style={styles.categoryHeader}>
                <Text style={styles.categoryLabel}>{label}</Text>
                <Text style={styles.categoryCount}>{count}</Text>
            </View>
            <View style={styles.categoryBarBg}>
                <View style={[styles.categoryBarFill, { width: `${percentage}%`, backgroundColor: color }]} />
            </View>
        </View>
    )
}


const ViewAnalyticsScreen = () => {
    const navigation = useNavigation();
    const { dashboardData, loading, getDashboardAnalytics } = useAnalytics();
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await getDashboardAnalytics();
        setRefreshing(false);
    }, [getDashboardAnalytics]);

    useFocusEffect(
        React.useCallback(() => {
            getDashboardAnalytics();
            // // console.log(dashboardData)
        }, [getDashboardAnalytics])
    );

    const { users, brokers, properties } = dashboardData || {};

    // Calculate totals for safe percentages
    const totalUsers = users?.total || 0;
    const totalBrokers = brokers?.total || 0;
    const totalProperties = properties?.total || 0;


    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>Dashboard</Text>
                    <Text style={styles.headerSubtitle}>Overview & Statistics</Text>
                </View>
                <TouchableOpacity onPress={onRefresh} style={styles.refreshBtn}>
                    <Ionicons name="reload" size={20} color="#666" />
                </TouchableOpacity>
            </View>

            {loading && !dashboardData && !refreshing ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#007AFF']} />
                    }
                >
                    {/* Summary Cards Carousel */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsScroll} contentContainerStyle={styles.cardsScrollContent}>
                        <SummaryCard
                            title="Total Users"
                            value={totalUsers}
                            icon={<FontAwesome5 name="users" size={20} color="#007AFF" />}
                            color="#007AFF"
                            subValue={users?.pending || 0}
                            subLabel="Pending"
                        />
                        <SummaryCard
                            title="Total Brokers"
                            value={totalBrokers}
                            icon={<FontAwesome5 name="user-tie" size={20} color="#34C759" />}
                            color="#34C759"
                            subValue={brokers?.pending || 0}
                            subLabel="Pending"
                        />
                        <SummaryCard
                            title="Properties"
                            value={totalProperties}
                            icon={<FontAwesome5 name="city" size={20} color="#FF9500" />}
                            color="#FF9500"
                            subValue={properties?.categories?.plots || 0}
                            subLabel="Plots"
                        />
                    </ScrollView>

                    {/* Users Section */}
                    <View style={styles.sectionContainer}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>User Statistics</Text>
                            <View style={{ flexDirection: 'row', gap: 15 }}>
                                <TouchableOpacity onPress={() => navigation.navigate('UsersListScreen', { role: 'customer' })}>
                                    <Text style={styles.seeAllText}>Customers</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => navigation.navigate('UsersListScreen', { role: 'admin' })}>
                                    <Text style={styles.seeAllText}>Admins</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.card}>
                            <StatusRow label="Active Users" count={users?.active || 0} total={totalUsers} color="#34C759" />
                            <StatusRow label="Pending Approvals" count={users?.pending || 0} total={totalUsers} color="#FF9500" />
                            <StatusRow label="Inactive" count={users?.inactive || 0} total={totalUsers} color="#8E8E93" />
                            <StatusRow label="Deleted" count={users?.deleted || 0} total={totalUsers} color="#FF3B30" />
                        </View>
                    </View>

                    {/* Brokers Section */}
                    <View style={styles.sectionContainer}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Broker Statistics</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('BrokersListScreen')}>
                                <Text style={styles.seeAllText}>View All</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.card}>
                            <StatusRow label="Approved" count={brokers?.approved || 0} total={totalBrokers} color="#34C759" />
                            <StatusRow label="Pending" count={brokers?.pending || 0} total={totalBrokers} color="#FF3B30" />
                            <StatusRow label="Rejected" count={brokers?.rejected || 0} total={totalBrokers} color="#8E8E93" />
                        </View>
                    </View>

                    {/* Properties Status Section */}
                    <View style={styles.sectionContainer}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Property Status</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('DeletedUserPropertiesScreen')}>
                                <Text style={[styles.seeAllText, { color: '#FF3B30' }]}>View Deleted</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.card}>
                            <StatusRow label="Active Properties" count={properties?.active || 0} total={totalProperties} color="#34C759" />
                            <StatusRow label="Sold Properties" count={properties?.sold || 0} total={totalProperties} color="#007AFF" />
                            <StatusRow label="Deleted Properties" count={properties?.deleted || 0} total={totalProperties} color="#FF3B30" />
                        </View>
                        <TouchableOpacity 
                            style={{ marginTop: 15, backgroundColor: '#007AFF', padding: 12, borderRadius: 10, alignItems: 'center' }}
                            onPress={() => navigation.navigate('TopPropertyAnalyticsScreen')}
                        >
                            <Text style={{ color: '#fff', fontSize: 14, fontFamily: 'Poppins-Medium' }}>View Top Properties Analytics</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Property Distribution */}
                    {properties?.categories && (
                        <View style={[styles.sectionContainer, { marginBottom: hp('5%') }]}>
                            <Text style={styles.sectionTitle}>Property Distribution</Text>
                            <View style={styles.card}>
                                <CategoryBar label="Plots" count={properties.categories.plots || 0} total={totalProperties} color="#5856D6" />
                                <CategoryBar label="Houses & Apartments" count={properties.categories.house_apartment || 0} total={totalProperties} color="#AF52DE" />
                                <CategoryBar label="Office & Shops" count={properties.categories.office_shop || 0} total={totalProperties} color="#FF2D55" />
                                <CategoryBar label="Agricultural Land" count={properties.categories.agriculture_land || 0} total={totalProperties} color="#A2845E" />
                            </View>
                        </View>
                    )}

                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default ViewAnalyticsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7', // iOS Grouped Background
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: wp('5%'),
        paddingVertical: hp('1.5%'),
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
        justifyContent: 'space-between'
    },
    backButton: {
        padding: 5,
    },
    refreshBtn: {
        padding: 5,
    },
    headerTitle: {
        fontSize: wp('4.5%'),
        fontWeight: '700',
        color: '#1c1c1e',
        fontFamily: 'Poppins-Bold',
    },
    headerSubtitle: {
        fontSize: wp('3%'),
        color: '#8e8e93',
        fontFamily: 'Poppins-Regular',
    },
    content: {
        paddingBottom: hp('5%'),
    },

    /* Summary Cards */
    cardsScroll: {
        marginTop: hp('2%'),
        marginBottom: hp('1%'),
    },
    cardsScrollContent: {
        paddingHorizontal: wp('5%'),
        gap: wp('3%'),
    },
    summaryCard: {
        backgroundColor: '#fff',
        width: 160,
        minHeight: 140,
        padding: 15,
        borderRadius: 16,
        borderTopWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
        justifyContent: 'space-between',
    },
    summaryIconBox: {
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    iconCircle: {
        padding: 8,
        borderRadius: 10,
    },
    summaryValue: {
        fontSize: wp('6.5%'),
        fontWeight: '700',
        color: '#1c1c1e',
        fontFamily: 'Poppins-Bold',
        marginBottom: 2,
    },
    summaryTitle: {
        fontSize: wp('3.5%'),
        color: '#8e8e93',
        fontFamily: 'Poppins-Medium',
    },
    summaryFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    summarySubValue: {
        fontWeight: '700',
        fontSize: wp('3%'),
        marginRight: 4,
    },
    summarySubLabel: {
        fontSize: wp('3%'),
        color: '#aeaeb2',
    },

    /* Section Styles */
    sectionContainer: {
        marginTop: hp('2.5%'),
        paddingHorizontal: wp('5%'),
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: wp('4.5%'),
        fontWeight: '600',
        color: '#1c1c1e',
        fontFamily: 'Poppins-SemiBold',
    },
    seeAllText: {
        fontSize: wp('3.5%'),
        color: '#007AFF',
        fontWeight: '600',
        fontFamily: 'Poppins-Medium',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },

    /* Status Row */
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    statusLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '35%',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    statusLabel: {
        fontSize: wp('3.2%'),
        color: '#3a3a3c',
        fontFamily: 'Poppins-Medium',
    },
    progressBarContainer: {
        flex: 1,
        height: 6,
        backgroundColor: '#f2f2f7',
        borderRadius: 3,
        marginHorizontal: 10,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 3,
    },
    statusCount: {
        fontSize: wp('3.5%'),
        fontWeight: '600',
        color: '#1c1c1e',
        minWidth: 35,
        textAlign: 'right',
        fontFamily: 'Poppins-SemiBold',
    },

    /* Category Bar */
    categoryItem: {
        marginBottom: 16,
    },
    categoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    categoryLabel: {
        fontSize: wp('3.5%'),
        color: '#3a3a3c',
        fontFamily: 'Poppins-Medium',
    },
    categoryCount: {
        fontSize: wp('3.5%'),
        fontWeight: '600',
        color: '#1c1c1e',
    },
    categoryBarBg: {
        height: 8,
        backgroundColor: '#f2f2f7',
        borderRadius: 4,
        overflow: 'hidden',
    },
    categoryBarFill: {
        height: '100%',
        borderRadius: 4,
    },
});
