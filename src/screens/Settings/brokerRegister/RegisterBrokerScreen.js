import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import useAuth from "../../../hooks/useAuth";
import { registerBroker } from "../../../services/broker.service";
import { showErrorAlert } from "../../../utility/error.utility";

export default function RegisterBrokerScreen() {
  const navigation = useNavigation();
  const { userData } = useAuth();

  const [form, setForm] = useState({
    userId: userData?.id || userData?._id || "",
    name: "",
    age: "",
    city: "",
    mobile: "",
    whatsapp: "",
    email: "",
    address: "",
    occupation: "",
  });

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    if (!form.name || !form.age || !form.city || !form.mobile || !form.whatsapp || !form.occupation) {
      showErrorAlert("Missing Fields", "Please fill all required fields.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    if (!userData?.id && !userData?._id) {
      showErrorAlert("Error", "User not authenticated or user ID missing.");
      return;
    }

    const payload = {
      userId: userData?.id || userData?._id || "",
      fullName: form.name,
      occupation: form.occupation,
      city: form.city,
      age: parseInt(form.age, 10),
      mobileNumber: form.mobile,
      whatsappNumber: form.whatsapp,
      email: form.email,
      address: form.address,
    };

    try {
      await registerBroker(payload);
      Alert.alert("Success", "Broker registration submitted successfully.", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
      handleClear();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong.";
      // console.log("Registration Error:", errorMessage);
      showErrorAlert("Registration Failed", errorMessage);
    }
  };

  const handleClear = () => {
    setForm({
      name: "",
      age: "",
      city: "",
      mobile: "",
      whatsapp: "",
      email: "",
      address: "",
      occupation: "",
    });
  };

  return (
    <View style={styles.screen}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Register as Broker</Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <Field
          label="Full Name"
          required
          placeholder="Enter your full name"
          value={form.name}
          onChangeText={(t) => handleChange("name", t)}
        />

        <Field
          label="Occupation"
          required
          placeholder="Enter your Occupation"
          value={form.occupation}
          onChangeText={(t) => handleChange("occupation", t)}
        />

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Field
              label="City"
              required
              placeholder="Enter your city"
              value={form.city}
              onChangeText={(t) => handleChange("city", t)}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Field
              label="Age"
              required
              keyboardType="numeric"
              placeholder="Enter your age"
              value={form.age}
              onChangeText={(t) => handleChange("age", t)}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Field
              label="Mobile Number"
              required
              keyboardType="phone-pad"
              placeholder="Enter mobile number"
              value={form.mobile}
              onChangeText={(t) => handleChange("mobile", t)}
            />
          </View>

          <View style={{ flex: 1, marginLeft: 8 }}>
            <Field
              label="WhatsApp Number"
              required
              keyboardType="phone-pad"
              placeholder="Enter WhatsApp number"
              value={form.whatsapp}
              onChangeText={(t) => handleChange("whatsapp", t)}
            />
          </View>
        </View>

        <Field
          label="Email (Optional)"
          placeholder="Enter your email"
          keyboardType="email-address"
          value={form.email}
          onChangeText={(t) => handleChange("email", t)}
        />

        <Field
          label="Complete Address"
          placeholder="Enter your address"
          multiline
          value={form.address}
          onChangeText={(t) => handleChange("address", t)}
        />

        <View style={styles.footer}>
          <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
            <Text style={styles.clearText}>Clear Form</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitText}>Register as Broker</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

/* Reusable Field Component */
const Field = ({ label, required, placeholder, value, onChangeText, ...props }) => (
  <View style={styles.fieldBox}>
    <Text style={styles.label}>
      {label} {required && <Text style={{ color: "red" }}>*</Text>}
    </Text>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#7A7A7A"
      value={value}
      onChangeText={onChangeText}
      {...props}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    padding: wp('4%'),
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },
  fieldBox: {
    marginBottom: hp('1.75%'),
  },
  label: {
    fontSize: wp('3.5%'), // 14
    color: "#222",
    marginBottom: hp('0.5%'),
    fontFamily: "Poppins-Medium",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#D9D9D9",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1.25%'),
    fontSize: wp('3.5%'), // 14
    fontFamily: "Poppins-Regular",
  },
  footer: {
    flexDirection: "row",
    marginTop: hp('2.5%'),
  },
  clearBtn: {
    flex: 1,
    backgroundColor: "#E5E5E5",
    paddingVertical: hp('1.5%'),
    marginRight: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  clearText: {
    color: "#333",
    fontSize: wp('3.5%'),
    fontFamily: "Poppins-Medium",
  },
  submitBtn: {
    flex: 1,
    backgroundColor: "#3465FD",
    paddingVertical: hp('1.5%'),
    marginLeft: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: wp('3.5%'),
    fontFamily: "Poppins-Medium",
  },
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // Top Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.75%'),
    borderBottomWidth: 1,
    borderColor: "#ececec",
  },

  backBtn: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F2F2",
    marginRight: 8,
  },

  headerTitle: {
    fontSize: wp('5%'), // 20
    fontFamily: "Poppins-Bold",
    color: "#000",
  },
});
