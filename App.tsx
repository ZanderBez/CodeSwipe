import "react-native-gesture-handler"
import React, { useEffect, useState } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { onAuthStateChanged } from "firebase/auth"
import * as ScreenOrientation from "expo-screen-orientation"
import * as Splash from "expo-splash-screen"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import SignUpScreen from "./screens/SignUpScreen"
import HomeScreen from "./screens/HomeScreen"
import LoginScreen from "./screens/LoginScreen"
import { auth } from "./firebase"
import SplashScreen from "./screens/SplashScreen"
import ProfileScreen from "./screens/ProfileScreen"
import EditPhotoUrlScreen from "./screens/EditPhotoScreen"
import FlashcardsScreen from "./screens/FlashcardsScreen"
import PerformanceScreen from "./screens/PerformanceScreen"
import ChooseDeckScreen from "./screens/ChooseDeckScreen"
import CreateCardScreen from "./screens/CreateCardScreen"
import LearningHubScreen from "./screens/LearningHubScreen"
import ManageCardsScreen from "./screens/ManageCardsScreen"

const Stack = createNativeStackNavigator()
Splash.preventAutoHideAsync().catch(() => {})

export default function App() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return unsubscribe
  }, [])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="EditPhotoUrl" component={EditPhotoUrlScreen} />
          <Stack.Screen name="Flashcards" component={FlashcardsScreen} options={{ gestureEnabled: true, fullScreenGestureEnabled: true }} />
          <Stack.Screen name="Performance" component={PerformanceScreen} />
          <Stack.Screen name="ChooseDeck" component={ChooseDeckScreen} />
          <Stack.Screen name="CreateCard" component={CreateCardScreen} />
          <Stack.Screen name="LearningHub" component={LearningHubScreen} />
          <Stack.Screen name="ManageCards" component={ManageCardsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  )
}
