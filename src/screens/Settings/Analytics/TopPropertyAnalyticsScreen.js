import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { fetchTopPropertyAnalytics } from '../../../services/analytics.service';
import PropertyCard from '../../../components/Home/Core/PropertyCard';

const { width } = Dimensions.get('window');

const TopPropertyAnalyticsScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [data, setData] = useState(null);
    
    // UI State
    const [mainTab, setMainTab] = useState('category'); // 'category' or 'city'
    const [subTabCategory, setSubTabCategory] = useState('plots');
    const [subTabCity, setSubTabCity] = useState('');

    const loadData = async () => {
        try {
            const response = await fetchTopPropertyAnalytics();
            if (response && response.data) {
                setData(response.data);
                if (response.data.topByCity && Object.keys(response.data.topByCity).length > 0) {
                    setSubTabCity(Object.keys(response.data.topByCity)[0]);
                }
            }
        } catch (error) {
            console.error("Error fetching top properties:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={26} color="#1c1c1e" />
            </TouchableOpacity>
        </View>
    );

    const renderTitle = () => (
        <View style={styles.titleContainer}>
            <Text style={styles.largeTitle}>Top Analytics</Text>
            <Text style={styles.subtitle}>Discover the most viewed and trending properties across all categories and cities.</Text>
        </View>
    );

    const formatCategoryName = (cat) => {
        switch (cat) {
            case 'plots': return 'Plots';
            case 'house_apartment': return 'Houses & Apts';
            case 'office_shop': return 'Offices & Shops';
            case 'agriculture_land': return 'Agriculture';
            default: return cat.replace('_', ' ');
        }
    };

    const renderMainTabs = () => (
        <View style={styles.mainTabsWrapper}>
            <TouchableOpacity 
                activeOpacity={0.7}
                style={[styles.mainTab, mainTab === 'category' && styles.mainTabActive]}
                onPress={() => setMainTab('category')}
            >
                <Text style={[styles.mainTabText, mainTab === 'category' && styles.mainTabTextActive]}>By Category</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                activeOpacity={0.7}
                style={[styles.mainTab, mainTab === 'city' && styles.mainTabActive]}
                onPress={() => setMainTab('city')}
            >
                <Text style={[styles.mainTabText, mainTab === 'city' && styles.mainTabTextActive]}>By City</Text>
            </TouchableOpacity>
        </View>
    );

    const renderSubTabs = () => {
        if (!data) return null;
        
        let tabs = [];
        let activeTab = '';
        let setActiveTab = () => {};

        if (mainTab === 'category') {
            tabs = Object.keys(data.topByCategory || {});
            activeTab = subTabCategory;
            setActiveTab = setSubTabCategory;
        } else {
            tabs = Object.keys(data.topByCity || {});
            activeTab = subTabCity;
            setActiveTab = setSubTabCity;
        }

        if (tabs.length === 0) return null;

        return (
            <View style={styles.subTabsWrapper}>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    contentContainerStyle={styles.subTabsContainer}
                >
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab;
                        return (
                            <TouchableOpacity 
                                key={tab} 
                                activeOpacity={0.7}
                                style={[styles.subTab, isActive && styles.subTabActive]}
                                onPress={() => setActiveTab(tab)}
                            >
                                <Text style={[styles.subTabText, isActive && styles.subTabTextActive]}>
                                    {mainTab === 'category' ? formatCategoryName(tab) : tab}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>
        );
    };

    const renderProperties = () => {
        if (!data) return null;

        let propertiesList = [];
        if (mainTab === 'category') {
            propertiesList = data.topByCategory?.[subTabCategory] || [];
        } else {
            propertiesList = data.topByCity?.[subTabCity] || [];
        }

        if (propertiesList.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons name="home-search-outline" size={80} color="#E5E5EA" />
                    <Text style={styles.emptyTitle}>No Trending Properties</Text>
                    <Text style={styles.emptyText}>There isn't enough data for this filter yet.</Text>
                </View>
            );
        }

        return (
            <View style={styles.listContainer}>
                {propertiesList.map((item, index) => {
                    const propData = { ...item.property };
                    const isTop1 = index === 0;
                    const isTop2 = index === 1;
                    const isTop3 = index === 2;
                    
                    let badgeColor = '#1c1c1e'; // Default dark
                    let iconName = 'medal';
                    
                    if (isTop1) { badgeColor = '#FFC107'; iconName = 'crown'; } // Gold
                    else if (isTop2) { badgeColor = '#9E9E9E'; } // Silver
                    else if (isTop3) { badgeColor = '#CD7F32'; } // Bronze

                    return (
                        <View key={item.propertyId + "_" + index} style={styles.propertyItemWrapper}>
                            
                            <PropertyCard item={propData} style={styles.propertyCardStyle} />
                            
                            {/* Overlay Badges */}
                            <View style={styles.badgesOverlay}>
                                {/* Rank Badge */}
                                <View style={[styles.rankBadge, { backgroundColor: badgeColor }]}>
                                    {isTop1 ? (
                                        <MaterialCommunityIcons name={iconName} size={16} color="#fff" />
                                    ) : (
                                        <Text style={styles.rankBadgeText}>#{index + 1}</Text>
                                    )}
                                </View>
                                
                                {/* Views Badge */}
                                <View style={styles.viewsBadgePremium}>
                                    <Ionicons name="eye" size={14} color="#1c1c1e" />
                                    <Text style={styles.viewsBadgeText}>{item.totalViews}</Text>
                                </View>
                            </View>

                        </View>
                    );
                })}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            {renderHeader()}
            
            {loading && !refreshing ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>Fetching trending data...</Text>
                </View>
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1c1c1e" />
                    }
                    contentContainerStyle={styles.scrollContent}
                >
                    {renderTitle()}
                    {renderMainTabs()}
                    {renderSubTabs()}
                    {renderProperties()}
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default TopPropertyAnalyticsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF', // Modern clean white background
    },
    scrollContent: {
        paddingBottom: hp('10%'),
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: wp('3.5%'),
        color: '#8e8e93',
        fontFamily: 'Poppins-Medium',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp('5%'),
        paddingVertical: hp('1%'),
        backgroundColor: '#FFFFFF',
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
        borderRadius: 20,
        backgroundColor: '#F2F2F7', // Subtle grey circle for back button
    },
    titleContainer: {
        paddingHorizontal: wp('6%'),
        paddingTop: hp('1%'),
        paddingBottom: hp('2%'),
    },
    largeTitle: {
        fontSize: wp('8%'),
        fontFamily: 'Poppins-Bold',
        color: '#1c1c1e',
        lineHeight: wp('10%'),
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: wp('3.5%'),
        fontFamily: 'Poppins-Regular',
        color: '#8e8e93',
        marginTop: 6,
        lineHeight: 20,
    },
    
    /* Modern Text Tabs */
    mainTabsWrapper: {
        flexDirection: 'row',
        paddingHorizontal: wp('6%'),
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
        marginTop: hp('1%'),
    },
    mainTab: {
        marginRight: wp('6%'),
        paddingBottom: 12,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    mainTabActive: {
        borderBottomColor: '#1c1c1e',
    },
    mainTabText: {
        fontSize: wp('4.5%'),
        fontFamily: 'Poppins-SemiBold',
        color: '#aeaeb2',
    },
    mainTabTextActive: {
        color: '#1c1c1e',
    },
    
    /* Modern Pill Sub-Tabs */
    subTabsWrapper: {
        marginTop: hp('2.5%'),
        marginBottom: hp('1%'),
    },
    subTabsContainer: {
        paddingHorizontal: wp('6%'),
        gap: wp('3%'),
    },
    subTab: {
        paddingHorizontal: wp('5%'),
        paddingVertical: hp('1.2%'),
        borderRadius: 30,
        backgroundColor: '#F2F2F7',
    },
    subTabActive: {
        backgroundColor: '#1c1c1e',
        shadowColor: '#1c1c1e',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    subTabText: {
        fontSize: wp('3.5%'),
        color: '#8e8e93',
        fontFamily: 'Poppins-Medium',
    },
    subTabTextActive: {
        color: '#ffffff',
    },
    
    /* Properties List */
    listContainer: {
        paddingHorizontal: wp('5%'),
        paddingTop: hp('2%'),
        gap: hp('2%'),
    },
    propertyItemWrapper: {
        position: 'relative',
        width: '100%',
        marginBottom: hp('1%'),
    },
    propertyCardStyle: {
        width: '100%',
        marginRight: 0,
        marginBottom: 0,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 15,
        elevation: 6,
        borderWidth: 1,
        borderColor: '#F2F2F7',
    },
    
    /* Overlay Badges positioned over the Property Card Image */
    badgesOverlay: {
        position: 'absolute',
        top: 12,
        left: 12,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 10,
    },
    rankBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        marginRight: 8,
    },
    rankBadgeText: {
        color: '#fff',
        fontFamily: 'Poppins-Bold',
        fontSize: wp('3.5%'),
    },
    viewsBadgePremium: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    viewsBadgeText: {
        color: '#1c1c1e',
        fontSize: wp('3.2%'),
        fontFamily: 'Poppins-Bold',
        marginLeft: 6,
    },
    
    /* Empty State */
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp('10%'),
        paddingHorizontal: wp('10%'),
    },
    emptyTitle: {
        marginTop: hp('2%'),
        fontSize: wp('5%'),
        color: '#1c1c1e',
        fontFamily: 'Poppins-Bold',
    },
    emptyText: {
        marginTop: hp('1%'),
        fontSize: wp('3.5%'),
        color: '#8e8e93',
        fontFamily: 'Poppins-Regular',
        textAlign: 'center',
        lineHeight: 22,
    }
});
