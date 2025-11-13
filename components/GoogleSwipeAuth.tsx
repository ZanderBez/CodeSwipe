import React, { useState, useRef } from "react";
import { Platform, ViewStyle, Alert, Animated, PanResponder } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { finishGoogleSignIn, signInWithGoogleWeb } from "../services/authService";

WebBrowser.maybeCompleteAuthSession();

type Props = {
  onSuccess: () => void;
  style?: ViewStyle;
  children?: React.ReactNode;
};

export default function GoogleSwipeAuth({ onSuccess, style, children }: Props) {
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: "152169237437-jdcoc54ppqj2lu3a57b3pggk3j92tqhi.apps.googleusercontent.com",
    androidClientId: "152169237437-bss0sntoknooka4mkvvgo6n0mphli240.apps.googleusercontent.com",
    webClientId: "152169237437-jp9qlsbrrftotsaq50re6b0kli7pjeq9.apps.googleusercontent.com",
  });

  const triggerLogin = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (Platform.OS === "web") {
        await signInWithGoogleWeb();
        onSuccess();
      } else {
        if (!request) {
          setLoading(false);
          return;
        }
        const res = await promptAsync();
        if (res.type !== "success") setLoading(false);
      }
    } catch (e: any) {
      Alert.alert("Google Sign-in Failed", e?.message ?? String(e));
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (Platform.OS === "web") return;
    if (response?.type !== "success") return;
    const idToken = response.authentication?.idToken;
    if (!idToken) {
      setLoading(false);
      return;
    }
    finishGoogleSignIn(idToken).then(onSuccess).catch(() => setLoading(false));
  }, [response]);

  const dragX = useRef(new Animated.Value(0)).current;
  const THRESH = 30;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 5,
      onPanResponderMove: (_, gestureState) => {
        dragX.setValue(Math.max(0, Math.min(gestureState.dx, 160)));
      },
      onPanResponderRelease: (_, gestureState) => {
        const finalX = Math.max(0, Math.min(gestureState.dx, 160));
        const hit = finalX >= THRESH;
        Animated.spring(dragX, { toValue: 0, useNativeDriver: true }).start();
        if (hit) triggerLogin();
      },
    })
  ).current;

  return (
    <Animated.View
      style={[style, { transform: [{ translateX: dragX }] }]}
      {...panResponder.panHandlers}
    >
      {children}
    </Animated.View>
  );
}
