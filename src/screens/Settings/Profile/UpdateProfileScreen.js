import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const UpdateProfileScreen = () => {
  const navigation = useNavigation();

  // Dummy user data — replace with your backend/auth state
  const [firstName, setFirstName] = useState("Hello");
  const [lastName, setLastName] = useState("Sonu");
  const [email, setEmail] = useState("support@hellosonu.com");
  const [phone, setPhone] = useState("+91 9876543210");

  const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();

  const handleSave = () => {
    // Perform API call or state update
    Alert.alert("Profile Updated", "Your profile details have been saved.");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Update Profile</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 18 }}>
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
          />

          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter Phone Number"
            keyboardType="phone-pad"
          />

          {/* Save Button */}
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Feather name="save" size={18} color="#fff" />
            <Text style={styles.saveBtnText}>Save Changes</Text>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
  },
  title: {
    fontSize: 18,
    color: "#222",
    marginLeft: 12,
    fontFamily: "Poppins-SemiBold",
  },

  /* Avatar Preview */
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#007AFF20",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 20,
  },
  initials: {
    fontSize: 32,
    fontFamily: "Poppins-SemiBold",
    color: "#007AFF",
  },

  /* Form */
  form: {
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    color: "#555",
    fontFamily: "Poppins-Medium",
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: "#222",
    backgroundColor: "#F9F9F9",
    fontFamily: "Poppins-Regular",
  },

  /* Save Button */
  saveBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 30,
    gap: 8,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
});
