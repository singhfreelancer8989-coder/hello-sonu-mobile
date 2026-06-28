import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import useAuth from "../../../hooks/useAuth";
import { changePassword } from "../../../services/auth/auth.service";

const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const { userData, logout } = useAuth();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSave = async () => {
    // Basic Form Validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New password and Confirm password do not match.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      // Typically the route might be `/user/auth/change-password` depending on your API. 
      // If it exists in endpoints.js, prefer that. Using a standard REST approach for now:
      const payload = {
        old_password: oldPassword,
        new_password: newPassword
      };
      // console.log(payload);

      const response = await changePassword(payload);

      Alert.alert("Success", "Your password has been changed successfully.", [
        { text: "OK", onPress: () => logout() }
      ]);
    } catch (error) {
      // The globalApiRequest utility typically throws an Error object or string based on catch block length
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to change password. Please verify your current password.";
      Alert.alert("Update Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Ionicons name="chevron-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Change Password</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: wp('4.5%') }} keyboardShouldPersistTaps="handled">

        <View style={styles.infoContainer}>
          <Ionicons name="lock-closed-outline" size={wp('15%')} color="#007AFF" style={styles.lockIcon} />
          <Text style={styles.infoText}>Your new password must be securely formed and at least 6 characters long.</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Current Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={oldPassword}
              onChangeText={setOldPassword}
              placeholder="Enter current password"
              secureTextEntry={!showOldPassword}
            />
            <TouchableOpacity onPress={() => setShowOldPassword(!showOldPassword)} style={styles.eyeIcon}>
              <Ionicons name={showOldPassword ? "eye-off" : "eye"} size={20} color="#777" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>New Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
              secureTextEntry={!showNewPassword}
            />
            <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.eyeIcon}>
              <Ionicons name={showNewPassword ? "eye-off" : "eye"} size={20} color="#777" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Confirm New Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
              <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={20} color="#777" />
            </TouchableOpacity>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Feather name="check" size={18} color="#fff" />
                <Text style={styles.saveBtnText}>Update Password</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: hp('1.5%'),
    paddingBottom: hp('1.5%'),
    paddingHorizontal: wp('3%'),
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
  },
  title: {
    fontSize: wp('4.5%'),
    color: "#222",
    fontFamily: "Poppins-SemiBold",
  },
  infoContainer: {
    alignItems: 'center',
    marginVertical: hp('3%'),
    paddingHorizontal: wp('4%'),
  },
  lockIcon: {
    marginBottom: hp('1.5%'),
  },
  infoText: {
    textAlign: 'center',
    color: '#666',
    fontFamily: 'Poppins-Regular',
    fontSize: wp('3.5%'), // ~14
  },
  /* Form */
  form: {
    marginTop: hp('1%'),
  },
  label: {
    fontSize: wp('3.6%'), // 14
    color: "#555",
    fontFamily: "Poppins-Medium",
    marginBottom: hp('0.75%'),
    marginTop: hp('1.5%'),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#F9F9F9",
  },
  input: {
    flex: 1,
    paddingHorizontal: wp('3.5%'),
    paddingVertical: hp('1.5%'),
    fontSize: wp('3.8%'), // 15
    color: "#222",
    fontFamily: "Poppins-Regular",
  },
  eyeIcon: {
    padding: wp('3%'),
  },
  /* Save Button */
  saveBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: hp('1.75%'),
    borderRadius: 10,
    marginTop: hp('4%'),
    gap: 8,
  },
  saveBtnDisabled: {
    backgroundColor: '#007AFF80'
  },
  saveBtnText: {
    color: "#fff",
    fontSize: wp('4%'), // 16
    fontFamily: "Poppins-Medium",
  },
});
