import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import * as ScreenOrientation from "expo-screen-orientation";
import * as Splash from "expo-splash-screen";
import SignUpScreen from "./screens/SignUpScreen";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import { auth } from "./firebase";
import SplashScreen from "./screens/SplashScreen";
import ProfileScreen from "./screens/ProfileScreen";
import EditPhotoUrlScreen from "./screens/EditPhotoUrlScreen";
import PerformanceScreen from "./screens/PerformanceScreen";

const Stack = createNativeStackNavigator();
Splash.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="EditPhotoUrl" component={EditPhotoUrlScreen} />
        <Stack.Screen name="Performance" component={PerformanceScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
