import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { useMatch } from "../../hooks/useMatch";
import { COLORS, SIZES } from "../../constants";

const MatchPopup = ({ visible, match, onClose, onStartChat }) => {
  if (!visible || !match) return null;

  const otherUser = match.student || match.tutor;

  return (
    <View style={styles.overlay}>
      <View style={styles.popup}>
        <Text style={styles.title}>🎉 It's a Match!</Text>

        <View style={styles.profilesContainer}>
          <Image
            source={
              otherUser?.profileImage
                ? { uri: otherUser.profileImage }
                : require("../../assets/avatar.png")
            }
            style={styles.profileImage}
          />
        </View>

        <Text style={styles.subtitle}>
          You and {otherUser?.fullName || otherUser?.name} have matched!
        </Text>

        <Text style={styles.description}>
          Start a conversation and begin your learning journey together.
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.laterButton]}
            onPress={onClose}
          >
            <Text style={styles.laterButtonText}>Maybe Later</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.chatButton]}
            onPress={() => {
              onStartChat(match);
              onClose();
            }}
          >
            <Text style={styles.chatButtonText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const SwipeCard = ({ tutor, onSwipe }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleSwipe = (action) => {
    onSwipe(tutor.id, action);
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={
            tutor.images && tutor.images.length > 0
              ? { uri: tutor.images[currentImageIndex] }
              : require("../../assets/teacher.jpg")
          }
          style={styles.cardImage}
        />

        {/* Image indicators */}
        {tutor.images && tutor.images.length > 1 && (
          <View style={styles.imageIndicators}>
            {tutor.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentImageIndex && styles.activeIndicator,
                ]}
              />
            ))}
          </View>
        )}
      </View>

      <View style={styles.cardContent}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{tutor.name}</Text>
          <Text style={styles.age}>{tutor.age}</Text>
        </View>

        <Text style={styles.subject}>{tutor.subject}</Text>

        <View style={styles.detailsRow}>
          <Text style={styles.rating}>⭐ {tutor.rating}</Text>
          <Text style={styles.experience}>{tutor.experience}</Text>
        </View>

        <Text style={styles.price}>{tutor.pricePerHour}/hour</Text>

        {tutor.bio && (
          <Text style={styles.bio} numberOfLines={2}>
            {tutor.bio}
          </Text>
        )}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.passButton]}
          onPress={() => handleSwipe("pass")}
        >
          <Text style={styles.actionIcon}>✕</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.superLikeButton]}
          onPress={() => handleSwipe("super_like")}
        >
          <Text style={styles.actionIcon}>⭐</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={() => handleSwipe("like")}
        >
          <Text style={styles.actionIcon}>♥</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Match Popup Styles
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  popup: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius * 2,
    padding: SIZES.padding * 2,
    margin: SIZES.padding,
    alignItems: "center",
    minWidth: 300,
  },
  title: {
    fontSize: SIZES.h1,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: SIZES.padding,
  },
  profilesContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SIZES.padding,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  subtitle: {
    fontSize: SIZES.h3,
    fontWeight: "bold",
    color: COLORS.black,
    textAlign: "center",
    marginBottom: SIZES.base,
  },
  description: {
    fontSize: SIZES.body3,
    color: COLORS.gray,
    textAlign: "center",
    marginBottom: SIZES.padding * 2,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
    marginHorizontal: SIZES.base / 2,
    alignItems: "center",
  },
  laterButton: {
    backgroundColor: COLORS.lightGray,
  },
  chatButton: {
    backgroundColor: COLORS.primary,
  },
  laterButtonText: {
    color: COLORS.gray,
    fontWeight: "bold",
  },
  chatButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },

  // Swipe Card Styles
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius * 2,
    margin: SIZES.padding,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
    height: 400,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageIndicators: {
    position: "absolute",
    top: SIZES.base,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 2,
  },
  activeIndicator: {
    backgroundColor: COLORS.white,
  },
  cardContent: {
    padding: SIZES.padding,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SIZES.base / 2,
  },
  name: {
    fontSize: SIZES.h2,
    fontWeight: "bold",
    color: COLORS.black,
    marginRight: SIZES.base,
  },
  age: {
    fontSize: SIZES.h3,
    color: COLORS.gray,
  },
  subject: {
    fontSize: SIZES.body2,
    color: COLORS.primary,
    fontWeight: "600",
    marginBottom: SIZES.base / 2,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SIZES.base / 2,
  },
  rating: {
    fontSize: SIZES.body3,
    color: COLORS.warning,
  },
  experience: {
    fontSize: SIZES.body3,
    color: COLORS.gray,
  },
  price: {
    fontSize: SIZES.body2,
    fontWeight: "bold",
    color: COLORS.secondary,
    marginBottom: SIZES.base,
  },
  bio: {
    fontSize: SIZES.body4,
    color: COLORS.gray,
    lineHeight: SIZES.body4 * 1.4,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: SIZES.padding,
    paddingTop: 0,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  passButton: {
    backgroundColor: COLORS.lightGray,
  },
  superLikeButton: {
    backgroundColor: COLORS.warning,
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  likeButton: {
    backgroundColor: COLORS.success,
  },
  actionIcon: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.white,
  },
});

export { MatchPopup, SwipeCard };
export default { MatchPopup, SwipeCard };
