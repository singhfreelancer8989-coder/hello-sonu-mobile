import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons, FontAwesome5, Entypo, MaterialIcons, Feather } from "@expo/vector-icons";

const SettingsItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.itemRow} onPress={onPress}>
    <View style={styles.iconWrapper}>{icon}</View>
    <Text style={styles.itemLabel}>{label}</Text>
  </TouchableOpacity>
);

const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
       <View style={styles.header}>
              <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
              <Text style={styles.headerTitle}>Settings</Text>
            </View>

      {/* List */}
      <ScrollView style={{ marginTop: 20 }}>
        
        <SettingsItem
          label="About Us"
          icon={<Entypo name="info-with-circle" size={20} color="#000" />}
        />
        <SettingsItem
          label="Best Investment Property"
          icon={<Entypo name="info-with-circle" size={20} color="#000" />}
        />
        <SettingsItem
          label="Your Property View"
          icon={<Entypo name="info-with-circle" size={20} color="#000" />}
        />

        <SettingsItem
          label="Map at Hello Sonu"
          icon={<Entypo name="location-pin" size={20} color="#000" />}
        />

        <SettingsItem
          label="Privacy Policy"
          icon={<MaterialIcons name="privacy-tip" size={22} color="#000" />}
        />

        <SettingsItem
          label="Contact Us"
          icon={<Feather name="user" size={22} color="#000" />}
        />

        <SettingsItem
          label="Refer & Earn"
          icon={<MaterialIcons name="help-outline" size={22} color="#000" />}
        />

        <SettingsItem
          label="Logout"
          icon={<MaterialIcons name="logout" size={22} color="#000" />}
        />
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 18,
  },

    // Header Styles
  header: {
    flexDirection: 'row',
    gap:"35%",
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

  // Items
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth:1
  },
  iconWrapper: {
    width: 30,
    alignItems: "center",
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 10,
    color: "#000",
  },
});
