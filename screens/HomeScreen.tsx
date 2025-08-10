import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Sidebar from "../components/Sidebar";
import { logoutUser } from "../services/authService";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function HomeScreen({ navigation }: any) {
  const [name, setName] = useState<string>("");

  useEffect(() => {
    if (auth.currentUser) {
      getDoc(doc(db, "users", auth.currentUser.uid)).then((snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setName(data.name || "");
        }
      });
    }
  }, []);

  const progressData = [
    { label: "Beginner", value: 2, max: 12 },
    { label: "Intermediate", value: 5, max: 12 },
    { label: "Advanced", value: 1, max: 12 },
    { label: "No Lifers", value: 8, max: 12 }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.root}>
        <Sidebar name={name} navigation={navigation} />

        <View style={styles.content}>
          <View style={styles.cardsRow}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Code Points</Text>

              {progressData.map((row) => {
                const pct = Math.min((row.value / row.max) * 100, 100);
                return (
                  <View key={row.label} style={styles.progressBlock}>
                    <View style={styles.progressHead}>
                      <Text style={styles.progressLabel}>{row.label}</Text>
                      <Text style={styles.progressCount}>{row.value}/{row.max}</Text>
                    </View>

                    <View style={styles.track}>
                      <View style={[styles.fillTeal, { width: `${pct}%` }]} />
                    </View>
                  </View>
                );
              })}

              <TouchableOpacity style={styles.pillBtn} onPress={() => navigation.navigate("Summary")}>
                <Text style={styles.pillBtnText}>Details</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>How Brave are you?</Text>

              <View style={styles.grid}>
                <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate("Flashcards", { difficulty: "Beginner" })}>
                  <Image source={require("../assets/card1.png")} style={styles.illustrationImg} resizeMode="cover" />
                  <View style={styles.levelPill}><Text style={styles.levelPillText}>Beginner</Text></View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate("Flashcards", { difficulty: "Intermediate" })}>
                  <Image source={require("../assets/card2.png")} style={styles.illustrationImg} resizeMode="cover" />
                  <View style={styles.levelPill}><Text style={styles.levelPillText}>Intermediate</Text></View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate("Flashcards", { difficulty: "Advanced" })}>
                  <Image source={require("../assets/card3.png")} style={styles.illustrationImg} resizeMode="cover" />
                  <View style={styles.levelPill}><Text style={styles.levelPillText}>Advanced</Text></View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate("Flashcards", { difficulty: "No Lifers" })}>
                  <Image source={require("../assets/card4.png")} style={styles.illustrationImg} resizeMode="cover" />
                  <View style={styles.levelPill}><Text style={styles.levelPillText}>No Lifers</Text></View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000000"
  },
  root: {
    flex: 1,
    flexDirection: "row"
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16
  },
  cardsRow: {
    flex: 1,
    flexDirection: "row",
    gap: 20
  },
  card: {
    flex: 1,
    backgroundColor: "#0E0E0E",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#7AE2CF"
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 12,
    letterSpacing: 0.5
  },
  progressBlock: {
    marginBottom: 16
  },
  progressHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6
  },
  progressLabel: {
    color: "#FFFFFF",
    fontSize: 14
  },
  progressCount: {
    color: "#FFFFFF",
    fontSize: 12,
    opacity: 0.9
  },
  track: {
    height: 16,
    backgroundColor: "#0B0B0B",
    borderRadius: 999,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1F1F1F"
  },
  fillTeal: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#FD5308",
    borderTopRightRadius: 999,
    borderBottomRightRadius: 999
  },
  pillBtn: {
    marginTop: "auto",
    backgroundColor: "#7AE2CF",
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center"
  },
  pillBtnText: {
    color: "#ffffffff",
    fontWeight: "800"
  },
  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12
  },
  gridItem: {
    maxWidth: "48%",
    aspectRatio: 1,
    backgroundColor: "#ffffffff",
    borderRadius: 16,
    padding: 10,
    overflow: "hidden",
    justifyContent: "space-between"
  },
  illustrationImg: {
    width: "100%",
    flex: 1,
    borderRadius: 12
  },
  levelPill: {
    alignSelf: "center",
    height: 25,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "#7AE2CF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8
  },
  levelPillText: {
    color: "#ffffffff",
    fontWeight: "800",
    fontSize: 11
  }
});