// import React, { useState, useEffect, useRef } from "react";
// import { Platform, ViewStyle, Alert, Animated, PanResponder } from "react-native";
// import * as WebBrowser from "expo-web-browser";
// import * as Google from "expo-auth-session/providers/google";
// import { finishGoogleSignIn, signInWithGoogleWeb } from "../services/authService";

// WebBrowser.maybeCompleteAuthSession();

// type Props = {
//   onSuccess: () => void;
//   style?: ViewStyle;
//   children?: React.ReactNode;
// };

// const IOS_CLIENT_ID =
//   "152169237437-jdcoc54ppqj2lu3a57b3pggk3j92tqhi.apps.googleusercontent.com";
// const ANDROID_CLIENT_ID =
//   "152169237437-bss0sntoknooka4mkvvgo6n0mphli240.apps.googleusercontent.com";
// const WEB_CLIENT_ID =
//   "152169237437-1acsktk5s7pb0gl7g937pvj0r0u1uqfj.apps.googleusercontent.com";

// export default function GoogleSwipeAuth({ onSuccess, style, children }: Props) {
//   const [loading, setLoading] = useState(false);

//   const [request, response, promptAsync] = Google.useAuthRequest(
//     {
//       expoClientId: WEB_CLIENT_ID,
//       iosClientId: IOS_CLIENT_ID,
//       androidClientId: ANDROID_CLIENT_ID,
//       webClientId: WEB_CLIENT_ID,
//     } as any
//   );

//   useEffect(() => {
//     console.log("[GoogleSwipeAuth] request created:", !!request);
//   }, [request]);

//   const triggerLogin = async () => {
//     if (loading) return;
//     setLoading(true);

//     try {
//       console.log("[GoogleSwipeAuth] triggerLogin, platform:", Platform.OS);

//       if (Platform.OS === "web") {
//         await signInWithGoogleWeb();
//         onSuccess();
//         setLoading(false);
//         return;
//       }

//       if (!request) {
//         console.log("[GoogleSwipeAuth] Google auth request not ready");
//         Alert.alert(
//           "Google Sign-in",
//           "Google sign-in is still preparing. Please try again in a moment."
//         );
//         setLoading(false);
//         return;
//       }

//       const res = await promptAsync();
//       console.log("[GoogleSwipeAuth] promptAsync result:", res);

//       if (res.type !== "success") {
//         setLoading(false);
//       }
//     } catch (e: any) {
//       console.error("[GoogleSwipeAuth] Error during triggerLogin:", e);
//       Alert.alert("Google Sign-in Failed", e?.message ?? String(e));
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (Platform.OS === "web") return;

//     console.log("[GoogleSwipeAuth] response changed:", response);

//     if (!response || response.type !== "success") return;

//     const idToken = response.authentication?.idToken;
//     if (!idToken) {
//       console.log("[GoogleSwipeAuth] No idToken on response");
//       setLoading(false);
//       return;
//     }

//     finishGoogleSignIn(idToken)
//       .then(() => {
//         onSuccess();
//       })
//       .catch((err) => {
//         console.error("[GoogleSwipeAuth] finishGoogleSignIn error:", err);
//         Alert.alert("Google Sign-in Failed", err?.message ?? String(err));
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, [response]);

//   const dragX = useRef(new Animated.Value(0)).current;
//   const THRESH = 30;

//   const panResponder = PanResponder.create({
//     onStartShouldSetPanResponder: () => true,
//     onMoveShouldSetPanResponder: (_, gestureState) =>
//       Math.abs(gestureState.dx) > 5,
//     onPanResponderMove: (_, gestureState) => {
//       dragX.setValue(Math.max(0, Math.min(gestureState.dx, 160)));
//     },
//     onPanResponderRelease: (_, gestureState) => {
//       const finalX = Math.max(0, Math.min(gestureState.dx, 160));
//       const hit = finalX >= THRESH;
//       Animated.spring(dragX, { toValue: 0, useNativeDriver: true }).start();
//       if (hit) {
//         triggerLogin();
//       }
//     },
//   });

//   return (
//     <Animated.View
//       style={[style, { transform: [{ translateX: dragX }] }]}
//       {...panResponder.panHandlers}
//     >
//       {children}
//     </Animated.View>
//   );
// }
