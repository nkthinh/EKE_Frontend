import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useMatch } from "../../hooks/useMatch";
import { useAuth } from "../../hooks/useAuth";
import { COLORS, SIZES } from "../../constants";
import { ROUTES } from "../../navigation/routes";

const MatchActionCard = () => {
  const navigation = useNavigation();
  const { userData } = useAuth();
  const { matches, likedStudents } = useMatch();

  const handleNavigateToSwipe = () => {
    navigation.navigate(ROUTES.SWIPE_ACTION);
  };

  const handleNavigateToMatches = () => {
    navigation.navigate(ROUTES.MATCH_LIST);
  };

  const handleNavigateToLikedStudents = () => {
    navigation.navigate(ROUTES.TUTOR_LIKED_STUDENTS);
  };

  if (userData?.role === "student") {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Find Your Perfect Tutor</Text>
          <Text style={styles.subtitle}>Swipe to discover amazing tutors</Text>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionCard, styles.swipeCard]}
            onPress={handleNavigateToSwipe}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.swipeIcon}>💝</Text>
            </View>
            <Text style={styles.actionTitle}>Discover Tutors</Text>
            <Text style={styles.actionSubtitle}>Find your match</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, styles.matchCard]}
            onPress={handleNavigateToMatches}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.matchIcon}>💬</Text>
            </View>
            <Text style={styles.actionTitle}>Your Matches</Text>
            <Text style={styles.actionSubtitle}>
              {matches.length} active match{matches.length !== 1 ? "es" : ""}
            </Text>
            {matches.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{matches.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Tutor view
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Teaching Journey</Text>
        <Text style={styles.subtitle}>
          Connect with students who need your help
        </Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionCard, styles.likedCard]}
          onPress={handleNavigateToLikedStudents}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.likedIcon}>👨‍🎓</Text>
          </View>
          <Text style={styles.actionTitle}>Interested Students</Text>
          <Text style={styles.actionSubtitle}>
            {likedStudents.length} student
            {likedStudents.length !== 1 ? "s" : ""} interested
          </Text>
          {likedStudents.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{likedStudents.length}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, styles.matchCard]}
          onPress={handleNavigateToMatches}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.matchIcon}>💬</Text>
          </View>
          <Text style={styles.actionTitle}>Your Students</Text>
          <Text style={styles.actionSubtitle}>
            {matches.length} active student{matches.length !== 1 ? "s" : ""}
          </Text>
          {matches.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{matches.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    margin: SIZES.base,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    alignItems: "center",
    marginBottom: SIZES.padding,
  },
  title: {
    fontSize: SIZES.h3,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: SIZES.body4,
    color: COLORS.gray,
    textAlign: "center",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionCard: {
    flex: 1,
    alignItems: "center",
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginHorizontal: SIZES.base / 2,
    position: "relative",
  },
  swipeCard: {
    backgroundColor: COLORS.primary + "15",
    borderWidth: 1,
    borderColor: COLORS.primary + "30",
  },
  likedCard: {
    backgroundColor: COLORS.warning + "15",
    borderWidth: 1,
    borderColor: COLORS.warning + "30",
  },
  matchCard: {
    backgroundColor: COLORS.success + "15",
    borderWidth: 1,
    borderColor: COLORS.success + "30",
  },
  iconContainer: {
    marginBottom: SIZES.base,
  },
  swipeIcon: {
    fontSize: 32,
  },
  likedIcon: {
    fontSize: 32,
  },
  matchIcon: {
    fontSize: 32,
  },
  actionTitle: {
    fontSize: SIZES.body3,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 4,
    textAlign: "center",
  },
  actionSubtitle: {
    fontSize: SIZES.body4,
    color: COLORS.gray,
    textAlign: "center",
  },
  badge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: COLORS.red,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: SIZES.caption,
    fontWeight: "bold",
  },
});

export default MatchActionCard;
