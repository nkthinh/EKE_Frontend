import AsyncStorage from "@react-native-async-storage/async-storage";

// Storage keys
export const STORAGE_KEYS = {
  USER_TOKEN: "user_token",
  USER_DATA: "user_data",
  USER_ROLE: "user_role",
  ONBOARDING_COMPLETED: "onboarding_completed",
  LANGUAGE: "language",
  THEME: "theme",
  NOTIFICATIONS_ENABLED: "notifications_enabled",
  CHAT_HISTORY: "chat_history",
  FAVORITE_TUTORS: "favorite_tutors",
  SEARCH_HISTORY: "search_history",
};

// Set item in storage
export const setStorageItem = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error("Error setting storage item:", error);
    return false;
  }
};

// Get item from storage
export const getStorageItem = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error("Error getting storage item:", error);
    return null;
  }
};

// Remove item from storage
export const removeStorageItem = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error("Error removing storage item:", error);
    return false;
  }
};

// Clear all storage
export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error("Error clearing storage:", error);
    return false;
  }
};

// Get all storage keys
export const getAllStorageKeys = async () => {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (error) {
    console.error("Error getting all storage keys:", error);
    return [];
  }
};

// Get multiple items from storage
export const getMultipleStorageItems = async (keys) => {
  try {
    const values = await AsyncStorage.multiGet(keys);
    return values.reduce((acc, [key, value]) => {
      acc[key] = value != null ? JSON.parse(value) : null;
      return acc;
    }, {});
  } catch (error) {
    console.error("Error getting multiple storage items:", error);
    return {};
  }
};

// Set multiple items in storage
export const setMultipleStorageItems = async (keyValuePairs) => {
  try {
    const pairs = keyValuePairs.map(([key, value]) => [
      key,
      JSON.stringify(value),
    ]);
    await AsyncStorage.multiSet(pairs);
    return true;
  } catch (error) {
    console.error("Error setting multiple storage items:", error);
    return false;
  }
};

// User-specific storage functions
export const setUserToken = async (token) => {
  return await setStorageItem(STORAGE_KEYS.USER_TOKEN, token);
};

export const getUserToken = async () => {
  return await getStorageItem(STORAGE_KEYS.USER_TOKEN);
};

export const setUserData = async (userData) => {
  return await setStorageItem(STORAGE_KEYS.USER_DATA, userData);
};

export const getUserData = async () => {
  return await getStorageItem(STORAGE_KEYS.USER_DATA);
};

export const setUserRole = async (role) => {
  return await setStorageItem(STORAGE_KEYS.USER_ROLE, role);
};

export const getUserRole = async () => {
  return await getStorageItem(STORAGE_KEYS.USER_ROLE);
};

export const setRefreshToken = async (refreshToken) => {
  return await setStorageItem("refreshToken", refreshToken);
};

export const getRefreshToken = async () => {
  return await getStorageItem("refreshToken");
};

export const clearUserData = async () => {
  const keysToRemove = [
    "accessToken",
    STORAGE_KEYS.USER_DATA,
    STORAGE_KEYS.USER_ROLE,
    "refreshToken", // Add refreshToken to keys to remove
  ];

  try {
    await AsyncStorage.multiRemove(keysToRemove);
    return true;
  } catch (error) {
    console.error("Error clearing user data:", error);
    return false;
  }
};

// App settings storage functions
export const setOnboardingCompleted = async (completed) => {
  return await setStorageItem(STORAGE_KEYS.ONBOARDING_COMPLETED, completed);
};

export const getOnboardingCompleted = async () => {
  return await getStorageItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
};

export const setLanguage = async (language) => {
  return await setStorageItem(STORAGE_KEYS.LANGUAGE, language);
};

export const getLanguage = async () => {
  return await getStorageItem(STORAGE_KEYS.LANGUAGE);
};

export const setTheme = async (theme) => {
  return await setStorageItem(STORAGE_KEYS.THEME, theme);
};

export const getTheme = async () => {
  return await getStorageItem(STORAGE_KEYS.THEME);
};
