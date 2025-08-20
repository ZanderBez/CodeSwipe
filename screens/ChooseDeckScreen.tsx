import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Sidebar from "../components/Sidebar"
import { auth, db } from "../firebase"
import { doc, getDoc } from "firebase/firestore"

type DeckId = "beginner" | "intermediate" | "advanced" | "nolifers"

const CARDS = [
  { id: "beginner" as DeckId, title: "Beginner", image: require("../assets/card1.png") },
  { id: "intermediate" as DeckId, title: "Intermediate", image: require("../assets/card2.png") },
  { id: "advanced" as DeckId, title: "Advanced", image: require("../assets/card3.png") },
  { id: "nolifers" as DeckId, title: "Hackathon Hero", image: require("../assets/card4.png") }
]

export default function ChooseDeckScreen({ navigation }: any) {
  const [name, setName] = useState<string>("")

  useEffect(() => {
    if (!auth.currentUser) return
    getDoc(doc(db, "users", auth.currentUser.uid)).then(snap => {
      const data = snap.data() as any
      setName((data && data.name) || "")
    })
  }, [])

  return (
    <SafeAreaView style={styles.safeArea} edges={["left","right","top","bottom"]}>
      <View style={styles.root}>
        <Sidebar name={name} navigation={navigation} active="Create" />
        <View style={styles.content}>
          <Text style={styles.title}>Choose a Deck to Create a Card</Text>
          <View style={styles.grid}>
            {CARDS.map(c => (
              <TouchableOpacity
                key={c.id}
                style={styles.gridItem}
                activeOpacity={0.9}
                onPress={() => navigation.navigate("CreateCard", { deckId: c.id, deckTitle: c.title })}
              >
                <Image source={c.image} style={styles.image} resizeMode="contain" />
                <View style={styles.pill}>
                  <Text style={styles.pillText}>{c.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}




const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
    paddingLeft: Platform.OS === "android" ? 10 : 0,
    paddingRight: Platform.OS === "android" ? 10 : 0,
    paddingBottom: Platform.OS === "android" ? 12 : 10
  },
  root: {
    flex: 1,
    flexDirection: "row"
  },
  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 8
  },
  title: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 12
  },
  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12
  },
  gridItem: {
    width: "47%",
    height: Platform.OS === "android" ? 138 : 150,
    backgroundColor: "#ffffffff",
    borderRadius: 20,
    padding: Platform.OS === "android" ? 8 : 10,
    borderWidth: 1,
    borderColor: "#7AE2CF",
    overflow: "hidden",
    justifyContent: "space-between"
  },
  image: {
    width: "100%",
    height: Platform.OS === "android" ? "70%" : "75%",
    borderRadius: 14
  },
  pill: {
    width: "100%",
    height:  Platform.OS === "android" ? 24 : 28,
    borderRadius: 14,
    backgroundColor: "#7AE2CF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8
  },
  pillText: {
    color: "#ffffffff",
    fontWeight: "800",
    fontSize: Platform.OS === "android" ? 12 : 14
  }
})