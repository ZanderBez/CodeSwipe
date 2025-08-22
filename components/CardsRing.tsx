import React, { useEffect } from "react"
import { View, Text, StyleSheet } from "react-native"
import Svg, { Circle, G } from "react-native-svg"
import Animated, { useSharedValue, withTiming, useAnimatedProps, Easing } from "react-native-reanimated"

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

type Props = {
  value: number
  max: number
  size?: number
  title?: string
  progressColor?: string
  trackColor?: string
  strokeWidth?: number
  animateOnMount?: boolean
  durationMs?: number
  delayMs?: number
}

export default function CardsRing({
  value,
  max,
  size = 140,
  title = "Cards Correct",
  progressColor = "#7AE2CF",
  trackColor = "#1F1F1F",
  strokeWidth = 14,
  animateOnMount = true,
  durationMs = 900,
  delayMs = 0
}: Props) {
  const r = (size - strokeWidth) / 2
  const c = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(1, max ? value / max : 0))
  const progress = useSharedValue(animateOnMount ? 0 : pct)

  useEffect(() => {
    progress.value = withTiming(pct, { duration: durationMs, easing: Easing.out(Easing.cubic) }, undefined)
  }, [pct, durationMs, delayMs])

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: c * (1 - progress.value)
  }))

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.center}>
        <Svg width={size} height={size}>
          <G rotation={-90} originX={size / 2} originY={size / 2}>
            <Circle cx={size / 2} cy={size / 2} r={r} stroke={trackColor} strokeWidth={strokeWidth} fill="transparent" />
            <AnimatedCircle
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke={progressColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={c}
              animatedProps={animatedProps}
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
  wrap: {
    width: "100%"
  },
  title: {
    color: "#FFFFFF",
    fontSize: 20,
    includeFontPadding: false,
    fontFamily: "Orbitron_700Bold",
    marginBottom: 12
  },
  center: {
    alignItems: "center",
    justifyContent: "center"
  },
  centerText: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center"
  },
  value: {
    color: "#FFFFFF",
    fontSize: 18,
    includeFontPadding: false,
    fontFamily: "Montserrat_700Bold"
  }
})
