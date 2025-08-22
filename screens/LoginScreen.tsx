import React, { useState, useEffect } from "react"
import { SafeAreaView, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, View } from "react-native"
import { loginUser } from "../services/authService"
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from "react-native-reanimated"
import GoogleSwipeAuth from "../components/GoogleSwipeAuth"
import { FontAwesome } from "@expo/vector-icons"

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const bob = useSharedValue(0)
  useEffect(() => {
    bob.value = withRepeat(withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.quad) }), -1, true)
  }, [])
  const bobStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (bob.value - 0.5) * 10 }]
  }))

  const handleLogin = async () => {
    if (loading) return
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.")
      return
    }
    try {
      setLoading(true)
      await loginUser(email, password)
      navigation.replace("Home")
    } catch (error: any) {
      Alert.alert("Login Failed", error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.row}>
          <View style={styles.leftCol}>
            <View style={styles.accentCircle} pointerEvents="none" />
            <Text style={styles.title}>Welcome Back</Text>

            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#7B8B8B"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#7B8B8B"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TouchableOpacity
                style={[styles.primaryButton, loading && { opacity: 0.6 }]}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={styles.primaryButtonText}>{loading ? "Logging in..." : "Log In"}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={loading}
                onPress={() => navigation.navigate("SignUp")}
              >
                <Text style={styles.link}>Dont Have an account ? <Text style={styles.linkStrong}>Sign Up</Text></Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.rightCol}>
            <GoogleSwipeAuth onSuccess={() => navigation.replace("Home")} style={styles.rightSwipeArea}>
              <Animated.View style={[styles.rightAnimated, bobStyle]}>
                <View style={styles.rightCopy}>
                  <Text style={styles.rightTitle}>Log In</Text>
                  <Text style={styles.rightSub}>with</Text>
                </View>
                <View style={styles.googleRow}>
                  <View style={styles.googleBadge}>
                    <FontAwesome name="google" size={20} color="#000" />
                  </View>
                  <Text style={styles.arrow}>→</Text>
                </View>
              </Animated.View>
            </GoogleSwipeAuth>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000000"
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 12
  },
  row: {
    flex: 1,
    flexDirection: "row"
  },
  leftCol: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    paddingHorizontal: 24
  },
  title: {
    fontSize: 44,
    lineHeight: 48,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: 1,
    includeFontPadding: false,
    fontFamily: "Orbitron_700Bold"
  },
  form: {
    width: "100%",
    maxWidth: 500,
    gap: 12
  },
  input: {
    width: "100%",
    borderWidth: 2,
    borderColor: "#7AE2CF",
    color: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
    fontSize: 16,
    lineHeight: 20,
    includeFontPadding: false,
    fontFamily: "Montserrat_400Regular"
  },
  primaryButton: {
    width: "100%",
    backgroundColor: "#7AE2CF",
    borderRadius: 12,
    height: 48,
    alignItems: "center",
    justifyContent: "center"
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    letterSpacing: 1,
    includeFontPadding: false,
    fontFamily: "Orbitron_700Bold"
  },
  link: {
    color: "#7AE2CF",
    fontSize: 14,
    textAlign: "center",
    includeFontPadding: false,
    fontFamily: "Montserrat_400Regular"
  },
  linkStrong: {
    color: "#FFFFFF",
    includeFontPadding: false,
    fontFamily: "Montserrat_700Bold"
  },
  accentCircle: {
    position: "absolute",
    right: -30,
    top: "30%",
    transform: [{ translateY: -260 }],
    width: 650,
    height: 650,
    borderRadius: 280,
    borderWidth: 5,
    borderColor: "#7AE2CF",
    backgroundColor: "transparent"
  },
  rightCol: {
    flex: 2,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 32
  },
  rightSwipeArea: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 32
  },
  rightAnimated: {
    alignItems: "flex-end",
    gap: 8
  },
  rightCopy: {
    alignItems: "flex-end"
  },
  rightTitle: {
    color: "#FFFFFF",
    fontSize: 48,
    lineHeight: 52,
    letterSpacing: 1,
    includeFontPadding: false,
    fontFamily: "Orbitron_700Bold"
  },
  rightSub: {
    color: "#FFFFFF",
    fontSize: 48,
    lineHeight: 52,
    letterSpacing: 1,
    includeFontPadding: false,
    fontFamily: "Orbitron_700Bold"
  },
  googleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8
  },
  googleBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center"
  },
  arrow: {
    color: "#FFFFFF",
    fontSize: 26,
    includeFontPadding: false,
    fontFamily: "Orbitron_700Bold"
  }
})
