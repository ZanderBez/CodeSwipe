import React, { useState, useEffect } from "react";
import { SafeAreaView, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, View } from "react-native";
import { registerUser } from "../services/authService";
import { FontAwesome } from "@expo/vector-icons";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from "react-native-reanimated";
import GoogleSwipeAuth from "../components/GoogleSwipeAuth";

export default function SignUpScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const [loading, setLoading] = useState(false);

  const bob = useSharedValue(0);
  useEffect(() => {
    bob.value = withRepeat(withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.quad) }), -1, true);
  }, []);
  const bobStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (bob.value - 0.5) * 10 }]
  }));

  const handleSignUp = async () => {
    if (loading) return;
    if (!name || !email || !password) {
      Alert.alert("Error", "Please enter name, email and password.");
      return;
    }
    try {
      setLoading(true);
      await registerUser(name, email, password);
      navigation.reset({
        index: 0,
        routes: [{ name: "Home", params: { showOnboarding: true } }]
      });
    } catch (error: any) {
      Alert.alert("Signup Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.row}>
          <View style={styles.leftCol}>
            <View style={styles.accentCircle} pointerEvents="none" />
            <Text style={styles.joinTitle}>Join Us</Text>

            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#7B8B8B"
                value={name}
                onChangeText={setName}
              />
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
                style={[styles.signUpButton, loading && { opacity: 0.6 }]}
                onPress={handleSignUp}
                disabled={loading}
              >
                <Text style={styles.signUpText}>{loading ? "Signing up..." : "SIGN UP"}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.rightCol}>
            <GoogleSwipeAuth onSuccess={() => navigation.replace("Home", { showOnboarding: true })} style={styles.rightSwipeArea}>
              <Animated.View style={[styles.rightAnimated, bobStyle]}>
                <View style={styles.rightCopy}>
                  <Text style={styles.rightTitle}>Sign up</Text>
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

            <View style={styles.loginRow}>
              <Text style={styles.haveAcc}>Already Have an account ? </Text>
              <Text style={styles.loginLink} onPress={() => navigation.navigate("Login")}>Log In</Text>
            </View>
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
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
  joinTitle: {
    fontSize: 44,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "800",
    letterSpacing: 1
  },
  form: {
    width: "100%",
    maxWidth: 500,
    gap: 10
  },
  input: {
    width: "100%",
    borderWidth: 2,
    borderColor: "#7AE2CF",
    color: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
    fontSize: 16
  },
  roleRow: {
    flexDirection: "row",
    gap: 14
  },
  roleButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  roleUser: {
    borderWidth: 2,
    borderColor: "#FFFFFF",
    backgroundColor: "transparent"
  },
  roleUserActive: {
    backgroundColor: "#FD5308"
  },
  roleUserText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700"
  },
  roleUserTextActive: {
    color: "#FFFFFF"
  },
  roleAdmin: {
    borderWidth: 2,
    borderColor: "#FFFFFF",
    backgroundColor: "transparent"
  },
  roleAdminActive: {
    backgroundColor: "#FD5308"
  },
  roleAdminText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700"
  },
  roleAdminTextActive: {
    color: "#FFFFFF"
  },
  signUpButton: {
    width: "100%",
    backgroundColor: "#7AE2CF",
    borderRadius: 12,
    height: 48,
    alignItems: "center",
    justifyContent: "center"
  },
  signUpText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1
  },
  accentCircle: {
    position: "absolute",
    right: -30,
    top: "30%",
    transform: [{ translateY: -260 }],
    width: 650,
    height: 650,
    borderRadius: 280,
    borderWidth: 2,
    borderColor: "#7AE2CF",
    backgroundColor: "transparent"
  },
  rightCol: {
    flex: 2,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 32,
    gap: 16
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
    fontWeight: "800",
    letterSpacing: 1
  },
  rightSub: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: "800",
    letterSpacing: 1
  },
  rightSwipeArea: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 32
  },
  googleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
    marginBottom: 16
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
    fontWeight: "700"
  },
  loginRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  haveAcc: {
    color: "#7AE2CF",
    fontSize: 14
  },
  loginLink: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700"
  }
});
