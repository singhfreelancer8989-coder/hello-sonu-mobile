import React, { useEffect, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import { globalApiRequest } from "../utility/api.utility";
import secureStorage from "../utility/secureStorage.utility";
import { user as userEndpoints } from "../constants/endpoint.constant";

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSplashLoading, setIsSplashLoading] = useState(true);

  const getUser = async (token) => {
    try {
      if (token) {
        const [headerB64, payloadB64, signature] = token.split(".");
        const payload = await JSON.parse(atob(payloadB64));
        setUserData(payload);
        await secureStorage.storeData("me", JSON.stringify(payload));
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
        { email, password },
        userEndpoints.login,
      );
      console.log("outside if:", response);

      // Assuming response contains { token: '...', user: { ... } }
      // Adjust based on actual API response structure
      if (response && response.data) {
        console.log("inside if:", response);
        setUserToken(response.data);
        await secureStorage.storeToken(response.data);
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
      setUserToken(null);
      await secureStorage.removeToken();
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isLoggedIn = async () => {
    try {
      setIsSplashLoading(true);
      // Minimum delay to allow splash animation to play (e.g. 2.5 seconds)
      const minDelayPromise = new Promise((resolve) =>
        setTimeout(resolve, 2500),
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
  }, []);

  return (
    <AuthContext.Provider
      value={{ login, logout, isLoading, userToken, isSplashLoading, userData }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
