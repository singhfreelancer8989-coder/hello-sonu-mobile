import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, useWindowDimensions, RefreshControl, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { fetchPropertyAnalytics } from '../../services/analytics.service';

const StatCard = ({ title, value, icon, color, cardWidth }) => (
    <View style={[styles.card, { borderLeftColor: color, width: cardWidth }]}>
        <View style={styles.cardIconContainer}>
            <Ionicons name={icon} size={24} color={color} />
        </View>
        <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardValue}>{value}</Text>
        </View>
    </View>
);

const VisitorItem = ({ visitor }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const latestView = visitor.latestView || visitor;
    const dateStr = new Date(latestView.viewedAt).toLocaleString();
    const userObj = visitor.user || visitor.User;
    const phone = userObj?.phone || userObj?.mobileNumber;

    const handleCall = () => {
        if (phone) {
            Linking.openURL(`tel:${phone}`);
        }
    };

    return (
        <View style={styles.visitorCard}>
            <View style={styles.visitorHeader}>
                <Ionicons name="person-circle-outline" size={40} color="#4834d4" />
                <View style={styles.visitorInfo}>
                    <Text style={styles.visitorName}>{userObj?.fullName || "Anonymous User"}</Text>
                    <Text style={styles.visitorDate}>{visitor.latestView ? 'Latest: ' : ''}{dateStr}</Text>
                </View>
                <View style={styles.durationBadge}>
                    <Ionicons name="time-outline" size={14} color="#fff" />
                    <Text style={styles.durationText}>{latestView.durationSeconds}s</Text>
                </View>
            </View>
            <View style={styles.contactInfo}>
                {phone && (
                    <TouchableOpacity style={styles.contactRow} onPress={handleCall} activeOpacity={0.7}>
                        <View style={styles.contactIconCircle}>
                            <Ionicons name="call" size={14} color="#fff" />
                        </View>
                        <Text style={styles.contactPhone}>{phone}</Text>
                        <Ionicons name="open-outline" size={12} color="#4834d4" style={{ marginLeft: 4 }} />
                    </TouchableOpacity>
                )}
                {userObj?.email && (
                    <View style={styles.contactRow}>
                        <View style={[styles.contactIconCircle, { backgroundColor: '#e67e22' }]}>
                            <Ionicons name="mail" size={14} color="#fff" />
                        </View>
                        <Text style={styles.contactEmail}>{userObj.email}</Text>
                    </View>
                )}
            </View>
            {visitor.views && visitor.views.length > 0 && (
                <View style={styles.viewsContainer}>
                    <TouchableOpacity 
                        style={styles.dropdownHeader} 
                        onPress={() => setIsExpanded(!isExpanded)}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.viewsHeader}>
                            View History (Total: {visitor.totalViews || visitor.views.length})
                        </Text>
                        <Ionicons 
                            name={isExpanded ? "chevron-up" : "chevron-down"} 
                            size={18} 
                            color="#34495e" 
                        />
                    </TouchableOpacity>
                    
                    {isExpanded && (
                        <View style={styles.dropdownContent}>
                            {visitor.views.map((v, index) => (
                                <View key={index.toString()} style={styles.viewHistoryRow}>
                                    <View style={styles.viewHistoryDateWrapper}>
                                        <Ionicons name="calendar-outline" size={12} color="#7f8c8d" />
                                        <Text style={styles.viewHistoryDate}>
                                            {new Date(v.viewedAt).toLocaleString()}
                                        </Text>
                                    </View>
                                    <View style={styles.viewHistoryDurationWrapper}>
                                        <Ionicons name="timer-outline" size={12} color="#7f8c8d" />
                                        <Text style={styles.viewHistoryDuration}>{v.durationSeconds}s</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

const PropertyAnalyticsScreen = ({ route, navigation }) => {
    const { width } = useWindowDimensions();
    const isTabletOrLandscape = width >= 600;
    const cardWidth = isTabletOrLandscape ? '23%' : '48%';

    const { propertyId, propertyName } = route.params || {};
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const loadAnalytics = useCallback(async () => {
        if (!propertyId) {
            setLoading(false);
            setError("No Property ID provided");
            return;
        }

        try {
            const res = await fetchPropertyAnalytics(propertyId);
            console.log('📊 RAW API Response:', JSON.stringify(res, null, 2));
            if (res && res.data) {
                console.log('📊 Visitors:', JSON.stringify(res.data.visitors?.[0], null, 2));
                setData(res.data);
            } else if (res && res.totalViews !== undefined) {
                setData(res);
            } else {
                setError(res?.message || "Failed to load analytics");
            }
        } catch (err) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    }, [propertyId]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadAnalytics();
        setRefreshing(false);
    }, [loadAnalytics]);

    useEffect(() => {
        setLoading(true);
        loadAnalytics();
    }, [loadAnalytics]);



    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#4834d4" />
            </View>
        );
    }

    if (error || !data || data.totalViews === undefined || data.totalViews === 0) {
        return (
            <SafeAreaView style={styles.root}>
                <View style={styles.header}>
                    <Ionicons name="arrow-back" size={24} color="#333" onPress={() => navigation.goBack()} />
                    <Text style={styles.headerTitle}>{propertyName ? `${propertyName} Analytics` : 'Property Analytics'}</Text>
                </View>
                <ScrollView
                    contentContainerStyle={styles.emptyStateContainer}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#4834d4"]} />
                    }
                >
                    <View style={styles.iconCircle}>
                        <Ionicons name="bar-chart-outline" size={64} color="#4834d4" />
                    </View>
                    <Text style={styles.emptyStateTitle}>No Insights Yet</Text>
                    <Text style={styles.emptyStateSubtitle}>
                        Once people start viewing this property, their analytics and visitor details will appear here.
                    </Text>
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.header}>
                <Ionicons name="arrow-back" size={24} color="#333" onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>{propertyName ? `${propertyName} Analytics` : 'Property Analytics'}</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#4834d4"]} />
                }
            >
                <Text style={styles.sectionTitle}>Overview</Text>

                <View style={styles.grid}>
                    <StatCard title="Total Views" value={data.totalViews || 0} icon="eye" color="#4834d4" cardWidth={cardWidth} />
                    <StatCard title="Unique Visitors" value={data.uniqueVisitors || 0} icon="people" color="#2ecc71" cardWidth={cardWidth} />
                    <StatCard title="Today's Views" value={data.todayViews || 0} icon="today" color="#e67e22" cardWidth={cardWidth} />
                    <StatCard title="Last 7 Days" value={data.last7DaysViews || 0} icon="calendar" color="#e74c3c" cardWidth={cardWidth} />
                </View>

                <View style={styles.durationContainer}>
                    <View style={styles.durationBox}>
                        <Text style={styles.durationLabel}>Average Duration</Text>
                        <Text style={styles.durationValue}>{data.averageDurationSeconds || 0}s</Text>
                    </View>
                    <View style={styles.durationBox}>
                        <Text style={styles.durationLabel}>Max Duration</Text>
                        <Text style={styles.durationValue}>{data.maxDurationSeconds || 0}s</Text>
                    </View>
                </View>

                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Recent Visitors</Text>
                {(data.visitors || []).map((visitor, index) => (
                    <VisitorItem key={visitor?.user?.id || visitor?.User?.id || index.toString()} visitor={visitor} />
                ))}
                {!(data.visitors && data.visitors.length > 0) && (
                    <Text style={{ color: '#7f8c8d' }}>No analytics views recorded yet.</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default PropertyAnalyticsScreen;

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#f8f9fa' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 16, color: '#333' },
    scrollContent: { padding: 16 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginBottom: 12 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    card: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    cardIconContainer: { marginBottom: 8 },
    cardTitle: { fontSize: 13, color: '#7f8c8d' },
    cardValue: { fontSize: 20, fontWeight: 'bold', color: '#2c3e50', marginTop: 4 },
    durationContainer: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', padding: 16, borderRadius: 8, marginTop: 8 },
    durationBox: { alignItems: 'center', flex: 1 },
    durationLabel: { fontSize: 13, color: '#7f8c8d', marginBottom: 4 },
    durationValue: { fontSize: 18, fontWeight: 'bold', color: '#34495e' },
    visitorCard: { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
    visitorHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    visitorInfo: { flex: 1, marginLeft: 12 },
    visitorName: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50' },
    visitorDate: { fontSize: 12, color: '#95a5a6', marginTop: 2 },
    durationBadge: { backgroundColor: '#4834d4', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    durationText: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginLeft: 4 },
    contactInfo: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 12 },
    contactRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    contactIconCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#4834d4', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
    contactPhone: { fontSize: 14, fontWeight: '600', color: '#4834d4', letterSpacing: 0.3 },
    contactEmail: { fontSize: 13, color: '#555' },
    emptyStateContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, backgroundColor: '#f8f9fa' },
    iconCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#ebe8fc', justifyContent: 'center', alignItems: 'center', marginBottom: 24, shadowColor: '#4834d4', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
    emptyStateTitle: { fontSize: 22, fontWeight: 'bold', color: '#2c3e50', marginBottom: 12 },
    emptyStateSubtitle: { fontSize: 15, color: '#7f8c8d', textAlign: 'center', lineHeight: 22 },
    viewsContainer: { marginTop: 12, backgroundColor: '#f8f9fa', borderRadius: 8, overflow: 'hidden' },
    dropdownHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12 },
    viewsHeader: { fontSize: 13, fontWeight: 'bold', color: '#34495e' },
    dropdownContent: { paddingHorizontal: 12, paddingBottom: 12, paddingTop: 4, borderTopWidth: 1, borderTopColor: '#ebebeb' },
    viewHistoryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
    viewHistoryDateWrapper: { flexDirection: 'row', alignItems: 'center' },
    viewHistoryDate: { fontSize: 12, color: '#7f8c8d', marginLeft: 6 },
    viewHistoryDurationWrapper: { flexDirection: 'row', alignItems: 'center' },
    viewHistoryDuration: { fontSize: 12, color: '#7f8c8d', marginLeft: 6 },
});
