import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, Alert, Image } from "react-native";
import Sidebar from "../components/Sidebar";
import { auth, db } from "../firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { updateEmail, updatePassword, updateProfile } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const u = auth.currentUser;
    if (!u) return;
    setEmail(u.email || "");
    setDisplayName(u.displayName || "");
    const ref = doc(db, "users", u.uid);
    const unsubcribe = onSnapshot(ref, (snap) => {
      const d: any = snap.data() || {};
      if (typeof d.name === "string") setName(d.name);
      if (typeof d.photoURL === "string") setAvatarUrl(d.photoURL);
      if (!displayName && d.name) setDisplayName(d.name);
    });
    return unsubcribe;
  }, []);

  const handleSave = async () => {
    const u = auth.currentUser;
    if (!u) {
      Alert.alert("Not signed in");
      return;
    }
    try {
      if (email && email !== (u.email || "")) await updateEmail(u, email);
      if (password) await updatePassword(u, password);
      await updateProfile(u, { displayName, photoURL: avatarUrl || null });
      await setDoc(
        doc(db, "users", u.uid),
        { name: displayName || name || "", email, photoURL: avatarUrl || null },
        { merge: true }
      );
      Alert.alert("Saved", "Profile updated");
    } catch (e: any) {
      Alert.alert("Error", e.message || "Update failed");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.root}>
        <Sidebar name={displayName || name} navigation={navigation} active="Profile" />
        <View style={styles.content}>
          <Text style={styles.title}>Devfolio</Text>
          <View style={styles.row}>
            <View style={styles.leftPane}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#7B8B8B"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Nickname"
                placeholderTextColor="#7B8B8B"
                value={displayName}
                onChangeText={setDisplayName}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#7B8B8B"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.rightPane}>
              <View style={styles.avatarWrap}>
                <View style={styles.avatarOuter} />
                {avatarUrl ? (
                  <Image key={avatarUrl} source={{ uri: avatarUrl }} style={styles.avatarImage} onError={() => Alert.alert("Image error", "Could not load that URL")} />
                ) : (
                  <View style={styles.avatarInner} />
                )}
                <View style={styles.orangeArc} />
                <TouchableOpacity style={styles.camBtn} onPress={() => navigation.navigate("EditPhotoUrl")}>
                  <Ionicons name="camera" size={16} color="#000000" />
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
    paddingHorizontal: 28,
    paddingVertical: 20
  },
  title: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "800",
    marginBottom: 18,
    letterSpacing: 0.5
  },
  row: {
    flex: 1,
    flexDirection: "row",
    gap: 24,
    alignItems: "center"
  },
  leftPane: {
    flex: 2,
    paddingRight: 8
  },
  rightPane: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center"
  },
  input: {
    width: "70%",
    borderWidth: 2,
    borderColor: "#7AE2CF",
    color: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 14 : 12,
    fontSize: 16,
    backgroundColor: "#000000",
    marginBottom: 14
  },
  saveBtn: {
    width: "70%",
    backgroundColor: "#7AE2CF",
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6
  },
  saveText: {
    color: "#ffffffff",
    fontSize: 16,
    fontWeight: "800"
  },
  avatarWrap: {
    width: 320,
    height: 320,
    alignItems: "center",
    justifyContent: "center"
  },
  avatarOuter: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 6,
    borderColor: "#7AE2CF"
  },
  avatarInner: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "#FFFFFF"
  },
  avatarImage: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140
  },
  orangeArc: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 10,
    borderColor: "transparent",
    borderRightColor: "#FD5308",
    borderBottomColor: "#FD5308",
    transform: [{ rotate: "0deg" }]
  },
  camBtn: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4
  }
});