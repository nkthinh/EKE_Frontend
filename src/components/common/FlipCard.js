import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
  runOnJS,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

// Theme constants
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
    success: "#28a745",
    warning: "#ffc107",
    white: "#ffffff",
  },
  sizes: {
    icon: 24,
    iconLarge: 32,
    fontLarge: 24,
    fontMedium: 18,
    fontSmall: 14,
    fontTiny: 12,
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
  },
};

const FlipCard = ({ profile, onClose, visible }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const flipRotation = useSharedValue(0);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      scale.value = withTiming(1, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      opacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    } else {
      scale.value = withTiming(0, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      opacity.value = withTiming(0, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }
  }, [visible]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    flipRotation.value = withTiming(isFlipped ? 0 : 180, {
      duration: 600,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  };

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipRotation.value, [0, 180], [0, 180]);
    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${rotateY}deg` },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipRotation.value, [0, 180], [180, 360]);
    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${rotateY}deg` },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    };
  });

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />

      <View style={styles.cardContainer}>
        {/* Front of card */}
        <Animated.View
          style={[styles.card, styles.cardFront, frontAnimatedStyle]}
        >
          <View style={styles.cardHeader}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.colors.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.flipButton} onPress={handleFlip}>
              <Ionicons
                name="information-circle"
                size={24}
                color={theme.colors.white}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.imageContainer}>
            <Image
              source={profile.image}
              style={styles.profileImage}
              resizeMode="cover"
            />
            <View style={styles.imageOverlay} />
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.nameSection}>
              <Text style={styles.profileName}>
                {profile.fullName || profile.name || "Không có tên"}
              </Text>
              {profile.birthYear && (
                <Text style={styles.profileAge}>
                  {new Date().getFullYear() - profile.birthYear} tuổi
                </Text>
              )}
            </View>

            <View style={styles.ratingSection}>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={20} color={theme.colors.star} />
                <Text style={styles.ratingText}>
                  {profile.rating?.score || profile.averageRating || "4.5"}
                </Text>
                <Text style={styles.reviewCount}>
                  ({profile.rating?.reviews || profile.totalReviews || 0} đánh
                  giá)
                </Text>
              </View>
            </View>

            <View style={styles.locationSection}>
              <Ionicons
                name="location"
                size={16}
                color={theme.colors.textLight}
              />
              <Text style={styles.locationText}>
                {profile.district || profile.city || "HCM"}
              </Text>
            </View>

            <View style={styles.skillsSection}>
              <Text style={styles.sectionTitle}>Môn học</Text>
              <View style={styles.skillsContainer}>
                {profile.skills &&
                Array.isArray(profile.skills) &&
                profile.skills.length > 0 ? (
                  profile.skills.map((skill, index) => (
                    <View key={index} style={styles.skillChip}>
                      <Text style={styles.skillText}>
                        {skill.text || skill}
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
        </Animated.View>

        {/* Back of card */}
        <Animated.View
          style={[styles.card, styles.cardBack, backAnimatedStyle]}
        >
          <View style={styles.cardHeader}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.colors.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.flipButton} onPress={handleFlip}>
              <Ionicons name="person" size={24} color={theme.colors.white} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.detailsContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>

              {profile.university && (
                <View style={styles.detailRow}>
                  <Ionicons
                    name="school"
                    size={20}
                    color={theme.colors.primary}
                  />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Trường đại học</Text>
                    <Text style={styles.detailValue}>{profile.university}</Text>
                  </View>
                </View>
              )}

              {profile.major && (
                <View style={styles.detailRow}>
                  <Ionicons
                    name="book"
                    size={20}
                    color={theme.colors.primary}
                  />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Chuyên ngành</Text>
                    <Text style={styles.detailValue}>{profile.major}</Text>
                  </View>
                </View>
              )}

              {profile.totalReviews && (
                <View style={styles.detailRow}>
                  <Ionicons
                    name="people"
                    size={20}
                    color={theme.colors.primary}
                  />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Học viên đã dạy</Text>
                    <Text style={styles.detailValue}>
                      {profile.totalReviews} người
                    </Text>
                  </View>
                </View>
              )}

              {profile.address && (
                <View style={styles.detailRow}>
                  <Ionicons
                    name="location"
                    size={20}
                    color={theme.colors.primary}
                  />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Địa chỉ</Text>
                    <Text style={styles.detailValue}>{profile.address}</Text>
                  </View>
                </View>
              )}
            </View>

            {profile.teachingExperience && (
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Kinh nghiệm giảng dạy</Text>
                {Array.isArray(profile.teachingExperience) ? (
                  profile.teachingExperience.map((exp, index) => (
                    <View key={index} style={styles.experienceItem}>
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color={theme.colors.success}
                      />
                      <Text style={styles.experienceText}>{exp}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.experienceText}>
                    {profile.teachingExperience}
                  </Text>
                )}
              </View>
            )}

            {profile.awards && (
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>
                  Thành tích & Giải thưởng
                </Text>
                {Array.isArray(profile.awards) ? (
                  profile.awards.map((award, index) => (
                    <View key={index} style={styles.awardItem}>
                      <Ionicons
                        name="trophy"
                        size={16}
                        color={theme.colors.star}
                      />
                      <Text style={styles.awardText}>{award}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.awardText}>{profile.awards}</Text>
                )}
              </View>
            )}

            <View style={styles.actionSection}>
              <TouchableOpacity style={styles.primaryButton}>
                <Ionicons
                  name="chatbubble"
                  size={20}
                  color={theme.colors.white}
                />
                <Text style={styles.primaryButtonText}>Nhắn tin</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryButton}>
                <Ionicons
                  name="calendar"
                  size={20}
                  color={theme.colors.primary}
                />
                <Text style={styles.secondaryButtonText}>Đặt lịch</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  cardContainer: {
    width: width * 0.9,
    height: height * 0.8,
    position: "relative",
  },
  card: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius + 8,
    overflow: "hidden",
    ...theme.shadows.card,
  },
  cardFront: {
    backfaceVisibility: "hidden",
  },
  cardBack: {
    backfaceVisibility: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  flipButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    height: "60%",
    position: "relative",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "40%",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  profileInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.lg,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
  },
  nameSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  profileName: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.primary,
    flex: 1,
  },
  profileAge: {
    fontSize: theme.fontSmall,
    color: theme.colors.textSecondary,
    backgroundColor: theme.colors.cardBackground,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 16,
    fontWeight: "600",
  },
  ratingSection: {
    marginBottom: theme.spacing.sm,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: theme.fontMedium,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginLeft: theme.spacing.xs,
  },
  reviewCount: {
    fontSize: theme.fontSmall,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  locationSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  locationText: {
    fontSize: theme.fontSmall,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  skillsSection: {
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.fontMedium,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skillChip: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 20,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  skillText: {
    color: theme.colors.primary,
    fontSize: theme.fontSmall,
    fontWeight: "600",
  },
  detailsContainer: {
    flex: 1,
    padding: theme.spacing.lg,
    paddingTop: 80,
  },
  detailSection: {
    marginBottom: theme.spacing.xl,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: theme.spacing.md,
  },
  detailContent: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  detailLabel: {
    fontSize: theme.fontSmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  detailValue: {
    fontSize: theme.fontMedium,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  experienceItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  experienceText: {
    fontSize: theme.fontSmall,
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  awardItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  awardText: {
    fontSize: theme.fontSmall,
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  actionSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius,
    marginRight: theme.spacing.sm,
  },
  primaryButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontMedium,
    fontWeight: "bold",
    marginLeft: theme.spacing.xs,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.cardBackground,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius,
    marginLeft: theme.spacing.sm,
  },
  secondaryButtonText: {
    color: theme.colors.primary,
    fontSize: theme.fontMedium,
    fontWeight: "bold",
    marginLeft: theme.spacing.xs,
  },
});

export default FlipCard;
