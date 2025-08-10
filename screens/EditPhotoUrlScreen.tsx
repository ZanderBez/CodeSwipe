import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Alert } from "react-native";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

export default function EditPhotoUrlScreen({ navigation }: any) {
  const [url, setUrl] = useState("");

  const onSave = async () => {
    const cleaned = (url || "").trim();
    if (!cleaned || !/^https?:\/\/.+/i.test(cleaned)) {
      Alert.alert("Invalid URL", "Please paste a full https:// image URL");
      return;
    }
    const u = auth.currentUser;
    if (!u) {
      Alert.alert("Not signed in");
      return;
    }
    try {
      await updateProfile(u, { photoURL: cleaned });
      await setDoc(doc(db, "users", u.uid), { photoURL: cleaned }, { merge: true });
      navigation.goBack();
    } catch (e: any) {
      Alert.alert("Error", e.message || "Could not update photo");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.wrap}>
        <Text style={styles.title}>Paste Image URL</Text>
        <TextInput
          style={styles.input}
          placeholder="https://example.com/photo.jpg"
          placeholderTextColor="#7B8B8B"
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <View style={styles.actions}>
          <TouchableOpacity style={styles.cancel} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.save} onPress={onSave}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
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
  wrap: {
    flex: 1,
    paddingHorizontal: 28,
    paddingVertical: 20,
    justifyContent: "center"
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 14
  },
  input: {
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
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10
  },
  cancel: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#1A1A1A"
  },
  cancelText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600"
  },
  save: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#7AE2CF"
  },
  saveText: {
    color: "#0B0B0B",
    fontSize: 14,
    fontWeight: "800"
  }
});