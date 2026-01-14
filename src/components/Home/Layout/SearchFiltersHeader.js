import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { CITIES } from "../../../constants/data.constant";

/* PROPERTY TYPE OPTIONS */
const propertyTypes = [
  "Plots",
  "House/Apartment",
  "Office/Shop",
  "Agricultural Land",
];

/* OPTIONS */
const budgets = ["10L+", "25L+", "50L+", "1Cr+"];
const sizes = ["1 BHK", "2 BHK", "3 BHK", "4+ BHK"];

/* THEME COLORS */
const COLORS = {
  primary: '#4834d4', // Same Blue as Bottom Tab
  white: '#ffffff',
  textDark: '#2d3436',
  textLight: '#636e72',
  border: '#e0e0e0',
  backgroundLight: '#f8f9fa'
};

/* ------------------------
   DROPDOWN COMPONENT
------------------------ */
const DropdownChip = ({ title, data, selected, onSelect, id, openDropdown, setOpenDropdown, icon }) => {
  const isOpen = openDropdown === id;
  const isSelected = !!selected;

  return (
    <View style={{ position: "relative", zIndex: isOpen ? 1000 : 1 }}>
      <TouchableOpacity
        style={[
          styles.chip,
          isOpen && styles.chipActiveBorder, // Blue border when open
          isSelected && styles.chipSelectedBg // Light blue bg when value selected
        ]}
        onPress={() => setOpenDropdown(isOpen ? null : id)}
        activeOpacity={0.7}
      >
        {icon && <MaterialIcons name={icon} size={18} color={isSelected ? COLORS.primary : COLORS.textLight} style={{ marginRight: 4 }} />}
        <Text style={[
          styles.chipText,
          (isOpen || isSelected) && styles.chipTextActive
        ]}>
          {selected || title}
        </Text>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={16}
          color={(isOpen || isSelected) ? COLORS.primary : COLORS.textLight}
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdownMenu}>
          {data.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dropdownItem,
                selected === item && styles.dropdownItemActive,
              ]}
              onPress={() => {
                onSelect(item);
                setOpenDropdown(null);
              }}
            >
              <Text
                style={[
                  styles.dropdownItemText,
                  selected === item && styles.dropdownItemTextActive,
                ]}
              >
                {item}
              </Text>
              {selected === item && (
                <Ionicons name="checkmark" size={16} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

/* ------------------------
           MAIN
------------------------ */
const SearchFiltersHeader = ({ onSearch }) => {
  const [budget, setBudget] = useState(null);
  const [size, setSize] = useState(null);
  const [propertyType, setPropertyType] = useState(null);
  const [city, setCity] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  /* HELPER TO TRIGGER SEARCH IMMEDIATELY */
  const triggerSearch = (field, value) => {
    if (!onSearch) return;

    // Use the new value for the changed field, and current state for others
    const current = {
      propertyType: field === 'propertyType' ? value : propertyType,
      budget: field === 'budget' ? value : budget,
      size: field === 'size' ? value : size,
      city: field === 'city' ? value : city,
    };

    const filters = {};

    // Map Property Type
    if (current.propertyType) {
      const map = {
        "Plots": "plots",
        "House/Apartment": "house_apartment",
        "Office/Shop": "office_shop",
        "Agricultural Land": "agriculture_land",
        "Flats": "flats"
      };
      filters.property_category = map[current.propertyType] || current.propertyType;
    }

    // Map Budget
    if (current.budget) {
      filters.budget = current.budget.replace('+', '');
    }

    // Map Size
    if (current.size) {
      filters.flatSize = current.size;
    }

    // Map City
    if (current.city) {
      filters.city = current.city;
    }

    onSearch(filters);
  };

  const handleSelectPropertyType = (val) => {
    setPropertyType(val);
    triggerSearch('propertyType', val);
  };

  const handleSelectBudget = (val) => {
    setBudget(val);
    triggerSearch('budget', val);
  };

  const handleSelectSize = (val) => {
    setSize(val);
    triggerSearch('size', val);
  };

  const handleSelectCity = (val) => {
    setCity(val);
    triggerSearch('city', val);
  };

  // const hasFilters = budget || size || propertyType || city; // No longer needed for button logic

  return (
    <View style={styles.mainWrapper}>
      {/* Overlay to close dropdown when clicking outside */}
      {openDropdown !== null && (
        <Pressable
          style={styles.overlay}
          onPress={() => setOpenDropdown(null)}
        />
      )}

      <ScrollView
        horizontal
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsHorizontalScrollIndicator={false}
      >
        {/* REMOVED SEARCH BUTTON & LOCATION CHIP PLACEHOLDER - AUTO SEARCH ACTIVE */}

        {/* CITY DROPDOWN */}
        <DropdownChip
          id="city"
          title="Location"
          data={CITIES}
          selected={city}
          onSelect={handleSelectCity}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          icon="location-pin"
        />

        {/* PROPERTY TYPE DROPDOWN */}
        <DropdownChip
          id="propertyType"
          title="Property Type"
          data={propertyTypes}
          selected={propertyType}
          onSelect={handleSelectPropertyType}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
        />

        {/* BUDGET DROPDOWN */}
        <DropdownChip
          id="budget"
          title="Budget"
          data={budgets}
          selected={budget}
          onSelect={handleSelectBudget}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
        />

        {/* SIZE DROPDOWN */}
        <DropdownChip
          id="size"
          title="Size"
          data={sizes}
          selected={size}
          onSelect={handleSelectSize}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
        />

      </ScrollView>
    </View>
  );
};

export default SearchFiltersHeader;

/* -----------------------------
          STYLES
------------------------------ */
const styles = StyleSheet.create({
  mainWrapper: {
    backgroundColor: COLORS.white,
    paddingVertical: hp('1.5%'),
    zIndex: 10, // Ensure dropdowns float above content below
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    // backgroundColor: 'rgba(0,0,0,0.05)', // Optional: Dim background when menu open
  },
  scrollView: {
    zIndex: 2,
    overflow: "visible", // Important for dropdowns to show outside scrollview bounds if needed
  },
  scrollContent: {
    paddingHorizontal: wp('5%'),
    gap: wp('2.5%'), // Easy spacing between items
    alignItems: 'center',
    paddingBottom: hp('0.6%'), // Space for shadow
  },

  // --- LOCATION CHIP ---
  locationChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary, // Blue Theme
    paddingHorizontal: wp('4%'),
    height: hp('5%'), // 40 approx
    borderRadius: 8, // Matching the Header/Tab styling
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    elevation: 4,
    marginRight: 2,
  },
  searchChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: '#00b894', // Green for search action
    paddingHorizontal: wp('4%'),
    height: hp('5%'),
    borderRadius: 8,
    shadowColor: '#00b894',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginRight: 2,
  },
  locText: {
    color: "#fff",
    marginLeft: 6,
    fontSize: wp('3.5%'),
    fontFamily: "Poppins-Medium",
    includeFontPadding: false,
  },

  // --- FILTER CHIPS ---
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingHorizontal: wp('3.5%'),
    height: hp('5%'),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    // Subtle Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  chipActiveBorder: {
    borderColor: COLORS.primary,
    backgroundColor: '#fff',
  },
  chipSelectedBg: {
    backgroundColor: '#f0f3ff', // Very light blue tint
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: wp('3.5%'),
    color: COLORS.textLight,
    marginRight: 6,
    fontFamily: "Poppins-Medium",
    includeFontPadding: false,
  },
  chipTextActive: {
    color: COLORS.primary,
  },

  // --- DROPDOWN MENU ---
  dropdownMenu: {
    position: "absolute",
    top: hp('5.8%'), // Just below the chip
    left: 0,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: hp('1%'),
    minWidth: wp('40%'),

    // Strong Shadow to float above everything
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('1.25%'),
    paddingHorizontal: wp('4%'),
  },
  dropdownItemActive: {
    backgroundColor: '#f8f9fa',
  },
  dropdownItemText: {
    fontSize: wp('3.5%'),
    color: COLORS.textDark,
    fontFamily: "Poppins-Regular",
  },
  dropdownItemTextActive: {
    color: COLORS.primary,
    fontFamily: "Poppins-Medium",
  },
});