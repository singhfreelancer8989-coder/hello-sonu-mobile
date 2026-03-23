import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { getPropertyAccessSummary, updatePropertyAccess } from "../../../services/user.service";
import { ActivityIndicator, Alert, RefreshControl } from "react-native";
import { showErrorAlert } from "../../../utility/error.utility";

const UserPermissionsScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [users, setUsers] = useState([]);
  const [summary, setSummary] = useState({
    totalUsers: 0,
    totalWithAccess: 0,
    totalWithoutAccess: 0
  });

  const fetchData = async () => {
    try {
      const response = await getPropertyAccessSummary();
      if (response && response.data) {
        setUsers(response.data.users || []);
        setSummary({
          totalUsers: response.data.totalUsers || 0,
          totalWithAccess: response.data.totalWithAccess || 0,
          totalWithoutAccess: response.data.totalWithoutAccess || 0
        });
      }
    } catch (err) {
      showErrorAlert("Error", "Failed to fetch permissions summary");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const togglePermission = async (userId, currentStatus) => {
    const newStatus = !currentStatus;
    try {
      const response = await updatePropertyAccess(userId, newStatus);
      if (response) {
        // Optimistic update or just refetch
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, canCreateProperty: newStatus } : u));
        // Update summary locally to avoid jumpiness
        setSummary(prev => ({
          ...prev,
          totalWithAccess: newStatus ? prev.totalWithAccess + 1 : prev.totalWithAccess - 1,
          totalWithoutAccess: newStatus ? prev.totalWithoutAccess - 1 : prev.totalWithoutAccess + 1
        }));
      }
    } catch (err) {
      showErrorAlert("Error", "Failed to update permission");
    }
  };

  const stats = useMemo(() => {
    return {
      total: summary.totalUsers,
      permitted: summary.totalWithAccess,
      pending: summary.totalWithoutAccess
    };
  }, [summary]);

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="chevron-back" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Permissions Manager</Text>
      <View style={{ width: 40 }} />
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


        {loading && !refreshing ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color="#4834d4" />
            <Text style={[styles.emptySubText, { marginTop: 10 }]}>Loading permissions...</Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {users.length > 0 ? (
              users.map((user) => (
                <View key={user.id} style={styles.userCard}>
                  <View style={styles.userMainInfo}>
                    <View style={styles.avatarContainer}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                          {(user.firstName || "?").charAt(0)}
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
                        <Text style={styles.userName}>{user.firstName} {user.lastName}</Text>
                        <View
                          style={[
                            styles.roleBadge,
                            {
                              backgroundColor:
                                user.role === "admin" ? "#FF980015" : (user.role === "broker" ? "#4834d415" : "#f1f3f5"),
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.roleText,
                              {
                                color:
                                  user.role === "admin" ? "#FF9800" : (user.role === "broker" ? "#4834d4" : "#666"),
                              },
                            ]}
                          >
                            {(user.role || "USER").toUpperCase()}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.userEmail}>{user.email}</Text>
                    </View>

                    <Switch
                      trackColor={{ false: "#dfe6e9", true: "#4834d480" }}
                      thumbColor={user.canCreateProperty ? "#4834d4" : "#f1f2f6"}
                      onValueChange={() => togglePermission(user.id, user.canCreateProperty)}
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
        )}
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
