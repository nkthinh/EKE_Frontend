import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import StudentLayout from "../../components/navigation/StudentLayout";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
  withSpring,
  interpolate,
} from "react-native-reanimated";
import { tutorService } from "../../services";
import { authService } from "../../services";
import { useAuth, useMatch } from "../../hooks";
import { useNavigation } from "@react-navigation/native";
import { ROUTES } from "../../navigation/routes";

// Theme constants - Modern Black & White
const theme = {
  colors: {
    primary: "#000000",
    secondary: "#333333",
    accent: "#666666",
    background: "#ffffff",
    cardBackground: "#f8f9fa",
    textPrimary: "#000000",
    textSecondary: "#666666",
    textLight: "#999999",
    border: "#e0e0e0",
    like: "#00cc00",
    nope: "#ff4444",
    star: "#ffd700",
    flash: "#cc00cc",
    notification: "#ff0000",
    success: "#28a745",
    warning: "#ffc107",
  },
  sizes: {
    icon: 24,
    iconLarge: 32,
    actionButton: 50,
    fontLarge: 24,
    fontMedium: 18,
    fontSmall: 14,
    fontTiny: 12,
    logo: 40,
    notificationDot: 8,
    borderRadius: 16,
    cardPadding: 20,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  shadows: {
    card: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    button: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 2,
    },
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

const ProfileCard = React.memo(
  ({ profile, animatedStyle, translateX, isCurrent, navigation }) => {
    const [imageError, setImageError] = useState(false);

    const likeOpacity = useAnimatedStyle(() => ({
      opacity: isCurrent
        ? interpolate(translateX.value, [0, -SWIPE_THRESHOLD], [0, 1])
        : 0,
    }));

    const nopeOpacity = useAnimatedStyle(() => ({
      opacity: isCurrent
        ? interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1])
        : 0,
    }));

    return (
      <Animated.View style={[styles.cardWrapper, animatedStyle]}>
        <TouchableOpacity
          onPress={() => {
            console.log("Navigating to lecturer detail with profile:", profile);
            navigation.navigate(ROUTES.STUDENT_LECTURER_DETAIL, { profile });
          }}
          activeOpacity={0.9}
          style={styles.cardTouchable}
        >
          {/* Profile Image with Overlays */}
          <View style={styles.imageContainer}>
            <Image
              source={imageError ? assets.defaultProfileImage : profile.image}
              style={styles.profileImage}
              resizeMode="cover"
              onError={(error) => {
                console.log(
                  "Image load error:",
                  error,
                  "for profile:",
                  profile.fullName
                );
                console.log("Image source:", profile.image);
                setImageError(true);
              }}
              onLoad={() => {
                console.log("Image loaded successfully for:", profile.fullName);
                setImageError(false);
              }}
            />

            {/* Gradient Overlay for better text readability */}
            <View style={styles.gradientOverlay} />

            {/* Rating Badge */}
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={16} color={theme.colors.star} />
              <Text style={styles.ratingText}>
                {profile.rating?.score || profile.averageRating || "4.5"}
              </Text>
            </View>

            {/* Location Badge */}
            <View style={styles.locationBadge}>
              <Ionicons
                name="location"
                size={14}
                color={theme.colors.textLight}
              />
              <Text style={styles.locationText}>
                {profile.district || profile.city || "HCM"}
              </Text>
            </View>

            {/* Profile Info - Now inside imageContainer as overlay */}
            <View style={styles.profileInfo}>
              <View style={styles.nameContainer}>
                <Text style={styles.profileName}>
                  {profile.fullName || profile.name || "Không có tên"}
                </Text>
                {profile.birthYear && (
                  <Text style={styles.profileAge}>
                    {new Date().getFullYear() - profile.birthYear} tuổi
                  </Text>
                )}
              </View>

              <View style={styles.detailsContainer}>
                {profile.university && (
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="school"
                      size={16}
                      color={theme.colors.textLight}
                    />
                    <Text style={styles.detailText}>{profile.university}</Text>
                  </View>
                )}

                {profile.major && (
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="book"
                      size={16}
                      color={theme.colors.textLight}
                    />
                    <Text style={styles.detailText}>{profile.major}</Text>
                  </View>
                )}

                {profile.totalReviews && (
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="people"
                      size={16}
                      color={theme.colors.textLight}
                    />
                    <Text style={styles.detailText}>
                      {profile.totalReviews} học viên đã học
                    </Text>
                  </View>
                )}
              </View>

              {/* Skills */}
              <View style={styles.skillsContainer}>
                {profile.skills &&
                Array.isArray(profile.skills) &&
                profile.skills.length > 0 ? (
                  profile.skills.map((skill, index) => (
                    <View
                      key={`${profile.id}-${index}`}
                      style={styles.skillChip}
                    >
                      <Text style={styles.skillText}>
                        {skill.text || skill || "Kỹ năng"}
                      </Text>
                    </View>
                  ))
                ) : (
                  <View style={styles.skillChip}>
                    <Text style={styles.skillText}>Toán, Tiếng Anh</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Swipe Overlays */}
        <Animated.View style={[styles.likeOverlay, likeOpacity]}>
          <View style={styles.overlayContent}>
            <Ionicons name="heart" size={48} color={theme.colors.like} />
            <Text style={[styles.overlayText, { color: theme.colors.like }]}>
              LIKE
            </Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.nopeOverlay, nopeOpacity]}>
          <View style={styles.overlayContent}>
            <Ionicons name="close" size={48} color={theme.colors.nope} />
            <Text style={[styles.overlayText, { color: theme.colors.nope }]}>
              NOPE
            </Text>
          </View>
        </Animated.View>
      </Animated.View>
    );
  }
);

const HomeScreen = ({ navigation }) => {
  const { width } = Dimensions.get("window");
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchParams, setSearchParams] = useState({
    page: 1,
    pageSize: 20,
  });
  const { userData, loading: authLoading, reloadUserData } = useAuth();
  const { handleStudentSwipe, loading: matchLoading } = useMatch();

  // Reanimated hooks
  const translateX = useSharedValue(0);
  const isSwiping = useSharedValue(false);

  // Lấy thông tin user từ đăng nhập
  const username = userData?.fullName || "Người dùng";
  const greeting = "Xin chào";

  // Debug: Log thông tin user
  console.log("HomeScreen - userData:", userData);
  console.log("HomeScreen - authLoading:", authLoading);
  console.log("HomeScreen - username:", username);

  const indices = useMemo(() => {
    const prevIndex = (currentIndex - 1 + tutors.length) % tutors.length;
    const nextIndex = (currentIndex + 1) % tutors.length;
    return [prevIndex, currentIndex, nextIndex];
  }, [currentIndex, tutors.length]);

  const updateIndex = useCallback(
    (newIndex) => {
      if (tutors.length === 0) return;
      const boundedIndex = Math.max(0, Math.min(newIndex, tutors.length - 1));
      setCurrentIndex(boundedIndex);
      translateX.value = 0;
    },
    [translateX, tutors.length]
  );

  // Function để reload tutors với tham số mới
  const reloadTutors = useCallback(
    async (newParams = {}) => {
      try {
        setLoading(true);
        const updatedParams = { ...searchParams, ...newParams };
        setSearchParams(updatedParams);

        console.log("Loading tutors with params:", updatedParams);
        const response = await tutorService.searchTutors({ updatedParams });
        console.log("Tutors loaded from API:", response);

        // Xử lý data từ API thực tế
        const apiData = response.data || [];
        console.log("Raw API data:", apiData);

        const processedTutors = apiData.map((tutor) => {
          return {
            id: tutor.id,
            userId: tutor.userId,
            fullName: tutor.fullName,
            profileImage: tutor.profileImage,
            city: tutor.city,
            district: tutor.district,
            averageRating: tutor.averageRating,
            totalReviews: tutor.totalReviews,
            // Map data từ API sang cấu trúc phù hợp
            name: tutor.fullName,
            birthYear: 2000, // Có thể lấy từ API nếu có
            university: "Đại học", // Có thể lấy từ API nếu có
            major: "Chuyên ngành", // Có thể lấy từ API nếu có
            address: `${tutor.district || ""}, ${tutor.city || ""}`.trim(),
            teachingExperience: ["Kinh nghiệm giảng dạy"],
            awards: ["Thành tích"],
            rating: {
              score: tutor.averageRating || 4.5,
              reviews: tutor.totalReviews || 0,
            },
            // Skills mặc định dựa trên thông tin tutor
            skills: [
              { text: "Toán", color: "#AFB7FF" },
              { text: "Tiếng Anh", color: "#FFCC80" },
              { text: "Lập trình", color: "#FF4B4A" },
            ],
            image:
              tutor.profileImage && tutor.profileImage.trim() !== ""
                ? { uri: tutor.profileImage }
                : assets.defaultProfileImage,
          };
        });

        console.log(
          "Processed tutors with images:",
          processedTutors.map((t) => ({
            name: t.fullName,
            imageSource: t.image,
            hasUri: t.image?.uri ? true : false,
          }))
        );
        setTutors(processedTutors);
        setCurrentIndex(0); // Reset về card đầu tiên
      } catch (error) {
        console.error("Error loading tutors:", error);
        setError("Không thể tải danh sách gia sư. Vui lòng thử lại sau.");
        setTutors([]);
      } finally {
        setLoading(false);
      }
    },
    [searchParams]
  );

  // Handle tutor match (when student swipes left/likes)
  const handleTutorMatch = useCallback(
    async (tutorId) => {
      try {
        console.log(
          "Student likes tutor, calling handleStudentSwipe...",
          tutorId
        );

        if (!userData || !userData.id) {
          Alert.alert("Lỗi", "Không tìm thấy thông tin người dùng.");
          return;
        }

        const result = await handleStudentSwipe(tutorId, "like");
        console.log("Swipe action result:", result);

        if (result?.isInstantMatch) {
          // Instant match logic is handled in the hook with an Alert
          // You can add navigation or other logic here if needed
          console.log("Instant match occurred with tutor:", tutorId);
        } else if (result?.success) {
          // Like was sent, but not an instant match
          console.log("Like sent to tutor:", tutorId);
        }

        // Move to the next card after a successful swipe
        if (result?.success) {
          updateIndex((currentIndex + 1) % tutors.length);
        }
      } catch (error) {
        console.error("Error handling student swipe:", error);
        // Error is already handled in the hook with an Alert
      }
    },
    [handleStudentSwipe, userData, updateIndex, currentIndex, tutors.length]
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
      if (
        event.velocityX > SWIPE_VELOCITY_THRESHOLD ||
        (event.velocityX > 0 && translateX.value > SWIPE_THRESHOLD)
      ) {
        // Swipe right - dislike/skip
        translateX.value = withTiming(
          width,
          {
            duration: ANIMATION_DURATION,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          },
          () => {
            runOnJS(updateIndex)(
              (currentIndex - 1 + tutors.length) % tutors.length
            );
          }
        );
      } else if (
        event.velocityX < -SWIPE_VELOCITY_THRESHOLD ||
        (event.velocityX < 0 && translateX.value < -SWIPE_THRESHOLD)
      ) {
        // Swipe left - like/match
        translateX.value = withTiming(
          -width,
          {
            duration: ANIMATION_DURATION,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          },
          () => {
            // Get current tutor before updating index
            const currentTutor = tutors[currentIndex];
            if (currentTutor && currentTutor.id) {
              runOnJS(handleTutorMatch)(currentTutor.id);
            }
            runOnJS(updateIndex)((currentIndex + 1) % tutors.length);
          }
        );
      } else {
        translateX.value = withSpring(0, SPRING_CONFIG);
      }
    });

  const animatedStyleCurrent = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: interpolate(
      Math.abs(translateX.value),
      [0, SWIPE_THRESHOLD],
      [1, 0.8]
    ),
    zIndex: 2,
  }));

  const animatedStylePrev = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value - width }],
    opacity: interpolate(
      Math.abs(translateX.value),
      [0, SWIPE_THRESHOLD],
      [0.5, 0.8]
    ),
    zIndex: 1,
  }));

  const animatedStyleNext = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value + width }],
    opacity: interpolate(
      Math.abs(translateX.value),
      [0, SWIPE_THRESHOLD],
      [0.5, 0.8]
    ),
    zIndex: 1,
  }));

  // Load tutors from API
  useEffect(() => {
    reloadTutors();
  }, []); // Chỉ chạy 1 lần khi component mount

  // Function để refresh data
  const handleRefresh = () => {
    reloadTutors();
  };

  // Function để tìm kiếm theo thành phố
  const handleSearchByCity = (city) => {
    reloadTutors({ city, page: 1 });
  };

  // Function để tìm kiếm theo rating
  const handleSearchByRating = (minRating) => {
    reloadTutors({ minRating, page: 1 });
  };

  const handleLogout = async () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          try {
            await authService.logout();
            navigation.reset({
              index: 0,
              routes: [{ name: "StudentLogin" }],
            });
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Lỗi", "Không thể đăng xuất. Vui lòng thử lại.");
          }
        },
      },
    ]);
  };

  // Early return for loading state
  if (loading || authLoading) {
    return (
      <StudentLayout>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </StudentLayout>
    );
  }

  // Early return for error state
  if (error) {
    return (
      <StudentLayout>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Lỗi: {error}</Text>
        </View>
      </StudentLayout>
    );
  }

  // Early return for no user data
  if (!userData || !userData.id) {
    return (
      <StudentLayout>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Vui lòng đăng nhập để sử dụng tính năng này
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={reloadUserData}>
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </StudentLayout>
    );
  }

  // Early return for no tutors
  if (tutors.length === 0) {
    return (
      <StudentLayout>
        <GestureHandlerRootView style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.greeting}>{greeting},</Text>
              <Text style={styles.username}>{username}</Text>
            </View>
            <View style={styles.iconContainer}>
              <TouchableOpacity style={styles.icon} onPress={handleRefresh}>
                <Ionicons
                  name="refresh-outline"
                  size={theme.sizes.icon}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.icon} onPress={handleLogout}>
                <Ionicons
                  name="log-out-outline"
                  size={theme.sizes.icon}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.icon}>
                <Ionicons
                  name="settings"
                  size={theme.sizes.icon}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.icon}>
                <Ionicons
                  name="notifications"
                  size={theme.sizes.icon}
                  color={theme.colors.primary}
                />
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

  return (
    <StudentLayout navigation={navigation}>
      <GestureHandlerRootView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>{greeting},</Text>
            <Text style={styles.username}>{username}</Text>
          </View>
          <View style={styles.iconContainer}>
            <TouchableOpacity style={styles.icon} onPress={handleRefresh}>
              <Ionicons
                name="refresh-outline"
                size={theme.sizes.icon}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon} onPress={handleLogout}>
              <Ionicons
                name="log-out-outline"
                size={theme.sizes.icon}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon}>
              <Ionicons
                name="settings-outline"
                size={theme.sizes.icon}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon}>
              <Ionicons
                name="notifications-outline"
                size={theme.sizes.icon}
                color={theme.colors.primary}
              />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Cards Container */}
        <View style={styles.cardContainer}>
          {tutors.length > 0 ? (
            <GestureDetector gesture={panGesture}>
              <ProfileCard
                profile={tutors[currentIndex]}
                animatedStyle={animatedStyleCurrent}
                translateX={translateX}
                isCurrent={true}
                navigation={navigation}
              />
            </GestureDetector>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="people-outline"
                size={64}
                color={theme.colors.textLight}
              />
              <Text style={styles.emptyText}>Không có gia sư nào</Text>
              <Text style={styles.emptySubtext}>Vui lòng thử lại sau</Text>
            </View>
          )}
        </View>

        {/* Action Buttons - Đặt ở trên bottom nav */}
        {tutors.length > 0 && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonSecondary]}
              onPress={() =>
                updateIndex((currentIndex - 1 + tutors.length) % tutors.length)
              }
            >
              <Ionicons
                name="arrow-back"
                size={theme.sizes.iconLarge}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonNope]}
              onPress={() => updateIndex((currentIndex + 1) % tutors.length)}
            >
              <Ionicons
                name="close"
                size={theme.sizes.iconLarge}
                color={theme.colors.white}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonStar]}
              onPress={() => {
                const currentTutor = tutors[currentIndex];
                if (currentTutor && currentTutor.id) {
                  handleTutorMatch(currentTutor.id);
                  updateIndex((currentIndex + 1) % tutors.length);
                }
              }}
            >
              <Ionicons
                name="star"
                size={theme.sizes.iconLarge}
                color={theme.colors.white}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonLike]}
              onPress={() => {
                if (tutors.length > 0) {
                  handleTutorMatch(tutors[currentIndex].id);
                }
              }}
              disabled={matchLoading}
            >
              <Ionicons
                name="heart"
                size={theme.sizes.iconLarge}
                color={theme.colors.white}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonSecondary]}
              onPress={() => updateIndex((currentIndex + 1) % tutors.length)}
            >
              <Ionicons
                name="arrow-forward"
                size={theme.sizes.iconLarge}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        )}
      </GestureHandlerRootView>
    </StudentLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    fontSize: theme.fontMedium,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  username: {
    fontSize: theme.fontLarge + 4,
    fontWeight: "bold",
    color: theme.colors.textPrimary,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.cardBackground,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius,
    ...theme.shadows.button,
  },
  icon: {
    padding: theme.spacing.sm,
    marginHorizontal: 4,
  },
  notificationDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: theme.sizes.notificationDot + 2,
    height: theme.sizes.notificationDot + 2,
    borderRadius: (theme.sizes.notificationDot + 2) / 2,
    backgroundColor: theme.colors.notification,
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardWrapper: {
    width: "100%",
    height: "98%",
    marginBottom: 12,
    position: "relative",
    borderRadius: theme.borderRadius + 12,
    backgroundColor: theme.colors.white,
    ...theme.shadows.card,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  cardTouchable: {
    width: "100%",
    height: "100%",
    borderRadius: theme.borderRadius + 12,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
    borderRadius: theme.borderRadius + 12,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  ratingBadge: {
    position: "absolute",
    top: theme.spacing.md,
    right: theme.spacing.md,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
    minWidth: 70,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  ratingText: {
    color: theme.colors.white,
    fontSize: theme.fontSmall,
    fontWeight: "bold",
    marginLeft: 4,
  },
  locationBadge: {
    position: "absolute",
    bottom: theme.spacing.md,
    left: theme.spacing.md,
    backgroundColor: "rgba(0,0,0,0.9)",
    borderRadius: 20,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
    minWidth: 90,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  locationText: {
    color: theme.colors.white,
    fontSize: theme.fontSmall,
    marginLeft: 4,
    fontWeight: "500",
  },
  profileInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.lg,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderBottomLeftRadius: theme.borderRadius + 12,
    borderBottomRightRadius: theme.borderRadius + 12,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  profileName: {
    fontSize: 25,
    fontWeight: "bold",
    color: theme.colors.white,
    marginRight: theme.spacing.sm,
    flex: 1,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  profileAge: {
    fontSize: theme.fontSmall,
    color: theme.colors.white,
    opacity: 0.95,
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 16,
    fontWeight: "600",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  detailsContainer: {
    marginBottom: theme.spacing.sm,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  detailText: {
    fontSize: theme.fontSmall,
    color: theme.colors.white,
    marginLeft: theme.spacing.sm,
    opacity: 0.95,
    flex: 1,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: theme.spacing.sm,
  },
  skillChip: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    minWidth: 80,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  skillText: {
    color: theme.colors.primary,
    fontSize: theme.fontSmall,
    fontWeight: "bold",
    textAlign: "center",
  },
  likeOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 204, 0, 0.3)",
    borderRadius: theme.borderRadius,
    zIndex: 2,
  },
  nopeOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 68, 68, 0.3)",
    borderRadius: theme.borderRadius,
    zIndex: 2,
  },
  overlayContent: {
    alignItems: "center",
  },
  overlayText: {
    fontSize: theme.fontLarge,
    fontWeight: "bold",
    marginTop: theme.spacing.xs / 2,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    position: "absolute",
    bottom: -10,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  actionButton: {
    width: theme.sizes.actionButton + 10,
    height: theme.sizes.actionButton + 10,
    borderRadius: (theme.sizes.actionButton + 10) / 2,
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadows.button,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  actionButtonSecondary: {
    backgroundColor: theme.colors.cardBackground,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  actionButtonNope: {
    backgroundColor: theme.colors.nope,
    transform: [{ scale: 1.1 }],
  },
  actionButtonStar: {
    backgroundColor: theme.colors.star,
    transform: [{ scale: 1.1 }],
  },
  actionButtonLike: {
    backgroundColor: theme.colors.like,
    transform: [{ scale: 1.1 }],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    fontSize: theme.fontLarge,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  errorText: {
    fontSize: theme.fontLarge,
    fontWeight: "bold",
    color: theme.colors.notification,
    marginBottom: theme.spacing.lg,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius,
    marginTop: theme.spacing.md,
  },
  retryButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontMedium,
    fontWeight: "bold",
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  emptyText: {
    fontSize: theme.fontLarge,
    fontWeight: "bold",
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.md,
  },
  emptySubtext: {
    fontSize: theme.fontMedium,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
});

export default HomeScreen;
