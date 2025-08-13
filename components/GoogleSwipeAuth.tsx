import React, { useEffect, useState } from "react"
import { Platform, ViewStyle, Alert } from "react-native"
import * as WebBrowser from "expo-web-browser"
import * as Google from "expo-auth-session/providers/google"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"
import { finishGoogleSignIn, signInWithGoogleWeb } from "../services/authService"

WebBrowser.maybeCompleteAuthSession()

type Props = {
  onSuccess: () => void
  style?: ViewStyle
  children?: React.ReactNode
}

export default function GoogleSwipeAuth({ onSuccess, style, children }: Props) {
  const [loading, setLoading] = useState(false)

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: "152169237437-jdcoc54ppqj2lu3a57b3pggk3j92tqhi.apps.googleusercontent.com",
    androidClientId: "152169237437-bss0sntoknooka4mkvvgo6n0mphli240.apps.googleusercontent.com",
    webClientId: "152169237437-jp9qlsbrrftotsaq50re6b0kli7pjeq9.apps.googleusercontent.com"
  })

  const triggerLogin = async () => {
    if (loading) return
    setLoading(true)
    try {
      if (Platform.OS === "web") {
        await signInWithGoogleWeb()
        onSuccess()
      } else {
        if (!request) { setLoading(false); return }
        const res = await promptAsync()
        if (res.type !== "success") setLoading(false)
      }
    } catch (e: any) {
      Alert.alert("Google Sign-in Failed", e?.message ?? String(e))
      setLoading(false)
    }
  }

  useEffect(() => {
    if (Platform.OS === "web") return
    if (response?.type !== "success") return
    const idToken = response.authentication?.idToken
    if (!idToken) { setLoading(false); return }
    finishGoogleSignIn(idToken).then(onSuccess).catch(() => setLoading(false))
  }, [response])

  const dragX = useSharedValue(0)
  const THRESH = 30

  const pan = Gesture.Pan()
    .activeOffsetX([10, 10000])
    .failOffsetY([-12, 12])
    .onUpdate(e => { dragX.value = Math.max(0, Math.min(e.translationX, 160)) })
    .onEnd(() => {
      const hit = dragX.value >= THRESH
      dragX.value = withSpring(0, { damping: 16, stiffness: 160 })
      if (hit) runOnJS(triggerLogin)()
    })

  const animStyle = useAnimatedStyle(() => ({ transform: [{ translateX: dragX.value }] }))

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[style, animStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  )
}
