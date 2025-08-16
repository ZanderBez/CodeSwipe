import React from "react"
import { View, StyleSheet, ViewStyle } from "react-native"

type Props = {
  value: number
  max: number
  color?: string
  height?: number
  trackStyle?: ViewStyle
  fillStyle?: ViewStyle
}

export default function ProgressBar({ value, max, color = "#FD5308", height = 16, trackStyle, fillStyle }: Props) {
  const pct = Math.min((value / Math.max(1, max)) * 100, 100)
  return (
    <View style={[styles.track, { height }, trackStyle]}>
      <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color }, fillStyle]} />
    </View>
  )
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: "#0B0B0B",
    borderRadius: 999,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1F1F1F"
  },
  fill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderTopRightRadius: 999,
    borderBottomRightRadius: 999
  }
})
