import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView, Modal, RefreshControl } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from 'react-redux';
import { fetchListingPropertiesAsync, clearListingProperties } from '../../store/slices/propertySlices';
import PropertyCard from '../../components/Home/Core/PropertyCard';
import SkeletonPropertyCard from '../../components/Home/Core/SkeletonPropertyCard';
import { filterPropertiesByCategory, mapBudgetToParams } from '../../utility/propertyUtilities';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { CITIES } from '../../constants/data.constant';

const FILTER_CATEGORIES = [
    { label: "All", value: "" },
    { label: "Plots", value: "plots" },
    { label: "House/Apartment", value: "house_apartment" },
    { label: "Office/Shop", value: "office_shop" },
    { label: "Agricultural Land", value: "agriculture_land" },
    // { label: "Flats", value: "flats" }
];

const BUDGET_OPTIONS = [
    { label: "Any Budget", value: "" },
    { label: "10L", value: "10L" },
    { label: "25L", value: "25L" },
    { label: "50L", value: "50L" },
    { label: "1Cr", value: "1Cr" },
];

const SIZE_OPTIONS = [
    { label: "Any Size", value: "" },
    { label: "1 BHK", value: "1 BHK" },
    { label: "2 BHK", value: "2 BHK" },
    { label: "3 BHK", value: "3 BHK" },
    { label: "4 BHK", value: "4 BHK" },
    { label: "5 BHK", value: "5 BHK" },
];

const PropertyListingScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const route = useRoute();
    const insets = useSafeAreaInsets();

    const { listing, listingStatus, listingPagination } = useSelector((state) => state.property);
    const { page, hasMore } = listingPagination;

    // Local Filter State
    const [selectedCategory, setSelectedCategory] = useState(route.params?.filters?.property_category || "");
    const [selectedBudget, setSelectedBudget] = useState(route.params?.filters?.budget || "");
    const [selectedSize, setSelectedSize] = useState(route.params?.filters?.flatSize || "");
    const [selectedCity, setSelectedCity] = useState(route.params?.filters?.city || "");
    const [isFilterModalVisible, setFilterModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = useCallback((pageNum) => {
        const filters = {};
        if (selectedCategory) filters.propertyCategory = selectedCategory;

        // Backend will handle the string mapping for '10L', '25L', etc.
        if (selectedBudget) filters.budget = selectedBudget.toUpperCase();

        // Backend handles flatSize based on category
        if (selectedSize) filters.flatSize = selectedSize;

        // Note: City isn't supported by the backend controller from the snippet yet,
        // but passing it won't break anything.
        if (selectedCity) filters.city = selectedCity;

        // Return the promise so we can await it in onRefresh
        return dispatch(fetchListingPropertiesAsync({
            page: pageNum,
            limit: 20,
            ...filters
        }));
    }, [dispatch, selectedCategory, selectedBudget, selectedSize, selectedCity]);

    // Update effect to run when ANY filter changes
    useEffect(() => {
        // Enforce House/Apartment if size is selected
        if (selectedSize && selectedCategory !== "house_apartment") {
            setSelectedCategory("house_apartment");
            return; // State update will trigger this effect again
        }

        dispatch(clearListingProperties());
        fetchData(1);

    }, [fetchData]);

    // No need for frontend filtering, we use the raw listing from Redux (populated by API)
    const filteredListing = listing;

    const handleLoadMore = () => {
        if (listingStatus !== 'loading' && hasMore) {
            fetchData(page + 1);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        dispatch(clearListingProperties());
        await fetchData(1);
        setRefreshing(false);
    }, [dispatch, fetchData]);

    const toggleFilterModal = () => setFilterModalVisible(!isFilterModalVisible);

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            {/* Nav Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Properties</Text>
                <TouchableOpacity onPress={toggleFilterModal} style={styles.filterBtn}>
                    <Ionicons name="filter" size={20} color="#333" />
                </TouchableOpacity>
            </View>

            {/* Horizontal Category Scroll */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
                {FILTER_CATEGORIES.map((cat) => (
                    <TouchableOpacity
                        key={cat.value}
                        style={[styles.filterChip, selectedCategory === cat.value && styles.activeChip]}
                        onPress={() => {
                            // Smart Switching: If switching to a category that isn't House/Apartment,
                            // clear the size filter so the user isn't forced back.
                            if (cat.value !== "house_apartment") {
                                setSelectedSize("");
                            }
                            setSelectedCategory(cat.value);
                        }}
                    >
                        <Text style={[styles.chipText, selectedCategory === cat.value && styles.activeChipText]}>{cat.label}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    const renderFooter = () => {
        if (listingStatus === 'loading') {
            return (
                <View style={styles.footerLoader}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            );
        }
        return <View style={{ height: 50 }} />;
    };

    const renderItem = useCallback(({ item }) => (
        <PropertyCard
            item={item}
            style={styles.propertyCard}
        />
    ), []);

    return (
        <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
            {renderHeader()}

            {/* Show Skeletons if loading initially and no data */}
            {listingStatus === 'loading' && listing.length === 0 ? (
                <FlatList
                    data={[1, 2, 3, 4, 5, 6, 7, 8]} // Dummy data for skeletons
                    renderItem={() => (
                        <SkeletonPropertyCard style={styles.propertyCard} />
                    )}
                    keyExtractor={(item) => item.toString()}
                    contentContainerStyle={styles.listContent}
                    columnWrapperStyle={styles.columnWrapper}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <FlatList
                    data={filteredListing} // Use filtered list
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `${item.id || item._id || 'prop'}-${index}`}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                    contentContainerStyle={styles.listContent}
                    columnWrapperStyle={styles.columnWrapper}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    initialNumToRender={8}
                    maxToRenderPerBatch={8}
                    windowSize={5}
                    removeClippedSubviews={true}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#007bff"]} />
                    }
                    ListEmptyComponent={
                        listingStatus !== 'loading' && (
                            <View style={styles.centerContainer}>
                                <Text style={styles.emptyText}>No properties found.</Text>
                            </View>
                        )
                    }
                />
            )}

            {/* Simple Filter Modal for Budget/Size */}
            <Modal visible={isFilterModalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { paddingBottom: Math.max(insets.bottom, 20), maxHeight: hp('90%') }]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Filters</Text>
                            <TouchableOpacity onPress={toggleFilterModal}>
                                <Ionicons name="close" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                            <Text style={styles.filterLabel}>Budget</Text>
                            <View style={styles.optionRow}>
                                {BUDGET_OPTIONS.map((opt) => (
                                    <TouchableOpacity key={opt.value}
                                        style={[styles.modalChip, selectedBudget === opt.value && styles.activeModalChip]}
                                        onPress={() => setSelectedBudget(opt.value)}
                                    >
                                        <Text style={[styles.modalChipText, selectedBudget === opt.value && styles.activeModalChipText]}>{opt.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.filterLabel}>Size</Text>
                            <View style={styles.optionRow}>
                                {SIZE_OPTIONS.map((opt) => (
                                    <TouchableOpacity key={opt.value}
                                        style={[styles.modalChip, selectedSize === opt.value && styles.activeModalChip]}
                                        onPress={() => setSelectedSize(opt.value)}
                                    >
                                        <Text style={[styles.modalChipText, selectedSize === opt.value && styles.activeModalChipText]}>{opt.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.filterLabel}>City</Text>
                            <View style={styles.optionRow}>
                                <TouchableOpacity
                                    style={[styles.modalChip, selectedCity === "" && styles.activeModalChip]}
                                    onPress={() => setSelectedCity("")}
                                >
                                    <Text style={[styles.modalChipText, selectedCity === "" && styles.activeModalChipText]}>Any</Text>
                                </TouchableOpacity>
                                {CITIES.map((city) => (
                                    <TouchableOpacity key={city}
                                        style={[styles.modalChip, selectedCity === city && styles.activeModalChip]}
                                        onPress={() => setSelectedCity(city)}
                                    >
                                        <Text style={[styles.modalChipText, selectedCity === city && styles.activeModalChipText]}>{city}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <TouchableOpacity style={styles.applyBtn} onPress={toggleFilterModal}>
                                <Text style={styles.applyBtnText}>Apply Filters</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    propertyCard: {
        width: wp('44%'),
        marginRight: 0,
        marginBottom: hp('2%'),
    },
    root: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    headerContainer: {
        backgroundColor: '#fff',
        paddingBottom: 10,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        zIndex: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp('4%'),
        paddingVertical: hp('1.5%'),
    },
    headerTitle: {
        fontSize: wp('4.5%'),
        fontWeight: 'bold',
        color: '#333',
        fontFamily: 'Poppins-Bold',
    },
    filterBtn: {
        padding: 4,
    },
    filterScroll: {
        marginTop: 5,
    },
    filterContent: {
        paddingHorizontal: wp('4%'),
        paddingRight: wp('8%'),
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#eee',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#eee',
    },
    activeChip: {
        backgroundColor: '#007bff',
        borderColor: '#007bff',
    },
    chipText: {
        fontSize: 13,
        color: '#666',
        fontFamily: 'Poppins-Medium',
    },
    activeChipText: {
        color: '#fff',
        fontFamily: 'Poppins-Medium',
    },
    listContent: {
        paddingHorizontal: wp('4%'),
        paddingTop: hp('2%'),
        paddingBottom: hp('5%'),
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    footerLoader: {
        paddingVertical: hp('2%'),
        alignItems: 'center',
    },
    centerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp('10%'),
    },
    emptyText: {
        fontSize: wp('4%'),
        color: '#888',
        fontFamily: 'Poppins-Regular',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: wp('5%'),
        paddingTop: 20,
        width: wp('100%'),
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-Bold',
        color: '#000',
    },
    filterLabel: {
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
        marginBottom: 10,
        marginTop: 10,
        color: '#333',
    },
    optionRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    modalChip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        marginRight: 10,
        marginBottom: 10,
    },
    activeModalChip: {
        backgroundColor: '#e6f0ff',
        borderWidth: 1,
        borderColor: '#4834d4', // Updated to primary
    },
    modalChipText: {
        color: '#555',
        fontFamily: 'Poppins-Regular',
    },
    activeModalChipText: {
        color: '#4834d4', // Updated to primary
        fontFamily: 'Poppins-Medium',
    },
    applyBtn: {
        marginTop: 20,
        backgroundColor: '#4834d4', // Updated to primary
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    applyBtnText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
    },
});

export default PropertyListingScreen;
