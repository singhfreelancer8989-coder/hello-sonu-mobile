import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Entypo, MaterialIcons, Feather, AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { handleLogout } from "../../services/auth/auth.service";
import useAuth from "../../hooks/useAuth";

const SettingsItem = ({ icon, label, onPress }) => (

  <TouchableOpacity style={styles.itemRow} onPress={onPress}>
    <View style={styles.iconWrapper}>{icon}</View>
    <Text style={styles.itemLabel}>{label}</Text>
  </TouchableOpacity>
);

const SettingsScreen = () => {
  const Navigator = useNavigation();
  const { logout, userData } = useAuth();

  // You can fetch these from user state
  const firstName = userData.firstName;
  const lastName = userData.lastName;

  const initials = `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`.toUpperCase();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => Navigator.navigate("Home")}>
          <Ionicons name="chevron-back" size={24} color="#007AFF" />
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
      <ScrollView style={{ marginTop: hp('3%') }}>
        <SettingsItem
          onPress={() => Navigator.navigate("ChangePasswordScreen")}
          label="Change Password"
          icon={<Feather name="lock" size={22} color="#000" />}
        />

        <SettingsItem
          onPress={() => Navigator.navigate("AboutUsScreen")}
          label="About Us"
          icon={<Entypo name="info-with-circle" size={22} color="#000" />}
        />

        <SettingsItem
          onPress={() => Navigator.navigate("MyPropertiesScreen")}
          label="My Properties"
          icon={<MaterialIcons name="list-alt" size={22} color="#000" />}
        />



        <SettingsItem
          onPress={() => Navigator.navigate("RegisterBrokerScreen")}
          label="Join with us?"
          icon={<AntDesign name="user-add" size={22} color="#000" />}
        />

        <SettingsItem
          onPress={() => Navigator.navigate("MapScreen")}
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

        {userData?.role === 'admin' && (
          <SettingsItem
            onPress={() => Navigator.navigate("AnalyticsStack", { screen: "ViewAnalyticsScreen" })}
            label="Analytics"
            icon={<MaterialIcons name="analytics" size={22} color="#000" />}
          />
        )}

        {userData?.role === 'admin' && (
          <SettingsItem
            onPress={() => Navigator.navigate("DeletedUserPropertiesScreen")}
            label="Deleted User Properties"
            icon={<MaterialIcons name="delete-sweep" size={22} color="#000" />}
          />
        )}

        <SettingsItem
          onPress={() => handleLogout(logout)}
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
    paddingHorizontal: wp('4.5%'),
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp('1.8%'),
    gap: wp('4.5%'),
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
  },
  headerTitle: {
    fontSize: wp('4.5%'), // 18
    color: "#333",
    fontFamily: 'Poppins-Medium',
  },

  /* Profile Section */
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp('2%'),
    borderBottomColor: "#EAEAEA",
    gap: wp('3.5%'),
  },
  profileCircle: {
    height: wp('16%'),
    width: wp('16%'),
    borderRadius: wp('8%'),
    backgroundColor: "#007AFF20",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitials: {
    fontSize: wp('5.5%'), // 22
    color: "#007AFF",
    fontFamily: 'Poppins-SemiBold',
  },
  profileName: {
    fontSize: wp('4.25%'), // 17
    fontFamily: 'Poppins-SemiBold',
    color: "#222",
  },
  profileSubText: {
    fontSize: wp('3.25%'), // 13
    color: "#666",
    fontFamily: 'Poppins-Regular',
  },

  /* List Items */
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp('2.2%'),
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
  },
  iconWrapper: {
    width: wp('8%'),
    alignItems: "center",
  },
  itemLabel: {
    fontSize: wp('3.8%'), // 15.5
    marginLeft: wp('3%'),
    color: "#222",
    fontFamily: 'Poppins-Medium',
  },
});
