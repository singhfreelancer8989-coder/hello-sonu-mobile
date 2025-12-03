import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Entypo, MaterialIcons, Feather, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const SettingsItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.itemRow} onPress={onPress}>
    <View style={styles.iconWrapper}>{icon}</View>
    <Text style={styles.itemLabel}>{label}</Text>
  </TouchableOpacity>
);

const SettingsScreen = () => {
  const Navigator = useNavigation();

  // You can fetch these from user state
  const firstName = "Hello";
  const lastName = "Sonu";

  const initials = `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`.toUpperCase();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => Navigator.navigate("Home")}>
          <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* Profile Section */}
      <TouchableOpacity
        style={styles.profileSection}
        onPress={() => Navigator.navigate("UpdateProfileScreen")}
        activeOpacity={0.8}
      >
        <View style={styles.profileCircle}>
          <Text style={styles.profileInitials}>{initials}</Text>
        </View>

        <View>
          <Text style={styles.profileName}>{firstName} {lastName}</Text>
          <Text style={styles.profileSubText}>View & Edit Profile</Text>
        </View>
      </TouchableOpacity>

      {/* Settings List */}
      <ScrollView style={{ marginTop: 25 }}>
        <SettingsItem
          onPress={() => Navigator.navigate("AboutUsScreen")}
          label="About Us"
          icon={<Entypo name="info-with-circle" size={22} color="#000" />}
        />

        <SettingsItem
          onPress={() => Navigator.navigate("RegisterBrokerScreen")}
          label="Join with us?"
          icon={<AntDesign name="user-add" size={22} color="#000" />}
        />

        <SettingsItem
          label="Map at Hello Sonu"
          icon={<Entypo name="location-pin" size={22} color="#000" />}
        />

        <SettingsItem
          onPress={() => Navigator.navigate("PrivacyPolicyScreen")}
          label="Privacy Policy"
          icon={<MaterialIcons name="privacy-tip" size={22} color="#000" />}
        />

        <SettingsItem
          onPress={() => Navigator.navigate("ContactUsScreen")}
          label="Contact Us"
          icon={<Feather name="user" size={22} color="#000" />}
        />

        <SettingsItem
          onPress={() => console.log("Logout")}
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

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
  },
  headerTitle: {
    fontSize: 18,
    color: "#333",
    fontFamily: 'Poppins-Medium',
  },

  /* Profile Section */
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomColor: "#EAEAEA",
    gap: 14,
  },
  profileCircle: {
    height: 64,
    width: 64,
    borderRadius: 32,
    backgroundColor: "#007AFF20",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitials: {
    fontSize: 22,
    color: "#007AFF",
    fontFamily: 'Poppins-SemiBold',
  },
  profileName: {
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
    color: "#222",
  },
  profileSubText: {
    fontSize: 13,
    color: "#666",
    fontFamily: 'Poppins-Regular',
  },

  /* List Items */
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
  },
  iconWrapper: {
    width: 32,
    alignItems: "center",
  },
  itemLabel: {
    fontSize: 15.5,
    marginLeft: 12,
    color: "#222",
    fontFamily: 'Poppins-Medium',
  },
});
