import React, { useState } from "react"
import { View, Image, ActivityIndicator, StyleSheet } from "react-native"

type Props = {
  source: any
  style?: any
  containerStyle?: any
  resizeMode?: "cover" | "contain" | "stretch" | "repeat" | "center"
}

export default function LoaderImage({ source, style, containerStyle, resizeMode = "contain" }: Props) {
  const [loading, setLoading] = useState(true)
  return (
    <View style={[styles.wrap, containerStyle]}>
      <Image source={source} style={[styles.img, style]} resizeMode={resizeMode} onLoadStart={() => setLoading(true)} onLoadEnd={() => setLoading(false)} onError={() => setLoading(false)} />
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="small" color="#7AE2CF" />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    height: "100%",
    position: "relative",
    overflow: "hidden",
    borderRadius: 14
  },
  img: {
    width: "100%",
    height: "100%"
  },
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  }
})
