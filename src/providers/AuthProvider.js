import React, { useEffect, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import { globalApiRequest } from "../utility/api.utility";
import secureStorage from "../utility/secureStorage.utility";
import authEvents from "../utility/authEvents";
import { user as userEndpoints } from "../constants/endpoint.constant";
import { registerForPushNotificationsAsync } from "../utility/notification.utility";
import { registerDeviceToken, removeDeviceToken } from "../services/notification.service";

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSplashLoading, setIsSplashLoading] = useState(true);

  const handlePushRegistration = async () => {
    try {
      const pushInfo = await registerForPushNotificationsAsync();
      if (pushInfo) {
        const { token, deviceType } = pushInfo;
        await registerDeviceToken(token, deviceType);
        await secureStorage.storeData("pushToken", token);
      }
    } catch (err) {
      console.warn("[AuthProvider] Push registration failed:", err);
    }
  };

  const getUser = async (token) => {
    try {
      // console.log(token);
      if (token) {
        const [headerB64, payloadB64, signature] = token.split(".");
        const payload = await JSON.parse(atob(payloadB64));
        setUserData(payload);
        // console.log("JWT Token:", token);
        // console.log("User Payload:", JSON.stringify(payload, null, 2));
        await secureStorage.storeData("me", JSON.stringify(payload));
        handlePushRegistration();
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // Adjust payload key names based on backend expectation (username/email?)
      // Assuming 'username' and 'password' for now.
      const response = await globalApiRequest(
        false,
        "POST",
        userEndpoints.login,
        { email, password },
      );
      // // console.log("outside if:", response);

      // Assuming response contains { token: '...', user: { ... } }
      // Adjust based on actual API response structure
      if (response && response.data) {
        // // console.log("inside if:", response);
        console.log("inside if:", response);
        await getUser(response.data);
        await secureStorage.storeToken(response.data);
        setUserToken(response.data);
      } else {
        throw new Error("Invalid response from server");
      }
      return response;
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const pushToken = await secureStorage.getData("pushToken");
      if (pushToken) {
        try {
          await removeDeviceToken(pushToken);
        } catch (e) {
          console.warn("[AuthProvider] Failed to unregister push token during logout:", e);
        }
        await secureStorage.removeData("pushToken");
      }
      setUserToken(null);
      setUserData(null);
      await secureStorage.removeToken();
      await secureStorage.removeData("me");
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfileState = async (updatedData) => {
    try {
      const newUserData = {
        ...userData,
        firstName: updatedData.firstName || updatedData.first_name || userData.firstName,
        lastName: updatedData.lastName || updatedData.last_name || userData.lastName,
        email: updatedData.email || userData.email,
        phone: updatedData.phone || userData.phone,
        mobile: updatedData.phone || userData.mobile,
      };
      setUserData(newUserData);
      await secureStorage.storeData("me", JSON.stringify(newUserData));
    } catch (error) {
      console.error("Failed to update profile state:", error);
    }
  };

  const isLoggedIn = async () => {
    try {
      setIsSplashLoading(true);
      // Minimum delay to allow splash animation to play (e.g. 1.5 seconds)
      const minDelayPromise = new Promise((resolve) =>
        setTimeout(resolve, 1500),
      );
      const tokenPromise = secureStorage.getToken();

      const [_, token] = await Promise.all([minDelayPromise, tokenPromise]);

      if (token) {
        setUserToken(token);
        await getUser(token);
      }
    } catch (error) {
      console.error("Check Login Error:", error);
    } finally {
      setIsSplashLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn();

    // Subscribe to Auto-Logout Events
    const unsubscribe = authEvents.subscribeLogout(() => {
      logout();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ login, logout, isLoading, userToken, isSplashLoading, userData, updateProfileState }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
