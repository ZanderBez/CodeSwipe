import React, { memo } from "react"
import { View, Text, StyleSheet } from "react-native"
import ProgressBar from "./ProgressBar"

type Props = {
  label: string
  value: number
  max: number
}

function Row({ label, value, max }: Props) {
  return (
    <View style={styles.block}>
      <View style={styles.head}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.count}>{value}/{max}</Text>
      </View>
      <ProgressBar value={value} max={max} />
    </View>
  )
}

export default memo(Row)

const styles = StyleSheet.create({
  block: {
    marginBottom: 16
  },
  head: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6
  },
  label: {
    color: "#FFFFFF",
    fontSize: 14
  },
  count: {
    color: "#FFFFFF",
    fontSize: 12,
    opacity: 0.9
  }
})
