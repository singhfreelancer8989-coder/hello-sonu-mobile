import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Ionicons,
  Feather,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const UserPermissionsScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");

  // Dummy user data
  const [users, setUsers] = useState([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      canCreateProperty: true,
      role: "broker",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      canCreateProperty: false,
      role: "user",
    },
    {
      id: "3",
      name: "Robert Brown",
      email: "robert@example.com",
      canCreateProperty: true,
      role: "broker",
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily@example.com",
      canCreateProperty: false,
      role: "user",
    },
    {
      id: "5",
      name: "Michael Wilson",
      email: "michael@example.com",
      canCreateProperty: false,
      role: "user",
    },
    {
      id: "6",
      name: "Sarah Miller",
      email: "sarah@example.com",
      canCreateProperty: true,
      role: "broker",
    },
    {
      id: "7",
      name: "David Garcia",
      email: "david@example.com",
      canCreateProperty: false,
      role: "user",
    },
  ]);

  const togglePermission = (userId) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? { ...user, canCreateProperty: !user.canCreateProperty }
          : user
      )
    );
  };

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const stats = useMemo(() => {
    const total = users.length;
    const permitted = users.filter((u) => u.canCreateProperty).length;
    return { total, permitted };
  }, [users]);

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="chevron-back" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Permissions Manager</Text>
      <TouchableOpacity style={styles.headerAction}>
        <Feather name="more-vertical" size={22} color="#333" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {renderHeader()}

        {/* Stats Summary */}
        <View style={styles.statsContainer}>
          <View style={[styles.statBox, { backgroundColor: "#4834d410" }]}>
            <Text style={[styles.statValue, { color: "#4834d4" }]}>
              {stats.total}
            </Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: "#27ae6010" }]}>
            <Text style={[styles.statValue, { color: "#27ae60" }]}>
              {stats.permitted}
            </Text>
            <Text style={styles.statLabel}>With Access</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: "#f39c1210" }]}>
            <Text style={[styles.statValue, { color: "#f39c12" }]}>
              {stats.total - stats.permitted}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchWrapper}>
            <Feather name="search" size={20} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name or email..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#CCC" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        >
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <View key={user.id} style={styles.userCard}>
                <View style={styles.userMainInfo}>
                  <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {user.name.charAt(0)}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statusDot,
                        {
                          backgroundColor: user.canCreateProperty
                            ? "#27ae60"
                            : "#bdc3c7",
                        },
                      ]}
                    />
                  </View>

                  <View style={styles.userDetails}>
                    <View style={styles.nameRow}>
                      <Text style={styles.userName}>{user.name}</Text>
                      <View
                        style={[
                          styles.roleBadge,
                          {
                            backgroundColor:
                              user.role === "broker" ? "#4834d415" : "#f1f3f5",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.roleText,
                            {
                              color:
                                user.role === "broker" ? "#4834d4" : "#666",
                            },
                          ]}
                        >
                          {user.role.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.userEmail}>{user.email}</Text>
                  </View>

                  <Switch
                    trackColor={{ false: "#dfe6e9", true: "#4834d480" }}
                    thumbColor={user.canCreateProperty ? "#4834d4" : "#f1f2f6"}
                    onValueChange={() => togglePermission(user.id)}
                    value={user.canCreateProperty}
                    style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                  />
                </View>

                {user.canCreateProperty && (
                  <View style={styles.permissionInfo}>
                    <MaterialCommunityIcons
                      name="check-decagram"
                      size={14}
                      color="#27ae60"
                    />
                    <Text style={styles.permissionStatusText}>
                      Authorized to list properties
                    </Text>
                  </View>
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <FontAwesome5 name="user-slash" size={48} color="#EEE" />
              <Text style={styles.emptyText}>No users found</Text>
              <Text style={styles.emptySubText}>
                Try searching for a different name or email
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("2%"),
    backgroundColor: "#FFF",
  },
  headerTitle: {
    fontSize: wp("4.8%"),
    fontFamily: "Poppins-Bold",
    color: "#2d3436",
  },
  backButton: {
    padding: 4,
  },
  headerAction: {
    padding: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: wp("5%"),
    marginBottom: hp("2%"),
  },
  statBox: {
    flex: 1,
    marginHorizontal: wp("1%"),
    paddingVertical: hp("1.5%"),
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: wp("4.5%"),
    fontFamily: "Poppins-Bold",
  },
  statLabel: {
    fontSize: wp("2.8%"),
    fontFamily: "Poppins-Medium",
    color: "#636e72",
    marginTop: 2,
  },
  searchContainer: {
    paddingHorizontal: wp("5%"),
    marginBottom: hp("2%"),
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f2f6",
    borderRadius: 12,
    paddingHorizontal: wp("4%"),
    height: hp("6%"),
  },
  searchInput: {
    flex: 1,
    marginLeft: wp("3%"),
    fontSize: wp("3.8%"),
    fontFamily: "Poppins-Regular",
    color: "#2d3436",
    paddingBottom: Platform.OS === "ios" ? 0 : 4,
  },
  listContainer: {
    paddingHorizontal: wp("5%"),
    paddingBottom: hp("4%"),
  },
  userCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: wp("4%"),
    marginBottom: hp("1.5%"),
    borderWidth: 1,
    borderColor: "#f1f2f6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  userMainInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: wp("12%"),
    height: wp("12%"),
    borderRadius: wp("6%"),
    backgroundColor: "#4834d408",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4834d410",
  },
  avatarText: {
    fontSize: wp("5%"),
    color: "#4834d4",
    fontFamily: "Poppins-Bold",
  },
  statusDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  userDetails: {
    flex: 1,
    marginLeft: wp("4%"),
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  userName: {
    fontSize: wp("4%"),
    fontFamily: "Poppins-SemiBold",
    color: "#2d3436",
    marginRight: 8,
  },
  userEmail: {
    fontSize: wp("3.2%"),
    color: "#636e72",
    fontFamily: "Poppins-Regular",
  },
  roleBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  roleText: {
    fontSize: wp("2.4%"),
    fontFamily: "Poppins-Bold",
  },
  permissionInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp("1%"),
    paddingTop: hp("1%"),
    borderTopWidth: 1,
    borderTopColor: "#f1f2f6",
    gap: 4,
  },
  permissionStatusText: {
    fontSize: wp("3%"),
    color: "#27ae60",
    fontFamily: "Poppins-Medium",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp("10%"),
  },
  emptyText: {
    fontSize: wp("4.5%"),
    fontFamily: "Poppins-Bold",
    color: "#999",
    marginTop: hp("2%"),
  },
  emptySubText: {
    fontSize: wp("3.5%"),
    fontFamily: "Poppins-Regular",
    color: "#BBB",
    marginTop: 4,
  },
});

export default UserPermissionsScreen;
