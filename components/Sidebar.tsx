import React from "react"
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { logoutUser } from "../services/authService"

type SidebarProps = {
  name: string
  navigation: any
  active?: "Home" | "Performance" | "Profile" | "Create"
}

export default function Sidebar({ name, navigation, active = "Home" }: SidebarProps) {
  const handleLogout = async () => {
    await logoutUser()
    navigation.replace("Login")
  }

  return (
    <View style={styles.sidebar}>
      <View style={styles.sideTop}>
        <Text style={styles.hiText}>Hi {name || "Coder"}</Text>
      </View>

      <TouchableOpacity
        style={[styles.navBtn, active === "Home" && styles.navActive]}
        onPress={() => navigation.navigate("Home")}
      >
        <Ionicons name="home" size={22} color={active === "Home" ? "#0B0B0B" : "#FFFFFF"} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navBtn, active === "Performance" && styles.navActive]}
        onPress={() => navigation.navigate("Performance")}
      >
        <Ionicons name="stats-chart-outline" size={22} color={active === "Performance" ? "#0B0B0B" : "#FFFFFF"} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navBtn, active === "Profile" && styles.navActive]}
        onPress={() => navigation.navigate("Profile")}
      >
        <Ionicons name="person-outline" size={22} color={active === "Profile" ? "#0B0B0B" : "#FFFFFF"} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navBtn, active === "Create" && styles.navActive]}
        onPress={() => navigation.navigate("LearningHub")}
      >
        <Ionicons name="add-circle-outline" size={22} color={active === "Create" ? "#0B0B0B" : "#FFFFFF"} />
      </TouchableOpacity>

      <TouchableOpacity style={[styles.navBtn, styles.logoutBtn]} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  sidebar: {
    width: 96,
    borderWidth: 1,
    borderColor: "#7AE2CF",
    borderRadius: 16,
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 18 : 10,
    paddingBottom: 18,
    position: "relative",
    overflow: "hidden",
    marginVertical: 8
  },
  sideTop: {
    width: "100%",
    alignItems: "center",
    marginBottom: 12
  },
  hiText: {
    color: "#FFFFFF",
    fontSize: 12
  },
  navBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#000000ff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6
  },
  navActive: {
    backgroundColor: "#7AE2CF"
  },
  logoutBtn: {
    backgroundColor: "#FD5308",
    marginTop: 22
  }
})
