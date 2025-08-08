import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS, SIZES } from "../../constants";

const Header = ({
  title,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  style,
  titleStyle,
  showBack = false,
  onBackPress,
}) => {
  return (
    <View style={[styles.header, style]}>
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity onPress={onBackPress} style={styles.iconButton}>
            <Icon
              name="arrow-left"
              size={SIZES.icon.md}
              color={COLORS.textPrimary}
            />
          </TouchableOpacity>
        )}
        {leftIcon && (
          <TouchableOpacity onPress={onLeftPress} style={styles.iconButton}>
            <Icon
              name={leftIcon}
              size={SIZES.icon.md}
              color={COLORS.textPrimary}
            />
          </TouchableOpacity>
        )}
      </View>

      <Text style={[styles.title, titleStyle]} numberOfLines={1}>
        {title}
      </Text>

      <View style={styles.rightContainer}>
        {rightIcon && (
          <TouchableOpacity onPress={onRightPress} style={styles.iconButton}>
            <Icon
              name={rightIcon}
              size={SIZES.icon.md}
              color={COLORS.textPrimary}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SIZES.padding.md,
    paddingVertical: SIZES.padding.sm,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    minHeight: 56,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 40,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 40,
    justifyContent: "flex-end",
  },
  title: {
    fontSize: SIZES.h4,
    fontWeight: "600",
    color: COLORS.textPrimary,
    flex: 1,
    textAlign: "center",
  },
  iconButton: {
    padding: SIZES.padding.xs,
  },
});

export default Header;
