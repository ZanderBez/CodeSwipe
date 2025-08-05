import React, { useState } from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { registerUser } from "../services/authService";

export default function SignUpScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
    try {
      await registerUser(email, password);
      setMessage("Signup successful!");
      Alert.alert("Success", "Account created! You can now log in.");
      navigation.navigate("Home");
    } catch (error: any) {
      setMessage(error.message || "Signup failed.");
      Alert.alert("Signup Failed", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.heading}>Create Account</Text>
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
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.link}>Already have an account? Log In</Text>
        </TouchableOpacity>
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>
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
  paddingHorizontal: 40 },
  heading: { 
  fontSize: 28, 
  color: "#7AE2CF", 
  marginBottom: 20, 
  textAlign: "center" 
},
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
 link: { 
 marginTop: 15, 
 color: "#7AE2CF", 
 textAlign: "center" 
},
  buttonText: { 
  color: "white", 
  fontSize: 18, 
  fontWeight: "bold", 
  textAlign: "center" 
},
  message: { 
  marginTop: 15, 
  textAlign: "center", 
  color: "#FEFBF6" },
});
