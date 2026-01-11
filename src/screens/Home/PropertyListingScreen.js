import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from 'react-redux';
import { fetchListingPropertiesAsync, clearListingProperties } from '../../store/slices/propertySlices';
import PropertyCard from '../../components/Home/Core/PropertyCard';
import SkeletonPropertyCard from '../../components/Home/Core/SkeletonPropertyCard';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

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
];

const PropertyListingScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const route = useRoute();

    const { listing, listingStatus, listingPagination } = useSelector((state) => state.property);
    const { page, hasMore } = listingPagination;

    // Local Filter State
    const [selectedCategory, setSelectedCategory] = useState(route.params?.filters?.property_category || "");
    const [selectedBudget, setSelectedBudget] = useState(route.params?.filters?.budget || "");
    const [selectedSize, setSelectedSize] = useState(route.params?.filters?.flatSize || "");
    const [selectedCity, setSelectedCity] = useState(route.params?.filters?.city || "");
    const [isFilterModalVisible, setFilterModalVisible] = useState(false);

    // Initial Load & Filter Changes
    useEffect(() => {
        // Reset and Fetch whenever filters change (except page)
        dispatch(clearListingProperties());
        fetchData(1);

        return () => {
            // Optional: clear on unmount if we want fresh state every time
            // dispatch(clearListingProperties());
        };
    }, [selectedCategory, selectedBudget, selectedSize, selectedCity]);

    const fetchData = (pageNum) => {
        const filters = {};
        if (selectedCategory) filters.propertyCategory = selectedCategory; // API expects 'propertyCategory' or 'property_category'? Service handles mapping? User provided 'propertyCategory=plots' and 'property_category=plots'. Using the service's direct param passing.
        // Actually, user's query example usage: property_category=plots.
        // My previous dummy logic used property_category. The API response has propertyCategory.
        // The URL param request example: property_category=plots
        if (selectedCategory) filters.property_category = selectedCategory;
        if (selectedBudget) filters.budget = selectedBudget;
        if (selectedSize) filters.flatSize = selectedSize;
        if (selectedCity) filters.city = selectedCity;

        dispatch(fetchListingPropertiesAsync({
            page: pageNum,
            limit: 10,
            ...filters
        }));
    };

    const handleLoadMore = () => {
        if (listingStatus !== 'loading' && hasMore) {
            fetchData(page + 1);
        }
    };

    const toggleFilterModal = () => setFilterModalVisible(!isFilterModalVisible);

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            {/* Nav Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
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
                        onPress={() => setSelectedCategory(cat.value)}
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

    const renderItem = ({ item }) => (
        <PropertyCard
            item={item}
            style={{
                width: wp('44%'),
                marginRight: 0,
                marginBottom: hp('2%')
            }}
        />
    );

    return (
        <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
            {renderHeader()}

            {/* Show Skeletons if loading initially and no data */}
            {listingStatus === 'loading' && listing.length === 0 ? (
                <FlatList
                    data={[1, 2, 3, 4, 5, 6, 7, 8]} // Dummy data for skeletons
                    renderItem={() => (
                        <SkeletonPropertyCard
                            style={{
                                width: wp('44%'),
                                marginRight: 0,
                                marginBottom: hp('2%')
                            }}
                        />
                    )}
                    keyExtractor={(item) => item.toString()}
                    contentContainerStyle={styles.listContent}
                    columnWrapperStyle={styles.columnWrapper}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <FlatList
                    data={listing}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                    contentContainerStyle={styles.listContent}
                    columnWrapperStyle={styles.columnWrapper}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
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
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Filters</Text>
                            <TouchableOpacity onPress={toggleFilterModal}>
                                <Ionicons name="close" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>

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

                        <Text style={styles.filterLabel}>Flat Size</Text>
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

                        <TouchableOpacity style={styles.applyBtn} onPress={toggleFilterModal}>
                            <Text style={styles.applyBtnText}>Apply Filters</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
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
        fontWeight: '500',
    },
    activeChipText: {
        color: '#fff',
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
        padding: 20,
        minHeight: hp('40%'),
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    filterLabel: {
        fontSize: 14,
        fontWeight: '600',
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
        borderColor: '#007bff',
    },
    modalChipText: {
        color: '#555',
    },
    activeModalChipText: {
        color: '#007bff',
        fontWeight: 'bold',
    },
    applyBtn: {
        marginTop: 20,
        backgroundColor: '#007bff',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    applyBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default PropertyListingScreen;
