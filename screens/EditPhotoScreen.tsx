import React, { useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Platform } from "react-native"
import * as ImagePicker from "expo-image-picker"
import { auth, db, storage } from "../firebase"
import { doc, setDoc } from "firebase/firestore"
import { updateProfile } from "firebase/auth"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

export default function EditPhotoScreen({ navigation }: any) {
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== "granted") {
      Alert.alert("Permission required", "We need access to your photos to set your profile picture.")
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9
    })
    if (!result.canceled) {
      setImageUri(result.assets[0].uri)
    }
  }

  const onSave = async () => {
    if (!imageUri) {
      Alert.alert("No image selected", "Please choose an image first.")
      return
    }
    const u = auth.currentUser
    if (!u) {
      Alert.alert("Not signed in")
      return
    }
    try {
      setSaving(true)
      const response = await fetch(imageUri)
      const blob = await response.blob()
      const filename = `${Date.now()}.jpg`
      const objectRef = ref(storage, `profilePictures/${u.uid}/${filename}`)
      await uploadBytes(objectRef, blob)
      const url = await getDownloadURL(objectRef)
      await updateProfile(u, { photoURL: url })
      await setDoc(doc(db, "users", u.uid), { photoURL: url }, { merge: true })
      setSaving(false)
      navigation.goBack()
    } catch (e: any) {
      setSaving(false)
      Alert.alert("Error", e?.message || "Could not update photo")
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.wrap}>
        <Text style={styles.title}>Choose Profile Picture</Text>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.preview} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>No image selected</Text>
          </View>
        )}
        <TouchableOpacity style={styles.pickButton} onPress={pickImage}>
          <Text style={styles.pickButtonText}>Pick from Gallery</Text>
        </TouchableOpacity>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.cancel} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.save} onPress={onSave} disabled={saving}>
            {saving ? <ActivityIndicator color="#0B0B0B" /> : <Text style={styles.saveText}>Save</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
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
  preview: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignSelf: "center",
    marginBottom: 16
  },
  placeholder: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#1A1A1A",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16
  },
  placeholderText: {
    color: "#7B8B8B",
    fontSize: 14
  },
  pickButton: {
    backgroundColor: "#7AE2CF",
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 20
  },
  pickButtonText: {
    color: "#0B0B0B",
    fontWeight: "800",
    textAlign: "center"
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
})
