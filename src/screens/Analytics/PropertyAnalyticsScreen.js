import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { fetchPropertyAnalytics } from '../../services/analytics.service';

const StatCard = ({ title, value, icon, color }) => (
    <View style={[styles.card, { borderLeftColor: color }]}>
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
    const dateStr = new Date(visitor.viewedAt).toLocaleString();
    return (
        <View style={styles.visitorCard}>
            <View style={styles.visitorHeader}>
                <Ionicons name="person-circle-outline" size={40} color="#4834d4" />
                <View style={styles.visitorInfo}>
                    <Text style={styles.visitorName}>{visitor.User?.fullName || "Anonymous User"}</Text>
                    <Text style={styles.visitorDate}>{dateStr}</Text>
                </View>
                <View style={styles.durationBadge}>
                    <Ionicons name="time-outline" size={14} color="#fff" />
                    <Text style={styles.durationText}>{visitor.durationSeconds}s</Text>
                </View>
            </View>
            <View style={styles.contactInfo}>
                {visitor.User?.mobileNumber && (
                    <Text style={styles.contactText}>
                        <Ionicons name="call-outline" size={14} /> {visitor.User.mobileNumber}
                    </Text>
                )}
                {visitor.User?.email && (
                    <Text style={styles.contactText}>
                        <Ionicons name="mail-outline" size={14} /> {visitor.User.email}
                    </Text>
                )}
            </View>
        </View>
    );
};

const PropertyAnalyticsScreen = ({ route, navigation }) => {
    const { propertyId, propertyName } = route.params || {};
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                setLoading(true);
                const res = await fetchPropertyAnalytics(propertyId);
                if (res.success && res.data) {
                    setData(res.data);
                } else {
                    setError(res.message || "Failed to load analytics");
                }
            } catch (err) {
                setError(err.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        if (propertyId) loadAnalytics();
        else {
            setLoading(false);
            setError("No Property ID provided");
        }
    }, [propertyId]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#4834d4" />
            </View>
        );
    }

    if (error || !data) {
        return (
            <View style={styles.center}>
                <Text style={{ color: 'red' }}>{error || "Analytics not available"}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.header}>
                <Ionicons name="arrow-back" size={24} color="#333" onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>{propertyName ? `${propertyName} Analytics` : 'Property Analytics'}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.sectionTitle}>Overview</Text>

                <View style={styles.grid}>
                    <StatCard title="Total Views" value={data.totalViews || 0} icon="eye" color="#4834d4" />
                    <StatCard title="Unique Visitors" value={data.uniqueVisitors || 0} icon="people" color="#2ecc71" />
                    <StatCard title="Today's Views" value={data.todayViews || 0} icon="today" color="#e67e22" />
                    <StatCard title="Last 7 Days" value={data.last7DaysViews || 0} icon="calendar" color="#e74c3c" />
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
                {(data.visitors || []).map((visitor) => (
                    <VisitorItem key={visitor.id} visitor={visitor} />
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
        minWidth: 140,
        flexGrow: 1,
        marginHorizontal: '1%',
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
    contactText: { fontSize: 13, color: '#7f8c8d', marginBottom: 4 },
});
