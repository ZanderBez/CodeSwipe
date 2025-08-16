import React from "react"
import { View, Text, StyleSheet } from "react-native"
import Svg, { Circle, G } from "react-native-svg"

type Props = {
  value: number
  max: number
  size?: number
  title?: string
  progressColor?: string
  trackColor?: string
}

export default function CardsRing({
  value,
  max,
  size = 140,
  title = "Cards Correct",
  progressColor = "#7AE2CF",
  trackColor = "#1F1F1F"
}: Props) {
  const strokeWidth = 14
  const r = (size - strokeWidth) / 2
  const c = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(1, max ? value / max : 0))
  const offset = c * (1 - pct)

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.center}>
        <Svg width={size} height={size}>
          <G rotation={-90} originX={size / 2} originY={size / 2}>
            <Circle cx={size / 2} cy={size / 2} r={r} stroke={trackColor} strokeWidth={strokeWidth} fill="transparent" />
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke={progressColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={offset}
              fill="transparent"
            />
          </G>
        </Svg>
        <View style={[styles.centerText, { width: size, height: size }]}>
          <Text style={styles.value}>{value}/{max}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { width: "100%" },
  title: { color: "#FFFFFF", fontSize: 20, fontWeight: "800", marginBottom: 12 },
  center: { alignItems: "center", justifyContent: "center" },
  centerText: { position: "absolute", alignItems: "center", justifyContent: "center" },
  value: { color: "#FFFFFF", fontSize: 18, fontWeight: "800" }
})
