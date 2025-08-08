import AsyncStorage from "@react-native-async-storage/async-storage";

export const testStorage = async () => {
  try {
    console.log("=== Testing AsyncStorage ===");

    // Test lưu dữ liệu
    const testUser = {
      id: 3,
      fullName: "Ngo Gia Bao",
      email: "bao@gmail.com",
      role: 0,
    };

    await AsyncStorage.setItem("user", JSON.stringify(testUser));
    console.log("✅ Saved test user to AsyncStorage");

    // Test đọc dữ liệu
    const userStr = await AsyncStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    console.log("✅ Read user from AsyncStorage:", user);

    // Test clear
    await AsyncStorage.removeItem("user");
    console.log("✅ Cleared user from AsyncStorage");

    return true;
  } catch (error) {
    console.error("❌ Storage test failed:", error);
    return false;
  }
};
