import React, { useState, useCallback, useMemo } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import StudentLayout from "../../layout/StudentLayout";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
  withSpring,
  interpolate,
} from "react-native-reanimated";
import { personData } from "../../data/personData";

const { width } = Dimensions.get("window");

const ProfileCard = React.memo(({ profile, animatedStyle, translateX, isCurrent }) => {
  // Animated styles for Like and Nope text, only applied if isCurrent is true
  const likeOpacity = useAnimatedStyle(() => ({
    opacity: isCurrent ? interpolate(translateX.value, [0, -width / 3], [0, 1]) : 0,
    transform: [{ rotate: '-30deg' }],
  }));

  const nopeOpacity = useAnimatedStyle(() => ({
    opacity: isCurrent ? interpolate(translateX.value, [0, width / 3], [0, 1]) : 0,
    transform: [{ rotate: '30deg' }],
  }));

  return (
    <Animated.View style={[styles.imageContainer, animatedStyle]}>
      <Image
        source={profile.image}
        style={styles.profileImage}
        defaultSource={require("../../assets/girl.jpg")}
        onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
      />
      {isCurrent && (
        <>
          <Animated.Text style={[styles.likeText, likeOpacity]}>Like</Animated.Text>
          <Animated.Text style={[styles.nopeText, nopeOpacity]}>Nope</Animated.Text>
        </>
      )}
      <View style={styles.overlay}>
        <View style={styles.userInfo}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.location}>© {profile.university}</Text>
          <Text style={styles.location}>© {profile.address}</Text>
        </View>
        <View style={styles.skillsContainer}>
          {profile.skills.map((skill, index) => (
            <TouchableOpacity
              key={`${profile.id}-${index}`}
              style={[styles.skillButton, { backgroundColor: skill.color }]}
            >
              <Text style={styles.skillText}>{skill.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Animated.View>
  );
});

const HomeScreen = ({ navigation }) => {
  // Early return for empty data
  if (!personData || personData.length === 0) {
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
                <Icon name="settings" size={28} color="#31B7EC" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.icon}>
                <Icon name="notifications" size={28} color="#31B7EC" />
                <View style={styles.notificationDot} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.cardContainer}>
            <Text>No profiles available</Text>
          </View>
        </GestureHandlerRootView>
      </StudentLayout>
    );
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);
  const isSwiping = useSharedValue(false);

  // Precompute indices for previous, current, and next profiles
  const indices = useMemo(() => {
    const prevIndex = (currentIndex - 1 + personData.length) % personData.length;
    const nextIndex = (currentIndex + 1) % personData.length;
    return [prevIndex, currentIndex, nextIndex];
  }, [currentIndex]);

  // Debounce index updates
  const updateIndex = useCallback((newIndex) => {
    if (personData.length === 0) return;
    const boundedIndex = Math.max(0, Math.min(newIndex, personData.length - 1));
    setCurrentIndex(boundedIndex);
    translateX.value = 0; // Reset translateX to ensure gesture continuity
  }, [translateX]);

  // Gesture handler using the new Gesture API
  const panGesture = Gesture.Pan()
    .onStart(() => {
      isSwiping.value = true;
    })
    .onUpdate((event) => {
      if (!isSwiping.value) return;
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      isSwiping.value = false;
      if (event.velocityX > 400 || (event.velocityX > 0 && translateX.value > width / 3)) {
        // Swipe right: go to previous profile
        translateX.value = withTiming(
          width,
          { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) },
          () => {
            runOnJS(updateIndex)((currentIndex - 1 + personData.length) % personData.length);
          }
        );
      } else if (event.velocityX < -400 || (event.velocityX < 0 && translateX.value < -width / 3)) {
        // Swipe left: go to next profile
        translateX.value = withTiming(
          -width,
          { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) },
          () => {
            runOnJS(updateIndex)((currentIndex + 1) % personData.length);
          }
        );
      } else {
        // Return to center
        translateX.value = withSpring(0, { damping: 15, stiffness: 100 });
      }
    });

  // Animated styles for current, previous, and next cards
  const animatedStyleCurrent = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: interpolate(Math.abs(translateX.value), [0, width / 3], [1, 0.8]),
    zIndex: 2,
  }));

  const animatedStylePrev = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value - width }],
    opacity: interpolate(Math.abs(translateX.value), [0, width / 3], [0.5, 0.8]),
    zIndex: 1,
  }));

  const animatedStyleNext = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value + width }],
    opacity: interpolate(Math.abs(translateX.value), [0, width / 3], [0.5, 0.8]),
    zIndex: 1,
  }));

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
              <Icon name="settings" size={28} color="#31B7EC" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon}>
              <Icon name="notifications" size={28} color="#31B7EC" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.cardContainer}>
          {personData[indices[0]] && (
            <ProfileCard 
              profile={personData[indices[0]]} 
              animatedStyle={animatedStylePrev}
              translateX={translateX}
              isCurrent={false}
            />
          )}
          <GestureDetector gesture={panGesture}>
            <ProfileCard 
              profile={personData[indices[1]]} 
              animatedStyle={animatedStyleCurrent}
              translateX={translateX}
              isCurrent={true}
            />
          </GestureDetector>
          {personData[indices[2]] && (
            <ProfileCard 
              profile={personData[indices[2]]} 
              animatedStyle={animatedStyleNext}
              translateX={translateX}
              isCurrent={false}
            />
          )}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => updateIndex((currentIndex - 1 + personData.length) % personData.length)}
          >
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
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => updateIndex((currentIndex + 1) % personData.length)}
          >
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
    padding: 15,
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
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 5,
    borderRadius: 8,
  },
  icon: {
    marginHorizontal: 10,
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
  cardContainer: {
    flex: 1,
    position: "relative",
    height: "70%",
    marginTop: 10,
  },
  imageContainer: {
    position: "absolute",
    width: "100%",
    height: "90%",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    resizeMode: "cover",
  },
  likeText: {
    position: "absolute",
    top: 20,
    right: 20, // Changed to top right
    fontSize: 32,
    fontWeight: "bold",
    color: "#00cc00",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#00cc00",
  },
  nopeText: {
    position: "absolute",
    top: 20,
    left: 20, // Changed to top left
    fontSize: 32,
    fontWeight: "bold",
    color: "#ff4444",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ff4444",
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