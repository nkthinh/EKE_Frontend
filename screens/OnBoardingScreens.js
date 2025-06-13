import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
const OnboardingScreen1 = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Onboarding2A");
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.onboardingContainer}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />

      <Text style={styles.onboardingText}>
        NỀN TẢNG GIÁO DỤC BẰNG CÔNG NGHỆ
      </Text>
      <Image
        source={require("../assets/onboard1.png")}
        style={styles.onboardingImage}
      />
    </View>
  );
};

const OnboardingScreen2A = ({ navigation }) => (
  <View style={styles.onboardingContainer}>
    <Text numberOfLines={1} style={{ fontSize: 13 }}>
      🚀 Tìm gia sư – Học dễ dàng – Tiến bộ nhanh!
    </Text>
    <Text
      style={{ fontSize: 14, color: "#333", padding: 20, marginVertical: 10 }}
    >
      Ứng dụng giúp học viên tìm kiếm gia sư phù hợp nhanh chóng, kết nối trực
      tiếp với giáo viên giỏi, hỗ trợ học tập mọi lúc, mọi nơi. Dễ dàng đặt lịch
      và theo dõi tiến trình học tập hiệu quả.
    </Text>
    <Image
      source={require("../assets/onboard2.jpg")}
      style={{ resizeMode: "contain", width: "100%", height: 400 }}
    />
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate("Onboarding2B")}
    >
      <Text style={styles.buttonText}>Tiếp tục</Text>
    </TouchableOpacity>
  </View>
);
const OnboardingScreen2B = ({ navigation }) => (
  <View style={styles.onboardingContainer}>
    <Text numberOfLines={1} style={{ fontSize: 13 }}>
      🚀 Kết Nối Gia Sư Thông Minh Với AI Tích Hợp! 🤖
    </Text>
    <Text
      style={{ fontSize: 14, color: "#333", padding: 20, marginVertical: 10 }}
    >
      Ứng dụng tiên phong trong việc kết nối học viên với gia sư thông qua AI
      thông minh, giúp bạn tìm kiếm gia sư phù hợp nhanh chóng, chính xác, dựa
      trên trình độ, nhu cầu và lịch học cá nhân.
    </Text>
    <Image
      source={require("../assets/onboard3.jpg")}
      style={{ resizeMode: "contain", width: "100%", height: 400 }}
    />
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate("Onboarding3")}
    >
      <Text style={styles.buttonText}>Tiếp tục</Text>
    </TouchableOpacity>
  </View>
);

const OnboardingScreen3 = ({ navigation }) => {
   const handleRoleSelection = async (role) => {
    try {
      await AsyncStorage.setItem("userRole", role);
      navigation.navigate("Login");
    } catch (error) {
      console.log("Error saving role:", error);
    }
  };

  return(
  <View style={styles.onboardingContainer}>
    <Image source={require("../assets/logo.png")} />
    <Text
      style={{
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 30,
      }}
    >
      Nền tảng giáo dục công nghệ
    </Text>
    <View
      style={{
        position: "relative",
        width: "100%",
        height: 240,
        marginBottom: 20,
      }}
    >
      <Image
        source={require("../assets/onboard4.png")}
        style={{ width: "100%", height: 240, position: "absolute" }}
      />
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          position: "absolute",
          top: "55%",
          left: "40%",
          transform: [{ translateX: -50 }, { translateY: -50 }],
        }}
      >
        Bạn là ai?
      </Text>
    </View>

    <TouchableOpacity
      style={{
        borderColor: "#31B7EC",
        borderWidth: 2,
        paddingVertical: 10,
        paddingHorizontal: 20,
        // borderRadius: 5,
        marginBottom: 10,
        width: "80%",
      }}
      onPress={() => handleRoleSelection("Lecturer")}
    >
      <Text style={{ color: "#31B7EC", fontSize: 20 }}>Gia sư</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={{
        borderColor: "#31B7EC",
        borderWidth: 2,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        width: "80%",
      }}
      onPress={() => handleRoleSelection("Student")}
    >
      <Text style={{ color: "#31B7EC", fontSize: 20 }}>Phụ Huynh/Học Viên</Text>
    </TouchableOpacity>
  </View>
)}

const styles = StyleSheet.create({
  onboardingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    marginTop: "20%",
  },
  onboardingImage: {
    width: 300,
    height: 400,
    resizeMode: "contain",
  },
  onboardingText: {
    fontSize: 20,
    color: "#333",
    textAlign: "center",
    marginVertical: 20,
  },
  button: {
    backgroundColor: "#32ADE6",
    paddingInline: 50,
    paddingBlock: 8,
    borderRadius: 20,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});

export {
  OnboardingScreen1,
  OnboardingScreen2A,
  OnboardingScreen2B,
  OnboardingScreen3,
};
