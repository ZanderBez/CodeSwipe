import { useCallback, useRef } from "react";
import { StyleSheet, View} from "react-native";
import { Video, ResizeMode, AVPlaybackStatusSuccess } from "expo-av";
import * as Splash from "expo-splash-screen";
import { useNavigation } from "@react-navigation/native"

export default function SplashScreen() {
  const navigation = useNavigation<any>();
  const videoRef = useRef<Video>(null);

  const goNext = useCallback(async () => {
    try { await Splash.hideAsync(); } catch {}
    navigation.reset({
      index: 0,
      routes: [{ name: "SignUp"}],
    });
  }, [navigation]);

  const onStatusUpdate = useCallback((status: AVPlaybackStatusSuccess | any) => {
    if (status?.isLoaded && status.didJustFinish) goNext();
  }, [goNext]);

    return (
      <View style={styles.container}>
        <Video
          ref={videoRef}
          source={require("../assets/intro.mp4")}
          style={styles.video}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
          isLooping={false}
          onReadyForDisplay={() => Splash.hideAsync().catch(() => {})}
          onPlaybackStatusUpdate={onStatusUpdate}
        />
      </View>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  video: { flex: 1, width: "100%", height: "100%" },
});
