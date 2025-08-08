import React from "react";
import { View, StyleSheet } from "react-native";

const Card = ({
  children,
  style,
  variant = "default", // 'default', 'elevated', 'outlined'
  padding = "medium", // 'none', 'small', 'medium', 'large'
  margin,
  borderRadius = 12,
  backgroundColor = "#fff",
  shadow = true,
}) => {
  const getCardStyle = () => {
    const baseStyle = [styles.card, { borderRadius, backgroundColor }];

    // Padding variants
    switch (padding) {
      case "none":
        baseStyle.push(styles.paddingNone);
        break;
      case "small":
        baseStyle.push(styles.paddingSmall);
        break;
      case "large":
        baseStyle.push(styles.paddingLarge);
        break;
      default:
        baseStyle.push(styles.paddingMedium);
    }

    // Variants
    switch (variant) {
      case "elevated":
        baseStyle.push(styles.elevated);
        break;
      case "outlined":
        baseStyle.push(styles.outlined);
        break;
      default:
        if (shadow) {
          baseStyle.push(styles.defaultShadow);
        }
    }

    // Margin
    if (margin) {
      baseStyle.push({ margin });
    }

    return baseStyle;
  };

  return <View style={[getCardStyle(), style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
  },
  // Padding variants
  paddingNone: {
    padding: 0,
  },
  paddingSmall: {
    padding: 12,
  },
  paddingMedium: {
    padding: 16,
  },
  paddingLarge: {
    padding: 24,
  },
  // Shadow variants
  defaultShadow: {
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  elevated: {
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  outlined: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    elevation: 0,
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
});

export default Card;
