import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    key: "1",
    title: "NỀN TẢNG GIÁO DỤC BẰNG CÔNG NGHỆ",
    subtitle: "Kết nối học viên và gia sư một cách thông minh",
    topImage: require("../../assets/logo1.png"),
    bottomImage: require("../../assets/book.png"),
    gradient: ["#ffffff", "#f8f9fa"],
  },
  {
    key: "2",
    title: "Tìm Gia Sư – Học Dễ Dàng",
    subtitle: "Tiến Bộ Nhanh Chóng!",
    image: require("../../assets/teacher.jpg"),
    description:
      "Ứng dụng giúp học viên tìm kiếm gia sư phù hợp nhanh chóng, kết nối trực tiếp với giáo viên giỏi, hỗ trợ học tập mọi lúc, mọi nơi.",
    gradient: ["#f8f9fa", "#e9ecef"],
    iconName: "rocket-outline",
  },
  {
    key: "3",
    title: "AI Thông Minh",
    subtitle: "Kết Nối Gia Sư Tối Ưu!",
    image: require("../../assets/ai.png"),
    description:
      "Ứng dụng tiên phong trong việc kết nối học viên với gia sư thông qua AI thông minh, giúp bạn tìm kiếm gia sư phù hợp nhanh chóng, chính xác.",
    gradient: ["#e9ecef", "#dee2e6"],
    iconName: "bulb-outline",
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [index, setIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slide = slides[index];

  const nextSlide = () => {
    if (index < slides.length - 1) {
      setIndex(index + 1);
    } else {
      navigation.navigate("RoleSelection");
    }
  };

  const skipOnboarding = () => {
    navigation.navigate("RoleSelection");
  };

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {slides.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1.2, 0.8],
            extrapolate: "clamp",
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: "clamp",
          });
          return (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                {
                  transform: [{ scale }],
                  opacity,
                  backgroundColor:
                    i === index ? "#000000" : "rgba(0, 0, 0, 0.3)",
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <LinearGradient colors={slide.gradient} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={skipOnboarding} style={styles.skipButton}>
          <Text style={styles.skipText}>Bỏ qua</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {slide.topImage && (
          <Animated.Image
            source={slide.topImage}
            style={[
              styles.topImage,
              {
                transform: [
                  {
                    scale: scrollX.interpolate({
                      inputRange: [
                        (index - 1) * width,
                        index * width,
                        (index + 1) * width,
                      ],
                      outputRange: [0.8, 1, 0.8],
                      extrapolate: "clamp",
                    }),
                  },
                ],
              },
            ]}
          />
        )}

        <View style={styles.textContainer}>
          <View style={styles.titleContainer}>
            {slide.iconName && (
              <View style={styles.iconContainer}>
                <Ionicons name={slide.iconName} size={32} color="#000" />
              </View>
            )}
            <Text style={styles.title}>{slide.title}</Text>
          </View>
          {slide.subtitle && (
            <Text style={styles.subtitle}>{slide.subtitle}</Text>
          )}
          {slide.description && (
            <Text style={styles.desc}>{slide.description}</Text>
          )}
        </View>

        {slide.bottomImage && (
          <Animated.Image
            source={slide.bottomImage}
            style={[
              styles.bottomImage,
              {
                transform: [
                  {
                    translateY: scrollX.interpolate({
                      inputRange: [
                        (index - 1) * width,
                        index * width,
                        (index + 1) * width,
                      ],
                      outputRange: [50, 0, 50],
                      extrapolate: "clamp",
                    }),
                  },
                ],
              },
            ]}
          />
        )}
        {slide.image && (
          <Animated.Image
            source={slide.image}
            style={[
              styles.image,
              {
                transform: [
                  {
                    translateY: scrollX.interpolate({
                      inputRange: [
                        (index - 1) * width,
                        index * width,
                        (index + 1) * width,
                      ],
                      outputRange: [30, 0, 30],
                      extrapolate: "clamp",
                    }),
                  },
                ],
              },
            ]}
          />
        )}
      </View>

      {renderDots()}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={nextSlide}>
          <LinearGradient
            colors={["#000000", "#333333"]}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>
              {index === slides.length - 1 ? "Bắt đầu" : "Tiếp tục"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  skipButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  skipText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  topImage: {
    width: width * 0.6,
    height: 120,
    resizeMode: "contain",
    marginBottom: 30,
  },
  bottomImage: {
    width: width * 0.9,
    height: 250,
    resizeMode: "contain",
    marginTop: 20,
  },
  image: {
    width: width * 0.9,
    height: 350,
    resizeMode: "contain",
    marginTop: 20,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  iconContainer: {
    marginRight: 12,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000000",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    color: "#333333",
    marginBottom: 16,
  },
  desc: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
    color: "#666666",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  button: {
    borderRadius: 30,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 50,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default OnboardingScreen;
