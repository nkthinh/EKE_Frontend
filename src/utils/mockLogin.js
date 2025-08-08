import AsyncStorage from "@react-native-async-storage/async-storage";

export const mockLogin = async () => {
  try {
    console.log("=== Mock Login Test ===");

    // Mock response từ API
    const mockResponse = {
      "ro0QAyefEUw2c7-VKePowbSGQV4cmhPF2fIodNc": "accessToken",
      refreshToken:
        "u2scovnqq8/9fTauFY23zfd3We1NQnrQ4jWxlCGcspLH1xxpdI/jaZ3cZG2mpibLiQT2IMTMsDPobuRBan8Iog==",
      expiresAt: "2025-08-06T07:51:29.40410012",
      tokenType: "Bearer",
      user: {
        id: 3,
        userId: 3,
        email: "bao@gmail.com",
        fullName: "Ngo Gia Bao",
        phone: null,
        dateOfBirth: null,
        gender: null,
        genderText: "Không xác định",
        role: 0,
        roleText: "Không xác định",
        profileImage: null,
        address: null,
        city: null,
        district: null,
        bio: null,
        isVerified: false,
        isActive: true,
        createdAt: "2025-08-06T07:14:31.1462446",
        updatedAt: "2025-08-06T07:14:31.146245",
        studentProfile: null,
        tutorProfile: null,
        age: null,
        fullAddress: "",
      },
    };

    // Lưu thông tin user
    await AsyncStorage.setItem(
      "accessToken",
      "ro0QAyefEUw2c7-VKePowbSGQV4cmhPF2fIodNc"
    );
    await AsyncStorage.setItem("refreshToken", mockResponse.refreshToken);
    await AsyncStorage.setItem("user", JSON.stringify(mockResponse.user));

    console.log("✅ Mock login completed");
    console.log("✅ User saved:", mockResponse.user.fullName);

    return mockResponse;
  } catch (error) {
    console.error("❌ Mock login failed:", error);
    return null;
  }
};
