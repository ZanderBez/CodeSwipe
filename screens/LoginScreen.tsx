import React, { useState } from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { loginUser } from "../services/authService";

function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
    try {
      await loginUser(email, password);
      setMessage("Login successful!");
      navigation.navigate("Home");
    } catch (error: any) {
      setMessage(error.message || "Login failed.");
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.heading}>Log In</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.link}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>

        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>
    </SafeAreaView>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#323232" },
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 40 },
  heading: { fontSize: 28, color: "#7AE2CF", marginBottom: 20, textAlign: "center" },
  input: {
    borderBottomWidth: 1,
    borderColor: "#7AE2CF",
    color: "#FEFBF6",
    marginBottom: 20,
    padding: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#7AE2CF",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: { color: "#323232", fontSize: 18, fontWeight: "bold", textAlign: "center" },
  link: { marginTop: 15, color: "#7AE2CF", textAlign: "center" },
  message: { marginTop: 15, textAlign: "center", color: "#FEFBF6" },
});
