import React from "react"
import { View, Text, StyleSheet } from "react-native"

type Props = {
  count: number
  required: number
}

export default function LockedGate({ count, required }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Locked</Text>
      <Text style={styles.msg}>Get {required} correct cards to unlock this feature</Text>
      <View style={styles.progressWrap}>
        <Text style={styles.progress}>{count}</Text>
        <Text style={styles.progressSep}>/</Text>
        <Text style={styles.progressTotal}>{required}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#0E0E0E",
    borderRadius: 18,
    padding: 24,
    borderWidth: 1,
    borderColor: "#7AE2CF",
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    color: "#FFFFFF",
    fontSize: 22,
    marginBottom: 6,
    includeFontPadding: false,
    fontFamily: "Orbitron_700Bold"
  },
  msg: {
    color: "#96A0A0",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 14,
    includeFontPadding: false,
    fontFamily: "Montserrat_400Regular"
  },
  progressWrap: {
    flexDirection: "row",
    alignItems: "baseline"
  },
  progress: {
    color: "#7AE2CF",
    fontSize: 28,
    includeFontPadding: false,
    fontFamily: "Orbitron_700Bold"
  },
  progressSep: {
    color: "#7AE2CF",
    fontSize: 22,
    marginHorizontal: 6,
    includeFontPadding: false,
    fontFamily: "Orbitron_700Bold"
  },
  progressTotal: {
    color: "#7AE2CF",
    fontSize: 22,
    includeFontPadding: false,
    fontFamily: "Orbitron_700Bold"
  }
})
