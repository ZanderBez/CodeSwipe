import React, { memo } from "react"
import { View, Text, StyleSheet } from "react-native"
import ProgressBar from "./ProgressBar"

type Props = {
  label: string
  value: number
  max: number
  textColor?: string
  barHeight?: number
  compact?: boolean
}

function Row({ label, value, max, textColor = "#FFFFFF", barHeight = 16, compact = false }: Props) {
  return (
    <View style={[styles.block, compact && styles.blockCompact]}>
      <View style={styles.head}>
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
        <Text style={[styles.count, { color: textColor }]}>{value}/{max}</Text>
      </View>
      <ProgressBar value={value} max={max} height={barHeight} />
    </View>
  )
}

export default memo(Row)

const styles = StyleSheet.create({
  block: {
    marginBottom: 16
  },
  blockCompact: {
    marginBottom: 10
  },
  head: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6
  },
  label: {
    fontSize: 14
  },
  count: {
    fontSize: 12,
    opacity: 0.9
  }
})
