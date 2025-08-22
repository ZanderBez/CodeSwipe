import React, { useMemo, useRef, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Platform, useWindowDimensions, NativeScrollEvent, NativeSyntheticEvent, LayoutChangeEvent } from "react-native"

type Page = { key: string; title: string; subtitle: string }

const PAGES: Page[] = [
  { key: "p1", title: "Welcome to CodeSwipe", subtitle: "Swipe through coding flashcards and track your progress" },
  { key: "p2", title: "Swipe To Learn", subtitle: "Choose a deck and answer cards to improve" },
  { key: "p3", title: "Create Cards", subtitle: "Get 20 correct to unlock creating your own cards" }
]

type Props = { onDone: () => void }

export default function OnboardingOverlay({ onDone }: Props) {
  const [index, setIndex] = useState(0)
  const [containerW, setContainerW] = useState<number | null>(null)
  const ref = useRef<FlatList<Page>>(null)

  const { width: w, height: h } = useWindowDimensions()
  const fallbackW = Math.max(w, h)
  const pageWidth = containerW ?? fallbackW

  const isLast = useMemo(() => index >= PAGES.length - 1, [index])

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / pageWidth)
    if (i !== index) setIndex(i)
  }

  const onLayout = (e: LayoutChangeEvent) => {
    const mw = Math.round(e.nativeEvent.layout.width)
    if (mw && mw !== containerW) setContainerW(mw)
  }

  return (
    <View style={styles.overlay} onLayout={onLayout}>
      <View style={styles.centerBox}>
        <FlatList
          ref={ref}
          data={PAGES}
          keyExtractor={(it) => it.key}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          bounces={false}
          snapToInterval={pageWidth}
          decelerationRate="fast"
          style={{ width: pageWidth }}
          renderItem={({ item }) => (
            <View style={[styles.page, { width: pageWidth }]}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
          )}
        />

        <View style={styles.bottomWrap}>
          <View style={styles.dotsRow}>
            {PAGES.map((_, i) => (
              <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
            ))}
          </View>

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.skipBtn} onPress={onDone}>
              <Text style={styles.skipTxt}>Close</Text>
            </TouchableOpacity>
            {!isLast ? (
              <TouchableOpacity
                style={styles.ctaBtn}
                onPress={() => {
                  const next = Math.min(index + 1, PAGES.length - 1)
                  ref.current?.scrollToIndex({ index: next, animated: true })
                  setIndex(next)
                }}
              >
                <Text style={styles.ctaTxt}>Next</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.ctaBtn} onPress={onDone}>
                <Text style={styles.ctaTxt}>Got it</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.92)",
    zIndex: 999,
    alignItems: "center",
    justifyContent: "center"
  },
  centerBox: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  page: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    textAlign: "center",
    marginBottom: 10,
    includeFontPadding: false,
    fontFamily: "Orbitron_700Bold"
  },
  subtitle: {
    color: "#96A0A0",
    fontSize: 16,
    textAlign: "center",
    includeFontPadding: false,
    fontFamily: "Montserrat_400Regular"
  },
  bottomWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: Platform.OS === "android" ? 16 : 24
  },
  dotsRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#1F2937"
  },
  dotActive: {
    backgroundColor: "#7AE2CF",
    width: 22,
    borderRadius: 4
  },
  btnRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20
  },
  skipBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#7AE2CF",
    borderRadius: 12,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0E0E0E"
  },
  skipTxt: {
    color: "#7AE2CF",
    fontSize: 16,
    includeFontPadding: false,
    fontFamily: "Orbitron_700Bold"
  },
  ctaBtn: {
    flex: 1,
    backgroundColor: "#7AE2CF",
    borderRadius: 12,
    height: 46,
    alignItems: "center",
    justifyContent: "center"
  },
  ctaTxt: {
    color: "#ffffffff",
    fontSize: 16,
    includeFontPadding: false,
    fontFamily: "Orbitron_700Bold"
  }
})
