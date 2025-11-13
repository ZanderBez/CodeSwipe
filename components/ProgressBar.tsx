import React, { useEffect, useRef } from "react";
import { View, StyleSheet, ViewStyle, Animated, Easing } from "react-native";

type Props = {
  value: number;
  max: number;
  color?: string;
  height?: number;
  trackStyle?: ViewStyle;
  fillStyle?: ViewStyle;
  animateOnMount?: boolean;
  durationMs?: number;
  delayMs?: number;
};

export default function ProgressBar({
  value,
  max,
  color = "#FD5308",
  height = 16,
  trackStyle,
  fillStyle,
  animateOnMount = true,
  durationMs = 800,
  delayMs = 0,
}: Props) {
  const pct = Math.max(0, Math.min(1, max ? value / max : 0));
  const animatedValue = useRef(new Animated.Value(animateOnMount ? 0 : pct)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: pct,
      duration: durationMs,
      delay: delayMs,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [pct, durationMs, delayMs]);

  const widthInterpolated = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={[styles.track, { height }, trackStyle]}>
      <Animated.View
        style={[
          styles.fill,
          { backgroundColor: color, width: widthInterpolated },
          fillStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: "#0B0B0B",
    borderRadius: 999,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1F1F1F",
  },
  fill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderTopRightRadius: 999,
    borderBottomRightRadius: 999,
  },
});