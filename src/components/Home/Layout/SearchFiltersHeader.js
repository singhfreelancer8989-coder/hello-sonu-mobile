import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { MaterialIcons, Entypo } from "@expo/vector-icons";

/* PROPERTY TYPE OPTIONS */
const propertyTypes = [
  "House / Apartment / Flats",
  "Plots",
  "Shop / Godown / Office",
  "Agriculture Land / Farm House",
];

/* WHITE CHIP OPTIONS */
const budgets = ["10L", "25L", "35L", "50L"];
const sizes = ["1 BHK", "2 BHK", "3 BHK", "4+ BHK"];

/* ------------------------
   DROPDOWN COMPONENT
------------------------ */
const DropdownChip = ({ title, data, selected, onSelect, id, openDropdown, setOpenDropdown }) => {
  const isOpen = openDropdown === id;

  return (
    <View style={{ position: "relative", zIndex: isOpen ? 9999 : 1 }}>
      <TouchableOpacity
        style={styles.whiteChip}
        onPress={() => setOpenDropdown(isOpen ? null : id)}
        activeOpacity={0.8}
      >
        <Text style={styles.chipText}>{selected || title}</Text>
        <Entypo name={isOpen ? "chevron-up" : "chevron-down"} size={16} color="#444" />
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
                  selected === item && styles.whiteText,
                ]}
              >
                {item}
              </Text>
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
const SearchFiltersHeader = () => {
  const [budget, setBudget] = useState(null);
  const [size, setSize] = useState(null);
  const [propertyType, setPropertyType] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  return (
    <View>
      {/* Overlay to close dropdown when clicking outside */}
      {openDropdown !== null && (
        <Pressable
          style={[StyleSheet.absoluteFill, { zIndex: 1 }]}
          onPress={() => setOpenDropdown(null)}
        />
      )}

      <View style={{ zIndex: 2 }}>
        <View style={styles.container}>
          <View style={styles.row}>
            
            {/* LOCATION CHIP */}
            <TouchableOpacity style={styles.locationChip} activeOpacity={0.8}>
              <MaterialIcons name="location-pin" size={18} color="#fff" />
              <Text style={styles.locText}>Location</Text>
            </TouchableOpacity>

            {/* BUDGET DROPDOWN */}
            <DropdownChip
              id="budget"
              title="Budget"
              data={budgets}
              selected={budget}
              onSelect={setBudget}
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
            />

            {/* SIZE DROPDOWN */}
            <DropdownChip
              id="size"
              title="Size"
              data={sizes}
              selected={size}
              onSelect={setSize}
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
            />

            {/* PROPERTY TYPE DROPDOWN */}
            <DropdownChip
              id="propertyType"
              title="Property Type"
              data={propertyTypes}
              selected={propertyType}
              onSelect={setPropertyType}
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
            />

          </View>
        </View>
      </View>
    </View>
  );
};

export default SearchFiltersHeader;

/* -----------------------------
          STYLES
------------------------------ */
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap:5
  },
  locationChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3ACD58",
    paddingHorizontal: 16,
    height: 42,
    borderRadius: 14,
  },
  locText: {
    color: "#fff",
    marginLeft: 6,
    fontSize: 15,
    fontWeight: "500",
  },
  whiteChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E6E6E6",
  },
  chipText: {
    fontSize: 15,
    color: "#444",
    marginRight: 6,
  },
  dropdownMenu: {
    position: "absolute",
    top: 48,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e6e6e6",
    zIndex: 9999,
    elevation: 20,
    minWidth: 150,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#444",
  },
  dropdownItemActive: {
    backgroundColor: "#3ACD58",
  },
  whiteText: {
    color: "#fff",
  },
});
