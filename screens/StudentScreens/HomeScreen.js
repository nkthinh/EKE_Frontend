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

// Theme constants
const theme = {
  colors: {
    primary: "#31B7EC",
    like: "#00cc00",
    nope: "#ff4444",
    star: "#ffd700",
    flash: "#cc00cc",
    textPrimary: "#333",
    textSecondary: "#666",
    white: "#fff",
    background: "#f0f0f0",
    notification: "red",
  },
  sizes: {
    icon: 28,
    actionButton: 30,
    fontLarge: 20,
    fontMedium: 18,
    fontSmall: 14,
    logo: 40,
    notificationDot: 10,
  },
  border: {
    radius: 10,
    width: 2,
  },
};

// Constants for gesture handling
const SWIPE_THRESHOLD = Dimensions.get("window").width / 3;
const SWIPE_VELOCITY_THRESHOLD = 400;
const ANIMATION_DURATION = 300;
const SPRING_CONFIG = { damping: 15, stiffness: 100 };

// Configuration for assets
const assets = {
  logo: require("../../assets/logo.png"),
  defaultProfileImage: require("../../assets/girl.jpg"),
};

const ProfileCard = React.memo(({ profile, animatedStyle, translateX, isCurrent, navigation }) => {
  const [imageError, setImageError] = useState(false);
  
  console.log("Profile image source:", profile.image);
  console.log("Profile name:", profile.name);
  const likeOpacity = useAnimatedStyle(() => ({
    opacity: isCurrent ? interpolate(translateX.value, [0, -SWIPE_THRESHOLD], [0, 1]) : 0,
    transform: [{ rotate: "-30deg" }],
  }));

  const nopeOpacity = useAnimatedStyle(() => ({
    opacity: isCurrent ? interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1]) : 0,
    transform: [{ rotate: "30deg" }],
  }));

  return (
    <Animated.View style={[styles.imageContainer, animatedStyle]}>
      <TouchableOpacity
        onPress={() => navigation.navigate("LecturerDetailScreen", { profile })}
        activeOpacity={0.8}
      >
        <Image
          source={imageError ? assets.defaultProfileImage : (profile.image || assets.defaultProfileImage)}
          style={styles.profileImage}
          defaultSource={assets.defaultProfileImage}
          onError={(e) => {
            console.log("Image load error for", profile.name, ":", e.nativeEvent.error);
            setImageError(true);
          }}
          onLoad={() => console.log("Image loaded successfully for:", profile.name)}
          resizeMode="cover"
        />
      </TouchableOpacity>
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



const HomeScreen = ({ navigation, username = "User", greeting = "Hello" }) => {
  const { width } = Dimensions.get("window");
  
  console.log("personData imported:", personData);
  console.log("personData length:", personData?.length);

  if (!personData || personData.length === 0) {
    return (
      <StudentLayout navigation={navigation}>
        <GestureHandlerRootView style={styles.container}>
          <View style={styles.logoHeader}>
            <Image source={assets.logo} style={styles.logo} />
          </View>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.greeting}>{greeting},</Text>
              <Text style={styles.username}>{username}</Text>
            </View>
            <View style={styles.iconContainer}>
              <TouchableOpacity style={styles.icon}>
                <Icon name="settings" size={theme.sizes.icon} color={theme.colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.icon}>
                <Icon name="notifications" size={theme.sizes.icon} color={theme.colors.primary} />
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

  const indices = useMemo(() => {
    const prevIndex = (currentIndex - 1 + personData.length) % personData.length;
    const nextIndex = (currentIndex + 1) % personData.length;
    return [prevIndex, currentIndex, nextIndex];
  }, [currentIndex]);

  const updateIndex = useCallback(
    (newIndex) => {
      if (personData.length === 0) return;
      const boundedIndex = Math.max(0, Math.min(newIndex, personData.length - 1));
      setCurrentIndex(boundedIndex);
      translateX.value = 0;
    },
    [translateX]
  );

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
      if (event.velocityX > SWIPE_VELOCITY_THRESHOLD || (event.velocityX > 0 && translateX.value > SWIPE_THRESHOLD)) {
        translateX.value = withTiming(
          width,
          { duration: ANIMATION_DURATION, easing: Easing.bezier(0.25, 0.1, 0.25, 1) },
          () => {
            runOnJS(updateIndex)((currentIndex - 1 + personData.length) % personData.length);
          }
        );
      } else if (
        event.velocityX < -SWIPE_VELOCITY_THRESHOLD ||
        (event.velocityX < 0 && translateX.value < -SWIPE_THRESHOLD)
      ) {
        translateX.value = withTiming(
          -width,
          { duration: ANIMATION_DURATION, easing: Easing.bezier(0.25, 0.1, 0.25, 1) },
          () => {
            runOnJS(updateIndex)((currentIndex + 1) % personData.length);
          }
        );
      } else {
        translateX.value = withSpring(0, SPRING_CONFIG);
      }
    });

  const animatedStyleCurrent = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: interpolate(Math.abs(translateX.value), [0, SWIPE_THRESHOLD], [1, 0.8]),
    zIndex: 2,
  }));

  const animatedStylePrev = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value - width }],
    opacity: interpolate(Math.abs(translateX.value), [0, SWIPE_THRESHOLD], [0.5, 0.8]),
    zIndex: 1,
  }));

  const animatedStyleNext = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value + width }],
    opacity: interpolate(Math.abs(translateX.value), [0, SWIPE_THRESHOLD], [0.5, 0.8]),
    zIndex: 1,
  }));

  return (
    <StudentLayout navigation={navigation}>
      <GestureHandlerRootView style={styles.container}>
        <View style={styles.logoHeader}>
          <Image source={assets.logo} style={styles.logo} />
        </View>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>{greeting},</Text>
            <Text style={styles.username}>{username}</Text>
          </View>
          <View style={styles.iconContainer}>
            <TouchableOpacity style={styles.icon}>
              <Icon name="settings" size={theme.sizes.icon} color={theme.colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon}>
              <Icon name="notifications" size={theme.sizes.icon} color={theme.colors.primary} />
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
              navigation={navigation}
            />
          )}
          <GestureDetector gesture={panGesture}>
            <ProfileCard
              profile={personData[indices[1]]}
              animatedStyle={animatedStyleCurrent}
              translateX={translateX}
              isCurrent={true}
              navigation={navigation}
            />
          </GestureDetector>
          {personData[indices[2]] && (
            <ProfileCard
              profile={personData[indices[2]]}
              animatedStyle={animatedStyleNext}
              translateX={translateX}
              isCurrent={false}
              navigation={navigation}
            />
          )}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => updateIndex((currentIndex - 1 + personData.length) % personData.length)}
          >
            <Icon name="arrow-back" size={theme.sizes.icon + 2} color={theme.colors.nope} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="close" size={theme.sizes.icon + 2} color={theme.colors.nope} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="star" size={theme.sizes.icon + 2} color={theme.colors.star} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="heart" size={theme.sizes.icon + 2} color={theme.colors.like} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => updateIndex((currentIndex + 1) % personData.length)}
          >
            <Icon name="flash" size={theme.sizes.icon + 2} color={theme.colors.flash} />
          </TouchableOpacity>
        </View>
      </GestureHandlerRootView>
    </StudentLayout>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  logoHeader: {
    alignItems: "center",
    padding: 10,
    backgroundColor: theme.colors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: theme.colors.white,
    justifyContent: "space-between",
  },
  logo: {
    width: theme.sizes.logo,
    height: theme.sizes.logo,
  },
  headerText: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  greeting: {
    fontSize: theme.sizes.fontLarge,
    fontWeight: "bold",
    color: theme.colors.textPrimary,
  },
  username: {
    fontSize: theme.sizes.fontMedium,
    color: theme.colors.primary,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    padding: 5,
    borderRadius: theme.border.radius - 2,
    // marginBottom:10
  },
  icon: {
    marginHorizontal: 10,
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    top: 0,
    right: 0,
    width: theme.sizes.notificationDot,
    height: theme.sizes.notificationDot,
    backgroundColor: theme.colors.notification,
    borderRadius: theme.sizes.notificationDot / 2,
  },
  cardContainer: {
    // flex: 1,
    position: "relative",
    height: "70%",
    // marginTop: 10,
  },
  imageContainer: {
    position: "absolute",
    width: "100%",
    height: "90%",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: theme.border.radius,
    resizeMode: "cover",
  },
  likeText: {
    position: "absolute",
    top: 20,
    right: 20,
    fontSize: 32,
    fontWeight: "bold",
    color: theme.colors.like,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 10,
    borderRadius: theme.border.radius,
    borderWidth: theme.border.width,
    borderColor: theme.colors.like,
  },
  nopeText: {
    position: "absolute",
    top: 20,
    left: 20,
    fontSize: 32,
    fontWeight: "bold",
    color: theme.colors.nope,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 10,
    borderRadius: theme.border.radius,
    borderWidth: theme.border.width,
    borderColor: theme.colors.nope,
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
    fontSize: theme.sizes.fontLarge,
    fontWeight: "bold",
    color: theme.colors.textPrimary,
  },
  location: {
    fontSize: theme.sizes.fontSmall,
    color: theme.colors.textSecondary,
  },
  skillsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  skillButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  skillText: {
    color: theme.colors.white,
    fontSize: theme.sizes.fontSmall,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionButton: {
    width: theme.sizes.actionButton,
    height: theme.sizes.actionButton,
    borderRadius: theme.sizes.actionButton / 2,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;