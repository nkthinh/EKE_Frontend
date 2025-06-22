import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import StudentLayout from "../../layout/StudentLayout";
import { PanGestureHandler, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

const dummyData = [
  {
    id: 1,
    image: require("../../assets/girl.jpg"),
    name: "Nguyen Thi Thao, 22",
    university: "Đại học Sư phạm HCM",
    address: "13/28 Nguyen Hue, Tan Binh, Tp HCM",
    skills: [
      { text: "Tieng Anh", color: "#AFB7FF" },
      { text: "Cap 1", color: "#FFCC80" },
      { text: "Cap 2", color: "#FFCC80" },
      { text: "IELTS 6.5", color: "#FF4B4A" },
    ],
  },
  {
    id: 2,
    image: require("../../assets/girl2.jpg"),
    name: "Tran Minh Anh, 20",
    university: "Đại học Kinh tế HCM",
    address: "45 Le Loi, Quan 1, Tp HCM",
    skills: [
      { text: "Toan Cao Cap", color: "#FFB7FF" },
      { text: "Tieng Nhat", color: "#80CCFF" },
      { text: "Python", color: "#FF8080" },
    ],
  },
  {
    id: 3,
    image: require("../../assets/girl3.png"),
    name: "Le Hoang Mai, 21",
    university: "Đại học Bách Khoa HCM",
    address: "72 Tran Hung Dao, Quan 5, Tp HCM",
    skills: [
      { text: "C++", color: "#B7FFB7" },
      { text: "Java", color: "#FFFF80" },
      { text: "Data Science", color: "#CC80FF" },
      { text: "TOEIC 800", color: "#FF4B4A" },
    ],
  },
];

const HomeScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);
  const isSwiping = useSharedValue(false);

  const updateIndex = (newIndex) => {
    setCurrentIndex(newIndex);
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      isSwiping.value = true;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
    },
    onEnd: (event) => {
      isSwiping.value = false;
      let newIndex = currentIndex;

      if (event.velocityX > 500 || (event.velocityX > 0 && translateX.value > width / 4)) {
        translateX.value = withTiming(width, { duration: 300, easing: Easing.ease }, () => {
          translateX.value = 0;
          runOnJS(updateIndex)((currentIndex - 1 + dummyData.length) % dummyData.length);
        });
      } else if (event.velocityX < -500 || (event.velocityX < 0 && translateX.value < -width / 4)) {
        translateX.value = withTiming(-width, { duration: 300, easing: Easing.ease }, () => {
          translateX.value = 0;
          runOnJS(updateIndex)((currentIndex + 1) % dummyData.length);
        });
      } else {
        translateX.value = withTiming(0, { duration: 300, easing: Easing.ease });
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: isSwiping.value ? 0.8 : 1,
    };
  });

  const currentProfile = dummyData[currentIndex];

  return (
    <StudentLayout navigation={navigation}>
      <GestureHandlerRootView style={styles.container}>
        <View style={styles.logoHeader}>
          <Image source={require("../../assets/logo.png")} style={styles.logo} />
        </View>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Xin Chào,</Text>
            <Text style={styles.username}>ABCDE</Text>
          </View>
          <View style={styles.iconContainer}>
            <TouchableOpacity style={styles.icon}>
              <Icon name="settings" size={24} color="#31B7EC" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon}>
              <Icon name="notifications" size={24} color="#31B7EC" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </View>

        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.imageContainer, animatedStyle]}>
            <Image
              source={currentProfile.image}
              style={styles.profileImage}
              defaultSource={require("../../assets/girl.jpg")} // Fallback image
              onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
            />
            <View style={styles.overlay}>
              <View style={styles.userInfo}>
                <Text style={styles.name}>{currentProfile.name}</Text>
                <Text style={styles.location}>© {currentProfile.university}</Text>
                <Text style={styles.location}>© {currentProfile.address}</Text>
              </View>
              <View style={styles.skillsContainer}>
                {currentProfile.skills.map((skill, index) => (
                  <TouchableOpacity
                    key={`${currentProfile.id}-${index}`}
                    style={[styles.skillButton, { backgroundColor: skill.color }]}
                  >
                    <Text style={styles.skillText}>{skill.text}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Animated.View>
        </PanGestureHandler>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="arrow-back" size={30} color="#ff4444" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="close" size={30} color="#ff4444" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="star" size={30} color="#ffd700" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="heart" size={30} color="#00cc00" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="flash" size={30} color="#cc00cc" />
          </TouchableOpacity>
        </View>
      </GestureHandlerRootView>
    </StudentLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  logoHeader: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  logo: {
    width: 40,
    height: 40,
  },
  headerText: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  username: {
    fontSize: 18,
    color: "#007bff",
    marginLeft: 0,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginLeft: 15,
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    backgroundColor: "red",
    borderRadius: 4,
  },
  imageContainer: {
    position: "relative",
    height: "70%",
    marginTop: 10,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 10,
    flexDirection: "column",
  },
  userInfo: {
    padding: 10,
    alignItems: "flex-start",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  location: {
    fontSize: 14,
    color: "#666",
  },
  skillsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    marginTop: 10,
  },
  skillButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  skillText: {
    color: "#fff",
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;