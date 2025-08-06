import React, { useState } from "react";
import { SafeAreaView, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform} from "react-native";
import { loginUser } from "../services/authService";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
    try {
      await loginUser(email, password);
      navigation.replace("Home");
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.appName}>CodeSwipe</Text>
        <Text style={styles.heading}>Log In</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#AAA"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#AAA"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
          <Text style={styles.primaryButtonText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.link}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#323232"
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30
  },
  appName: {
    fontSize: 28,
    color: "#7AE2CF",
    textAlign: "center",
    marginBottom: 6,
    fontWeight: "700"
  },
  heading: {
    fontSize: 18,
    color: "#FEFBF6",
    marginBottom: 18,
    textAlign: "center"
  },
  input: {
    borderWidth: 1,
    borderColor: "#FEFBF6",
    color: "#FEFBF6",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === "ios" ? 10 : 6,
    marginBottom: 12,
    fontSize: 14
  },
  primaryButton: {
    backgroundColor: "#7AE2CF",
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 12
  },
  primaryButtonText: {
    color: "#323232",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center"
  },
  link: {
    color: "#7AE2CF",
    fontSize: 12,
    textAlign: "center"
  }
});
