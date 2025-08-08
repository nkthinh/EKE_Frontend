import AsyncStorage from "@react-native-async-storage/async-storage";

// API Response Handler
export const handleApiResponse = (response) => {
  if (response && response.data) {
    return response.data;
  }
  return response;
};

// API Error Handler
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;

    switch (status) {
      case 400:
        return {
          type: "BAD_REQUEST",
          message: data?.message || "Invalid request",
          details: data,
        };
      case 401:
        return {
          type: "UNAUTHORIZED",
          message: "Authentication required",
          details: data,
        };
      case 403:
        return {
          type: "FORBIDDEN",
          message: "Access denied",
          details: data,
        };
      case 404:
        return {
          type: "NOT_FOUND",
          message: "Resource not found",
          details: data,
        };
      case 422:
        return {
          type: "VALIDATION_ERROR",
          message: "Validation failed",
          details: data,
        };
      case 500:
        return {
          type: "SERVER_ERROR",
          message: "Internal server error",
          details: data,
        };
      default:
        return {
          type: "UNKNOWN_ERROR",
          message: "An unexpected error occurred",
          details: data,
        };
    }
  } else if (error.request) {
    // Network error
    return {
      type: "NETWORK_ERROR",
      message: "Network connection failed",
      details: error.request,
    };
  } else {
    // Other errors
    return {
      type: "UNKNOWN_ERROR",
      message: error.message || "An unexpected error occurred",
      details: error,
    };
  }
};

// Token Management
export const tokenUtils = {
  async getToken() {
    try {
      return await AsyncStorage.getItem("accessToken");
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  },

  async setToken(token) {
    try {
      await AsyncStorage.setItem("accessToken", token);
    } catch (error) {
      console.error("Error setting token:", error);
    }
  },

  async removeToken() {
    try {
      await AsyncStorage.removeItem("accessToken");
    } catch (error) {
      console.error("Error removing token:", error);
    }
  },

  async getRefreshToken() {
    try {
      return await AsyncStorage.getItem("refreshToken");
    } catch (error) {
      console.error("Error getting refresh token:", error);
      return null;
    }
  },

  async setRefreshToken(token) {
    try {
      await AsyncStorage.setItem("refreshToken", token);
    } catch (error) {
      console.error("Error setting refresh token:", error);
    }
  },

  async removeRefreshToken() {
    try {
      await AsyncStorage.removeItem("refreshToken");
    } catch (error) {
      console.error("Error removing refresh token:", error);
    }
  },

  async clearAllTokens() {
    try {
      await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
    } catch (error) {
      console.error("Error clearing tokens:", error);
    }
  },
};

// User Management
export const userUtils = {
  async getUser() {
    try {
      const userStr = await AsyncStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Error getting user:", error);
      return null;
    }
  },

  async setUser(user) {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Error setting user:", error);
    }
  },

  async removeUser() {
    try {
      await AsyncStorage.removeItem("user");
    } catch (error) {
      console.error("Error removing user:", error);
    }
  },

  async clearUserData() {
    try {
      await AsyncStorage.multiRemove(["user", "accessToken", "refreshToken"]);
    } catch (error) {
      console.error("Error clearing user data:", error);
    }
  },
};

// Query Parameter Builder
export const buildQueryParams = (params) => {
  if (!params || typeof params !== "object") {
    return "";
  }

  const queryParams = Object.entries(params)
    .filter(
      ([_, value]) => value !== null && value !== undefined && value !== ""
    )
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map((v) => `${key}=${encodeURIComponent(v)}`).join("&");
      }
      return `${key}=${encodeURIComponent(value)}`;
    })
    .join("&");

  return queryParams ? `?${queryParams}` : "";
};

// Form Data Builder
export const buildFormData = (data) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (value instanceof File || value instanceof Blob) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          formData.append(`${key}[${index}]`, item);
        });
      } else if (typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value.toString());
      }
    }
  });

  return formData;
};

// API Retry Logic
export const retryApiCall = async (apiCall, maxRetries = 3, delay = 1000) => {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        throw error;
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError;
};

// API Cache Management
export const apiCache = {
  cache: new Map(),

  set(key, data, ttl = 5 * 60 * 1000) {
    // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  },

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  },

  delete(key) {
    this.cache.delete(key);
  },

  clear() {
    this.cache.clear();
  },
};
