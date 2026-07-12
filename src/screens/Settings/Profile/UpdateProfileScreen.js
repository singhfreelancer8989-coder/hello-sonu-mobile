import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons, Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import useAuth from "../../../hooks/useAuth";
import { globalApiRequest } from "../../../utility/api.utility";
import { user as userEndpoints } from "../../../constants/endpoint.constant";

const UpdateProfileScreen = () => {
  const navigation = useNavigation();
  const { userData, updateProfileState } = useAuth();

  const [firstName, setFirstName] = useState(userData?.firstName || "");
  const [lastName, setLastName] = useState(userData?.lastName || "");
  const [email, setEmail] = useState(userData?.email || "");
  const [phone, setPhone] = useState(userData?.phone || userData?.mobile || userData?.mobileNumber || "");
  const [isSaving, setIsSaving] = useState(false);

  const initials = `${firstName ? firstName[0] : ""}${lastName ? lastName[0] : ""}`.toUpperCase() || "U";

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
      Alert.alert("Validation Error", "All fields are required.");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
      };

      const response = await globalApiRequest(
        true,
        "PUT",
        userEndpoints.profile,
        payload
      );

      if (response) {
        await updateProfileState({
          firstName: payload.first_name,
          lastName: payload.last_name,
          email: payload.email,
          phone: payload.phone,
        });
        Alert.alert("Success", "Profile updated successfully.");
        navigation.goBack();
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("[UpdateProfileScreen] Save error:", error);
      Alert.alert("Error", error.message || "Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Update Profile</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: wp('4.5%') }}>
        {/* Avatar Preview */}
        <View style={styles.avatar}>
          <Text style={styles.initials}>{initials}</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter First Name"
          />

          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter Last Name"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter Phone Number"
            keyboardType="phone-pad"
          />

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={isSaving}>
            {isSaving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Feather name="save" size={20} color="#fff" />
                <Text style={styles.saveBtnText}>Save Changes</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default UpdateProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: wp('4%'),
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
  },
  title: {
    fontSize: wp('4.5%'), // 18
    color: "#222",
    marginLeft: wp('3%'),
    fontFamily: "Poppins-SemiBold",
  },

  /* Avatar Preview */
  avatar: {
    width: wp('22.5%'), // 90
    height: wp('22.5%'), // 90
    borderRadius: wp('11.25%'),
    backgroundColor: "#007AFF20",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginVertical: hp('2.5%'),
  },
  initials: {
    fontSize: wp('8%'), // 32
    fontFamily: "Poppins-SemiBold",
    color: "#007AFF",
  },

  /* Form */
  form: {
    marginTop: hp('1.25%'),
  },
  label: {
    fontSize: wp('3.5%'), // 14
    color: "#555",
    fontFamily: "Poppins-Medium",
    marginBottom: hp('0.75%'),
    marginTop: hp('1.75%'),
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: wp('3.5%'),
    paddingVertical: hp('1.25%'),
    fontSize: wp('3.75%'), // 15
    color: "#222",
    backgroundColor: "#fff",
    fontFamily: "Poppins-Regular",
  },

  /* Save Button */
  saveBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: hp('1.75%'),
    borderRadius: 10,
    marginTop: hp('3.75%'),
    gap: 8,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: wp('4%'), // 16
    fontFamily: "Poppins-Medium",
  },
});
