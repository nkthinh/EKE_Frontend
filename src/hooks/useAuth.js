import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getUserData,
  getUserRole,
  clearUserData,
  setUserData,
  setUserRole,
} from "../utils/storage";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("accessToken");
      const user = await getUserData();
      const role = await getUserRole();

      console.log("useAuth - Token:", token);
      console.log("useAuth - User:", user);
      console.log("useAuth - Role:", role);

      if (token && user) {
        setIsAuthenticated(true);
        setUserData(user);
        setUserRole(role);
        console.log("useAuth - User authenticated:", user.fullName);
      } else {
        setIsAuthenticated(false);
        setUserData(null);
        setUserRole(null);
        console.log("useAuth - No user data found");
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
      setUserData(null);
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (token, user, role) => {
    try {
      console.log("useAuth - Login called with:", { token, user, role });

      // Store user data
      await Promise.all([
        AsyncStorage.setItem("accessToken", token),
        setUserData(user),
        setUserRole(role),
      ]);

      // Update state
      setIsAuthenticated(true);
      setUserData(user);
      setUserRole(role);

      console.log("useAuth - Login successful, user data updated");
      return true;
    } catch (error) {
      console.error("Error during login:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await clearUserData();
      setIsAuthenticated(false);
      setUserData(null);
      setUserRole(null);
      return true;
    } catch (error) {
      console.error("Error during logout:", error);
      return false;
    }
  };

  const updateUserData = async (newUserData) => {
    try {
      await setUserData(newUserData);
      setUserData(newUserData);
      return true;
    } catch (error) {
      console.error("Error updating user data:", error);
      return false;
    }
  };

  const reloadUserData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("accessToken");
      const user = await getUserData();
      const role = await getUserRole();

      console.log("useAuth - Reloading user data:");
      console.log("useAuth - Token:", token);
      console.log("useAuth - User:", user);
      console.log("useAuth - Role:", role);

      if (token && user) {
        setIsAuthenticated(true);
        setUserData(user);
        setUserRole(role);
        console.log("useAuth - User data reloaded successfully");
      } else {
        setIsAuthenticated(false);
        setUserData(null);
        setUserRole(null);
        console.log("useAuth - No user data found during reload");
      }
    } catch (error) {
      console.error("Error reloading user data:", error);
      setIsAuthenticated(false);
      setUserData(null);
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    isAuthenticated,
    userData,
    userRole,
    loading,
    login,
    logout,
    updateUserData,
    checkAuthStatus,
    reloadUserData,
  };
};
