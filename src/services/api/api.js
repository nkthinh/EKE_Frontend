import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../../constants/env";
import { STORAGE_KEYS } from "../../utils/storage";

// Create axios instance with environment configuration
const api = axios.create({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

// Request interceptor to add authentication token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;

        // In ra thông tin Bearer token cho API selectRole và registerTutor
        if (config.url && config.url.includes("/register/role")) {
          console.log("🔐 === API INTERCEPTOR - SELECT ROLE ===");
          console.log("🌐 Request URL:", config.url);
          console.log("📋 Request method:", config.method?.toUpperCase());
          console.log(
            "🔑 Bearer token:",
            `Bearer ${token.substring(0, 20)}...`
          );
          console.log("📤 Request data:", config.data);
          console.log("📋 All headers:", config.headers);
          console.log("✅ === API INTERCEPTOR COMPLETED ===");
        }

        if (config.url && config.url.includes("/register/tutor")) {
          console.log("🔐 === API INTERCEPTOR - REGISTER TUTOR ===");
          console.log("🌐 Request URL:", config.url);
          console.log("📋 Request method:", config.method?.toUpperCase());
          console.log(
            "🔑 Bearer token:",
            `Bearer ${token.substring(0, 20)}...`
          );
          console.log("📤 Request data:", config.data);
          console.log("📋 All headers:", config.headers);
          console.log("✅ === API INTERCEPTOR COMPLETED ===");
        }

        if (config.url && config.url.includes("/register/profile")) {
          console.log("🔐 === API INTERCEPTOR - REGISTER PROFILE ===");
          console.log("🌐 Request URL:", config.url);
          console.log("📋 Request method:", config.method?.toUpperCase());
          console.log(
            "🔑 Bearer token:",
            `Bearer ${token.substring(0, 20)}...`
          );
          console.log("📤 Request data:", config.data);
          console.log("📋 All headers:", config.headers);
          console.log("✅ === API INTERCEPTOR COMPLETED ===");
        }
      } else {
        // In ra cảnh báo nếu không có token
        if (config.url && config.url.includes("/register/role")) {
          console.log("⚠️ === API INTERCEPTOR - NO TOKEN ===");
          console.log("🌐 Request URL:", config.url);
          console.log("❌ No accessToken found in storage");
          console.log("📋 Request data:", config.data);
          console.log("⚠️ === API INTERCEPTOR WARNING ===");
        }

        if (config.url && config.url.includes("/register/tutor")) {
          console.log("⚠️ === API INTERCEPTOR - NO TOKEN ===");
          console.log("🌐 Request URL:", config.url);
          console.log("❌ No accessToken found in storage");
          console.log("📋 Request data:", config.data);
          console.log("⚠️ === API INTERCEPTOR WARNING ===");
        }

        if (config.url && config.url.includes("/register/profile")) {
          console.log("⚠️ === API INTERCEPTOR - NO TOKEN ===");
          console.log("🌐 Request URL:", config.url);
          console.log("❌ No accessToken found in storage");
          console.log("📋 Request data:", config.data);
          console.log("⚠️ === API INTERCEPTOR WARNING ===");
        }
      }
    } catch (error) {
      console.error("Error getting token from storage:", error);
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error has a response body with success: true
    // This handles cases where backend returns success: true but with 4xx status code
    if (error.response?.data?.success === true) {
      console.log(
        "Backend returned success: true despite error status code:",
        error.response.status
      );
      return Promise.resolve(error.response);
    }

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        if (refreshToken) {
          // TODO: Implement refresh token logic
          // const response = await api.post('/Auth/refresh', { refreshToken });
          // const { accessToken, refreshToken: newRefreshToken } = response.data;

          // For now, clear tokens and redirect to login
          await AsyncStorage.multiRemove([
            "accessToken",
            "refreshToken",
            STORAGE_KEYS.USER_DATA,
          ]);

          // You can add navigation logic here to redirect to login
          // navigation.navigate('Login');
        }
      } catch (refreshError) {
        console.error("Token refresh error:", refreshError);
        await AsyncStorage.multiRemove([
          "accessToken",
          "refreshToken",
          STORAGE_KEYS.USER_DATA,
        ]);
      }
    }

    return Promise.reject(error);
  }
);

// API helper functions
export const apiHelper = {
  get: (url, config = {}) => api.get(url, config),
  post: (url, data = {}, config = {}) => api.post(url, data, config),
  put: (url, data = {}, config = {}) => api.put(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),
  patch: (url, data = {}, config = {}) => api.patch(url, data, config),
};

export default api;
