import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "./storage";

export const debugStorage = async () => {
  try {
    console.log("=== DEBUG STORAGE ===");

    // Get all keys
    const allKeys = await AsyncStorage.getAllKeys();
    console.log("All storage keys:", allKeys);

    // Get specific user data
    const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    const userRole = await AsyncStorage.getItem(STORAGE_KEYS.USER_ROLE);

    console.log("User Token:", token);
    console.log("User Data:", userData ? JSON.parse(userData) : null);
    console.log("User Role:", userRole);

    return {
      token,
      userData: userData ? JSON.parse(userData) : null,
      userRole,
      allKeys,
    };
  } catch (error) {
    console.error("Debug storage error:", error);
    return null;
  }
};

export const clearAllUserData = async () => {
  try {
    console.log("=== CLEARING ALL USER DATA ===");
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER_TOKEN,
      STORAGE_KEYS.USER_DATA,
      STORAGE_KEYS.USER_ROLE,
      "refreshToken",
    ]);
    console.log("All user data cleared successfully");
    return true;
  } catch (error) {
    console.error("Error clearing user data:", error);
    return false;
  }
};
