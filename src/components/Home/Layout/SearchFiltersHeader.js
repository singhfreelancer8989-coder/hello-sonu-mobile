import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";

const SearchFiltersHeader = () => {
  const [search, setSearch] = useState("");

  return (
    <View style={styles.container}>
      {/* SEARCH + FILTER ROW */}
      <View style={styles.row}>
        {/* Search Input */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#7C7C7C" />
          <TextInput
            placeholder="Search..."
            placeholderTextColor="#A0A0A0"
            value={search}
            onChangeText={setSearch}
            style={styles.input}
          />
        </View>

        {/* Filters Button */}
        <TouchableOpacity style={styles.filterButton} activeOpacity={0.8}>
          <Ionicons name="options" size={20} color="#fff" />
          <Text style={styles.filterText}>Filters</Text>
        </TouchableOpacity>
      </View>

      {/* FILTER CHIPS */}
      <View style={styles.chipRow}>
        {/* Location Chip */}
        <TouchableOpacity style={[styles.chip, styles.chipRed]}>
          <MaterialIcons name="location-pin" size={18} color="#fff" />
          <Text style={styles.chipTextWhite}>Location</Text>
        </TouchableOpacity>

        {/* Budget Chip */}
        <TouchableOpacity style={styles.chip}>
          <Text style={styles.chipText}>Budget</Text>
          <Entypo name="chevron-down" size={16} color="#666" />
        </TouchableOpacity>

        {/* Size Chip */}
        <TouchableOpacity style={styles.chip}>
          <Text style={styles.chipText}>Size</Text>
          <Entypo name="chevron-down" size={16} color="#666" />
        </TouchableOpacity>
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
    marginTop: 10,
    marginBottom:5
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  /* Search Box */
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 45,
    borderWidth: 1,
    borderColor: "#E6E6E6",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },

  input: {
    marginLeft: 8,
    fontSize: 15,
    color: "#333",
    flex: 1,
  },

  /* Purple Filters Button */
  filterButton: {
    marginLeft: 10,
    backgroundColor: "#6F2DFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    height: 45,
    borderRadius: 14,
  },

  filterText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 6,
  },

  /* Chips Row */
  chipRow: {
    flexDirection: "row",
    marginTop: 12,
  },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E6E6E6",
    marginRight: 10,

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },

  chipRed: {
    backgroundColor: "#FF5A5F",
    borderColor: "transparent",
  },

  chipText: {
    fontSize: 14,
    color: "#444",
    marginRight: 6,
  },

  chipTextWhite: {
    fontSize: 14,
    color: "#fff",
    marginLeft: 4,
  },
});
