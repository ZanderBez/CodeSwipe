import React, { useEffect, useState } from "react"
import { View, ActivityIndicator, StyleSheet, Platform, Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import useEligibility from "../hooks/useEligibility"
import LockedGate from "../components/LockedGate"
import Sidebar from "../components/Sidebar"
import { auth, db } from "../firebase"
import { doc, getDoc } from "firebase/firestore"

export default function LearningHubScreen({ navigation }: any) {
  const { eligible, count, required, loading } = useEligibility()
  const [name, setName] = useState<string>("")
  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    if (!auth.currentUser) return
    getDoc(doc(db, "users", auth.currentUser.uid)).then(snap => {
      const data = snap.data() as any
      setName((data && data.name) || "")
    })
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

useEffect(() => {
  if (!loading && !showLoader) {
    if (eligible) {
      navigation.replace("ChooseDeck")
    }
  }
}, [loading, showLoader, navigation])

  return (
    <SafeAreaView style={styles.safeArea} edges={["left","right","top","bottom"]}>
      <View style={styles.root}>
        <Sidebar name={name} navigation={navigation} active="Create" />
        <View style={styles.content}>
          {loading || showLoader ? (
            <View style={styles.loaderCard}>
              <ActivityIndicator size="large" color="#7AE2CF" />
              <Text style={styles.loaderText}>Checking progress…</Text>
            </View>
          ) : !eligible ? (
            <>
              <Text style={styles.lockTitle}>Create Cards</Text>
              <LockedGate count={count} required={required} />
            </>
          ) : (
            <View style={styles.loaderCard}>
              <ActivityIndicator size="large" color="#7AE2CF" />
            </View>
          )}
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
  },
  root: {
    flex: 1,
    flexDirection: "row"
  },
  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 8,
    justifyContent: "center"
  },
  lockTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    textAlign: "center",
    marginBottom: 12,
    includeFontPadding: false,
    fontFamily: "Orbitron_700Bold"
  },
  loaderCard: {
    borderRadius: 18,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: "90%"
  },
  loaderText: {
    color: "#96A0A0",
    marginTop: 10,
    fontSize: 14,
    includeFontPadding: false,
    fontFamily: "Montserrat_400Regular"
  }
})
