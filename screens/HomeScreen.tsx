import React from "react";
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function HomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.heading}>Welcome to CodeSwipe</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#323232" },
  container: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20 },
  heading: { fontSize: 28, color: "#7AE2CF", marginBottom: 20, textAlign: "center" },
  button: {
    backgroundColor: "#7AE2CF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: { color: "#323232", fontSize: 18, fontWeight: "bold" },
});
