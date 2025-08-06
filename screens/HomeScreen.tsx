import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { logoutUser } from "../services/authService";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function HomeScreen({ navigation }: any) {
  const [name, setName] = useState<string>("");
  const [streak, setStreak] = useState<number>(0);
  const difficulties4 = ["Beginner", "Intermediate", "Expert", "All Levels"] as const;
  const [scores] = useState({ Beginner: 0, Intermediate: 0, Expert: 5, "All Levels": 0 });

  useEffect(() => {
    if (auth.currentUser) {
      getDoc(doc(db, "users", auth.currentUser.uid)).then(snap => {
        if (snap.exists()) {
          const data = snap.data();
          setName(data.name || "");
          setStreak(data.streak || 0);
        }
      });
    }
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    navigation.replace("Login");
  };

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short"
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.sidebar}>
          <Text style={styles.date}>{today}</Text>
          <TouchableOpacity
            style={[styles.iconBtn, styles.activeBtn]}
            onPress={() => navigation.navigate("Home")}
          >
            <Ionicons name="home-outline" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate("Flashcards", { difficulty: "Beginner" })}
          >
            <Ionicons name="book-outline" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate("Progress")}
          >
            <Ionicons name="bar-chart-outline" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.mainContent}>
          <Text style={styles.welcomeHeader}>
            Welcome{name ? `, ${name}` : ""}!
          </Text>

          <View style={styles.sectionsRow}>

            <View style={styles.progressSection}>
              <Text style={styles.sectionTitle}>Your Score</Text>
              <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
                {difficulties4.map(level => {
                  const pct = (scores[level] / 10) * 100;
                  return (
                    <View key={level} style={styles.progressRow}>
                      <Text style={styles.progressLabel}>{level}</Text>
                      <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${pct}%` }]} />
                      </View>
                      <Text style={styles.progressText}>{scores[level]} / 10</Text>
                    </View>
                  );
                })}
              </ScrollView>
              <TouchableOpacity
                style={styles.detailsBtn}
                onPress={() => navigation.navigate("Progress")}
              >
                <Text style={styles.detailsBtnText}>View Details</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.difficultySection}>
              <Text style={styles.sectionTitle}>Select Difficulty</Text>
              <View style={styles.difficultyGrid}>
                {difficulties4.map(level => (
                  <TouchableOpacity
                    key={level}
                    style={styles.difficultyCard}
                    onPress={() => navigation.navigate("Flashcards", { difficulty: level })}
                  >
                    <Text style={styles.difficultyText}>{level}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: "#323232" 
  },
  container: { 
    flex: 1, 
    flexDirection: "row" 
  }, 
  sidebar: {
    width: 60,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 20 : 10
  },
  date: { 
    color: "#FEFBF6", 
    fontSize: 12, 
    marginBottom: 4 
  },
  streak: { 
    color: "#FEFBF6", 
    fontSize: 12, 
    marginBottom: 16 
  },
  iconBtn: {
    backgroundColor: "#C678DD",
    width: 40,
    height: 40,
    borderRadius: 8,
    marginVertical: 12,
    justifyContent: "center",
    alignItems: "center"
  },
  activeBtn: { 
    backgroundColor: "#7AE2CF" 
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 16
  },
  welcomeHeader: {
    color: "#FEFBF6",
    fontSize: 24,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 16
  },
  sectionsRow: {
    flex: 1,
    flexDirection: "row"
  },

  progressSection: {
    flex: 2,
    backgroundColor: "#7AE2CF",
    borderRadius: 12,
    padding: 16,
    marginRight: 8
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#323232",
    marginBottom: 8
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12
  },
  progressLabel: {
    width: 90,
    color: "#323232",
    fontSize: 14
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#323232",
    borderRadius: 4,
    overflow: "hidden",
    marginHorizontal: 8
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FEFBF6"
  },
  progressText: {
    width: 50,
    color: "#323232",
    fontSize: 12,
    textAlign: "right"
  },
  detailsBtn: {
    backgroundColor: "#323232",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10
  },
  detailsBtnText: {
    color: "#FEFBF6",
    fontSize: 14,
    fontWeight: "600"
  },

  difficultySection: {
    flex: 3,
    backgroundColor: "#C678DD",
    borderRadius: 12,
    padding: 16,
    marginLeft: 8
  },
  difficultyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between"
  },
  difficultyCard: {
    width: "48%",
    aspectRatio: 1.6,
    backgroundColor: "#FEFBF6",
    borderRadius: 8,
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center"
  },
  difficultyText: {
    color: "#323232",
    fontSize: 16,
    fontWeight: "600"
  }
});
