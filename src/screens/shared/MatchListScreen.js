import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import { useMatch } from "../../hooks/useMatch";
import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { COLORS, SIZES } from "../../constants";

const MatchListScreen = ({ navigation }) => {
  const { userData } = useAuth();
  const {
    matches,
    fetchMatches,
    getMatchDetails,
    updateMatchStatus,
    loading,
    error,
  } = useMatch();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMatches();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMatches();
    setRefreshing(false);
  };

  const handleMatchPress = async (match) => {
    try {
      // Update match activity (last seen)
      await updateMatchStatus(match.id, "active");

      // Navigate to chat screen
      navigation.navigate("ChatDetail", {
        matchId: match.id,
        otherUser: userData?.role === "student" ? match.tutor : match.student,
      });
    } catch (error) {
      console.error("Error opening match:", error);
    }
  };

  const renderMatchCard = ({ item }) => {
    const otherUser = userData?.role === "student" ? item.tutor : item.student;
    const isOnline =
      item.lastActivity &&
      new Date() - new Date(item.lastActivity) < 5 * 60 * 1000; // 5 minutes

    return (
      <TouchableOpacity
        style={styles.matchCard}
        onPress={() => handleMatchPress(item)}
      >
        <View style={styles.avatarContainer}>
          <Image
            source={
              otherUser?.profileImage
                ? { uri: otherUser.profileImage }
                : require("../../assets/avatar.png")
            }
            style={styles.avatar}
          />
          {isOnline && <View style={styles.onlineIndicator} />}
        </View>

        <View style={styles.matchInfo}>
          <Text style={styles.matchName}>
            {otherUser?.fullName || otherUser?.name || "Unknown User"}
          </Text>

          <Text style={styles.matchDetails}>
            {userData?.role === "student"
              ? `${otherUser?.subject || "Tutor"} • ${
                  otherUser?.experience || "Experience"
                }`
              : `${otherUser?.grade || "Student"} • Interested in ${
                  otherUser?.subject || "Learning"
                }`}
          </Text>

          {item.lastMessage && (
            <Text style={styles.lastMessage} numberOfLines={1}>
              {item.lastMessage.content}
            </Text>
          )}

          <Text style={styles.matchDate}>
            Matched on {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.matchStatus}>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          />

          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return COLORS.success;
      case "paused":
        return COLORS.warning;
      case "completed":
        return COLORS.gray;
      default:
        return COLORS.primary;
    }
  };

  if (loading && !refreshing) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Matches</Text>

      <FlatList
        data={matches}
        renderItem={renderMatchCard}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Image
              source={require("../../assets/msg1.png")}
              style={styles.emptyImage}
            />
            <Text style={styles.emptyTitle}>No Matches Yet</Text>
            <Text style={styles.emptyText}>
              {userData?.role === "student"
                ? "Start swiping to find your perfect tutor!"
                : "Students will appear here when they show interest in you."}
            </Text>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("SwipeAction")}
            >
              <Text style={styles.actionButtonText}>
                {userData?.role === "student"
                  ? "Find Tutors"
                  : "View Interested Students"}
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
  },
  header: {
    fontSize: SIZES.h2,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: SIZES.padding,
  },
  matchCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.base,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarContainer: {
    position: "relative",
    marginRight: SIZES.padding,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  matchInfo: {
    flex: 1,
  },
  matchName: {
    fontSize: SIZES.h4,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 4,
  },
  matchDetails: {
    fontSize: SIZES.body4,
    color: COLORS.primary,
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: SIZES.body4,
    color: COLORS.gray,
    marginBottom: 4,
  },
  matchDate: {
    fontSize: SIZES.caption,
    color: COLORS.lightGray,
  },
  matchStatus: {
    alignItems: "center",
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  unreadBadge: {
    backgroundColor: COLORS.red,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  unreadText: {
    color: COLORS.white,
    fontSize: SIZES.caption,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: SIZES.padding,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: SIZES.h3,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: SIZES.base,
  },
  emptyText: {
    fontSize: SIZES.body3,
    color: COLORS.gray,
    textAlign: "center",
    marginBottom: SIZES.padding * 2,
    paddingHorizontal: SIZES.padding,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding * 2,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: SIZES.body2,
    fontWeight: "bold",
  },
});

export default MatchListScreen;
