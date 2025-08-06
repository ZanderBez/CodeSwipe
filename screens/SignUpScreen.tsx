import React, { useState } from "react";
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  View
} from "react-native";
import { registerUser } from "../services/authService";

export default function SignUpScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please enter name, email and password.");
      return;
    }
    try {
      await registerUser(name, email, password, role);
      Alert.alert("Success", `Account created as ${role}.`);
      navigation.navigate("Login");
    } catch (error: any) {
      Alert.alert("Signup Failed", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.appName}>CodeSwipe</Text>
        <Text style={styles.heading}>Create Account</Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#AAA"
          value={name}
          onChangeText={setName}
        />

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

        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              role === "user" && { backgroundColor: "#C678DD" }
            ]}
            onPress={() => setRole("user")}
          >
            <Text
              style={[
                styles.toggleText,
                role === "user" && { color: "#323232" }
              ]}
            >
              User
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleButton,
              role === "admin" && { backgroundColor: "#E5C07B" }
            ]}
            onPress={() => setRole("admin")}
          >
            <Text
              style={[
                styles.toggleText,
                role === "admin" && { color: "#323232" }
              ]}
            >
              Admin
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={handleSignUp}>
          <Text style={styles.primaryButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>Already have an account? Log In</Text>
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
  toggleRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 18
  },
  toggleButton: {
    borderWidth: 1,
    borderColor: "#FEFBF6",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginHorizontal: 6
  },
  toggleText: {
    color: "#FEFBF6",
    fontSize: 14,
    textAlign: "center"
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
