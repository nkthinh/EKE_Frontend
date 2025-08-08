import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const LoadingSpinner = ({ size = "medium", color = "#000000" }) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    );

    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.2,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 0.8,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );

    spinAnimation.start();
    scaleAnimation.start();

    return () => {
      spinAnimation.stop();
      scaleAnimation.stop();
    };
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const getSize = () => {
    switch (size) {
      case "small":
        return 20;
      case "large":
        return 60;
      default:
        return 40;
    }
  };

  const spinnerSize = getSize();

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.spinner,
          {
            width: spinnerSize,
            height: spinnerSize,
            borderColor: color,
            borderTopColor: "transparent",
            transform: [{ rotate: spin }, { scale: scaleValue }],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  spinner: {
    borderWidth: 3,
    borderRadius: 50,
  },
});

export default LoadingSpinner;
