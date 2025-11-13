import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import ProgressBar from "./ProgressBar";

type Props = {
  label: string;
  value: number;
  max: number;
  barHeight?: number;
  trackStyle?: ViewStyle;
  fillStyle?: ViewStyle;
  compact?: boolean; // optional for smaller spacing
};

export default function ProgressRow({
  label,
  value,
  max,
  barHeight = 16,
  trackStyle,
  fillStyle,
  compact = false,
}: Props) {
  return (
    <View style={[styles.row, compact && styles.compactRow]}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}/{max}</Text>
      </View>
      <ProgressBar
        value={value}
        max={max}
        height={barHeight}
        trackStyle={trackStyle}
        fillStyle={fillStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginBottom: 16,
  },
  compactRow: {
    marginBottom: 10,
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    color: "#FFFFFF",
    fontFamily: "Orbitron_700Bold",
    fontSize: 14,
  },
  value: {
    color: "#FFFFFF",
    fontFamily: "Montserrat_700Bold",
    fontSize: 14,
  },
});
