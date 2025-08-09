import { ApiService } from "../api/apiService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  setUserData,
  setUserRole,
  setRefreshToken,
  clearUserData,
  STORAGE_KEYS,
} from "../../utils/storage";

class AuthService extends ApiService {
  constructor() {
    super("/Auth");
  }

  // Helper method để lưu token và user data từ response
  async saveAuthDataFromResponse(response) {
    try {
      console.log("📥 Full response:", JSON.stringify(response, null, 2));
      console.log(
        "🔑 response.accessToken:",
        response.accessToken ? "✅ Có" : "❌ Không có"
      );
      console.log("📦 response.data:", response.data ? "✅ Có" : "❌ Không có");
      console.log(
        "👤 response.data?.user:",
        response.data?.user ? "✅ Có" : "❌ Không có"
      );
      console.log(
        "🔑 response.data?.accessToken:",
        response.data?.accessToken ? "✅ Có" : "❌ Không có"
      );

      // Lưu accessToken nếu có trong response
      if (response.accessToken) {
        await AsyncStorage.setItem("accessToken", response.accessToken);
        console.log("✅ AuthService - Saved accessToken from response");
      }

      // Lưu user data nếu có trong response
      if (response.data) {
        await AsyncStorage.setItem("userData", JSON.stringify(response.data));
        console.log("✅ AuthService - Saved user data from response");
      }

      // Lưu accessToken nếu có trong response.data
      if (response.data && response.data.accessToken) {
        await AsyncStorage.setItem("accessToken", response.data.accessToken);
        console.log("✅ AuthService - Saved accessToken from response.data");
      }

      // Lưu user data nếu có trong response.data.user
      if (response.data && response.data.user) {
        await AsyncStorage.setItem(
          "userData",
          JSON.stringify(response.data.user)
        );
        console.log("✅ AuthService - Saved user data from response.data.user");
      }

      console.log("✅ === SAVE AUTH DATA COMPLETED ===");
    } catch (error) {
      console.error("❌ Error saving auth data from response:", error);
    }
  }

  async login(email, password) {
    try {
      const response = await this.post("/login", { email, password });

      // Xử lý response structure có thể khác nhau
      const responseData = response.data || response;

      // Từ response API thực tế, accessToken có thể là key đầu tiên
      let accessToken, refreshToken, user;

      if (typeof responseData === "string") {
        // Nếu responseData là string, đó là accessToken
        accessToken = responseData;
        // Tìm user và refreshToken trong response gốc
        user = response.user;
        refreshToken = response.refreshToken;
      } else {
        // Nếu responseData là object, kiểm tra các trường hợp khác nhau
        if (responseData.accessToken) {
          accessToken = responseData.accessToken;
          refreshToken = responseData.refreshToken;
          user = responseData.user;
        } else {
          // Có thể accessToken là key đầu tiên trong object
          const keys = Object.keys(responseData);
          if (keys.length > 0) {
            // Kiểm tra xem key đầu tiên có phải là accessToken không
            const firstKey = keys[0];
            if (firstKey.length > 20) {
              // accessToken thường dài
              accessToken = firstKey;
            } else {
              accessToken = responseData[firstKey];
            }
            refreshToken = responseData.refreshToken;
            user = responseData.user;
          }
        }
      }

      // Debug: Log thông tin response
      console.log("AuthService - Response data:", responseData);
      console.log("AuthService - AccessToken:", accessToken);
      console.log("AuthService - User:", user);

      // Kiểm tra và chỉ lưu những giá trị không undefined
      if (accessToken) {
        await AsyncStorage.setItem("accessToken", accessToken);
        console.log("AuthService - Saved accessToken");
      }
      if (refreshToken) {
        await setRefreshToken(refreshToken);
        console.log("AuthService - Saved refreshToken");
      }
      if (user) {
        await setUserData(user);
        if (user.role) {
          await setUserRole(user.role);
          console.log("AuthService - Saved user role:", user.role);
        }
        console.log("AuthService - Saved user:", user.fullName);
        console.log("AuthService - User role in user object:", user.role);
      }

      // Nếu chỉ có accessToken, tạo user object từ token
      if (accessToken && !user) {
        try {
          // Decode JWT token để lấy thông tin user
          const tokenPayload = JSON.parse(atob(accessToken.split(".")[1]));
          const userInfo = {
            id: tokenPayload.UserId,
            email:
              tokenPayload[
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
              ],
            fullName:
              tokenPayload[
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
              ],
            role:
              tokenPayload[
                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
              ] || tokenPayload.Role,
            isVerified: tokenPayload.IsVerified === "True",
          };
          await setUserData(userInfo);
          if (userInfo.role) {
            await setUserRole(userInfo.role);
          }
          responseData.user = userInfo;
        } catch (tokenError) {
          console.error("Error decoding token:", tokenError);
        }
      }

      return responseData;
    } catch (error) {
      throw error;
    }
  }

  async registerAccount(accountData) {
    try {
      const response = await this.post("/register/account", accountData);
      console.log("AuthService - registerAccount response:", response);

      // Check for success field in response
      if (response && response.success === true) {
        // Lưu auth data từ response
        await this.saveAuthDataFromResponse(response);

        return response;
      } else if (response && response.success === false) {
        throw new Error(response.message || "Account registration failed");
      }

      return response;
    } catch (error) {
      console.error("AuthService - registerAccount error:", error);
      throw error;
    }
  }

  async selectRole(roleData) {
    try {
      // In ra thông tin auth và tham số trước khi gọi API
      console.log("🔐 === SELECT ROLE API CALL ===");
      console.log("📤 Request data:", roleData);

      // Kiểm tra token hiện tại
      const currentToken = await AsyncStorage.getItem("accessToken");
      console.log(
        "🔑 Current accessToken:",
        currentToken ? "✅ Có token" : "❌ Không có token"
      );

      // Kiểm tra user data hiện tại
      const currentUser = await AsyncStorage.getItem("userData");
      console.log(
        "👤 Current user data:",
        currentUser ? JSON.parse(currentUser) : "❌ Không có user data"
      );

      // Kiểm tra role hiện tại
      const currentRole = await AsyncStorage.getItem("userRole");
      console.log("🎭 Current role:", currentRole);

      console.log("🌐 API URL:", `${this.basePath}/register/role`);
      console.log("📋 Headers sẽ được gửi:", {
        "Content-Type": "application/json",
        Authorization: currentToken
          ? `Bearer ${currentToken}`
          : "❌ Không có token",
        "ngrok-skip-browser-warning": "true",
      });

      const response = await this.post("/register/role", roleData);
      console.log("📥 AuthService - selectRole response:", response);
      console.log("✅ === SELECT ROLE API COMPLETED ===");

      // Check for success field in response
      if (response && response.success === true) {
        // Lưu auth data từ response
        await this.saveAuthDataFromResponse(response);

        return response;
      } else if (response && response.success === false) {
        throw new Error(response.message || "Role selection failed");
      }

      return response;
    } catch (error) {
      console.error("❌ AuthService - selectRole error:", error);
      console.error("🔍 Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });
      throw error;
    }
  }

  async completeProfile(profileData) {
    try {
      console.log("🎯 === COMPLETE PROFILE API CALL ===");
      console.log("📤 Request data:", JSON.stringify(profileData, null, 2));

      // Kiểm tra token hiện tại
      const currentToken = await AsyncStorage.getItem("accessToken");
      console.log(
        "🔑 Current accessToken:",
        currentToken ? "✅ Có token" : "❌ Không có token"
      );

      console.log("🌐 API URL:", `${this.basePath}/register/profile`);

      const response = await this.post("/register/profile", profileData);
      console.log("📥 AuthService - completeProfile response:", response);
      console.log("✅ === COMPLETE PROFILE API COMPLETED ===");

      // Check for success field in response
      if (response && response.success === true) {
        // Lưu auth data từ response
        await this.saveAuthDataFromResponse(response);

        return response;
      } else if (response && response.success === false) {
        throw new Error(response.message || "Profile completion failed");
      }

      return response;
    } catch (error) {
      console.error("❌ AuthService - completeProfile error:", error);
      console.error("🔍 Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });
      throw error;
    }
  }

  async registerStudent(studentData) {
    try {
      const response = await this.post("/register/student", studentData);
      console.log("AuthService - registerStudent response:", response);

      // Check for success field in response
      if (response && response.success === true) {
        // Lưu auth data từ response
        await this.saveAuthDataFromResponse(response);

        return response;
      } else if (response && response.success === false) {
        throw new Error(response.message || "Student registration failed");
      }

      return response;
    } catch (error) {
      console.error("AuthService - registerStudent error:", error);
      throw error;
    }
  }

  async registerTutor(tutorData) {
    try {
      console.log("🎯 === REGISTER TUTOR API CALL ===");
      console.log("📤 Request data:", JSON.stringify(tutorData, null, 2));

      // Kiểm tra token hiện tại
      const currentToken = await AsyncStorage.getItem("accessToken");
      console.log(
        "🔑 Current accessToken:",
        currentToken ? "✅ Có token" : "❌ Không có token"
      );

      console.log("🌐 API URL:", `${this.basePath}/register/tutor`);

      const response = await this.post("/register/tutor", tutorData);
      console.log("📥 AuthService - registerTutor response:", response);
      console.log("✅ === REGISTER TUTOR API COMPLETED ===");

      // Check for success field in response
      if (response && response.success === true) {
        // Lưu auth data từ response
        await this.saveAuthDataFromResponse(response);

        return response;
      } else if (response && response.success === false) {
        throw new Error(response.message || "Registration failed");
      }

      return response;
    } catch (error) {
      console.error("❌ AuthService - registerTutor error:", error);
      console.error("🔍 Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });
      throw error;
    }
  }

  async checkEmail(email) {
    return this.get(`/check-email/${email}`);
  }

  async refreshToken(refreshToken) {
    return this.post("/refresh", { refreshToken });
  }

  async logout() {
    try {
      const { getRefreshToken } = await import("../../utils/storage");
      const refreshToken = await getRefreshToken();
      if (refreshToken) {
        await this.post("/logout", { refreshToken });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear all user data and tokens
      await clearUserData();
      await AsyncStorage.multiRemove([
        "accessToken",
        "refreshToken",
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.USER_ROLE,
      ]);
      console.log("AuthService - Logout completed, all data cleared");
    }
  }

  async clearAuthData() {
    try {
      await clearUserData();
    } catch (error) {
      console.error("Error clearing auth data:", error);
    }
  }

  async getCurrentUser() {
    try {
      const { getUserData } = await import("../../utils/storage");
      return await getUserData();
    } catch (error) {
      return null;
    }
  }

  async isAuthenticated() {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      return !!token;
    } catch (error) {
      console.error("Error checking authentication:", error);
      return false;
    }
  }

  // Additional methods
  async updateProfile(userData) {
    return this.put("/profile", userData);
  }

  async changePassword(passwordData) {
    return this.post("/change-password", passwordData);
  }

  async forgotPassword(email) {
    return this.post("/forgot-password", { email });
  }

  async resetPassword(resetData) {
    return this.post("/reset-password", resetData);
  }

  async verifyEmail(token) {
    return this.post("/verify-email", { token });
  }

  async resendVerificationEmail(email) {
    return this.post("/resend-verification", { email });
  }
}

const authService = new AuthService();
export default authService;
