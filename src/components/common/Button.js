import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Button = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  loading = false,
  variant = "primary", // 'primary', 'secondary', 'outline'
  size = "medium", // 'small', 'medium', 'large'
  fullWidth = false,
  icon,
  iconPosition = "left", // 'left', 'right'
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];

    if (fullWidth) {
      baseStyle.push(styles.fullWidth);
    }

    if (disabled) {
      baseStyle.push(styles.disabled);
    }

    if (variant === "outline") {
      baseStyle.push(styles.outline);
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseTextStyle = [styles.text, styles[`${size}Text`]];

    if (disabled) {
      baseTextStyle.push(styles.disabledText);
    }

    if (variant === "outline") {
      baseTextStyle.push(styles.outlineText);
    }

    return baseTextStyle;
  };

  const getGradientColors = () => {
    if (disabled) {
      return ["#cccccc", "#cccccc"];
    }

    switch (variant) {
      case "secondary":
        return ["#666666", "#555555"];
      case "outline":
        return ["transparent", "transparent"];
      default:
        return ["#000000", "#333333"];
    }
  };

  const renderContent = () => (
    <View style={styles.content}>
      {icon && iconPosition === "left" && (
        <View style={styles.iconLeft}>{icon}</View>
      )}
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "outline" ? "#000000" : "#ffffff"}
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
      {icon && iconPosition === "right" && (
        <View style={styles.iconRight}>{icon}</View>
      )}
    </View>
  );

  if (variant === "outline") {
    return (
      <TouchableOpacity
        style={[getButtonStyle(), style]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={getGradientColors()}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        {renderContent()}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  // Size variants
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 48,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 56,
  },
  // Text sizes
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  // Width
  fullWidth: {
    width: "100%",
  },
  // Variants
  outline: {
    borderWidth: 2,
    borderColor: "#000000",
    backgroundColor: "transparent",
  },
  // States
  disabled: {
    opacity: 0.6,
  },
  // Text styles
  text: {
    color: "#ffffff",
    fontWeight: "600",
    textAlign: "center",
  },
  outlineText: {
    color: "#000000",
  },
  disabledText: {
    color: "#999999",
  },
});

export default Button;
