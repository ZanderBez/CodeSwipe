import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, BackHandler, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-deck-swiper";
import { Ionicons } from "@expo/vector-icons";
import { fetchDeckCards } from "../services/flashcardService";
import { CardDoc, DeckId } from "../types/flashcards";
import { THEMES } from "../services/themes";

type Mode = "intro" | "quiz" | "score";
type Phase = "preview" | "answers";

const validIds: DeckId[] = ["beginner", "intermediate", "advanced", "nolifers"];
const PREVIEW_SECS = 10;
const ANSWER_SECS = 15;
const FADE_MS = 160;

function normalizeDeckId(input: any): DeckId {
  if (typeof input !== "string") return "beginner";
  const id = input.toLowerCase().replace(/\s+/g, "");
  if (validIds.includes(id as DeckId)) return id as DeckId;
  return "beginner";
}

export default function FlashcardsScreen({ route, navigation }: any) {
  const p = route?.params ?? {};
  const deckId: DeckId = normalizeDeckId(p.deckId);
  const theme = THEMES[deckId];

  const [cards, setCards] = useState<CardDoc[]>([]);
  const [mode, setMode] = useState<Mode>("intro");
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("preview");
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [timeLeft, setTimeLeft] = useState(PREVIEW_SECS);

  const swiperRef = useRef<Swiper<CardDoc | undefined>>(null);
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fetchDeckCards(deckId).then(setCards);
  }, [deckId]);

  useEffect(() => {
    if (mode !== "quiz") return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (phase === "preview") return Math.max(0, t - 1);
        if (phase === "answers" && picked === null) return Math.max(0, t - 1);
        return t;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [mode, phase, picked]);

  useEffect(() => {
    if (mode !== "quiz") return;
    if (phase === "preview" && timeLeft <= 0) {
      swiperRef.current?.swipeLeft();
    }
    if (phase === "answers" && timeLeft <= 0 && picked === null) {
      proceedAfterPick();
    }
  }, [timeLeft, phase, mode, picked]);

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: mode !== "quiz",
      fullScreenGestureEnabled: mode !== "quiz"
    });
    let sub: any;
    if (mode === "quiz") sub = BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => { if (sub) sub.remove(); };
  }, [mode, navigation]);

  const startNow = () => {
    setIdx(0);
    setCorrect(0);
    setPicked(null);
    setPhase("preview");
    setTimeLeft(PREVIEW_SECS);
    fade.setValue(1);
    setMode("quiz");
  };

  const proceedAfterPick = () => {
    const last = idx + 1 >= cards.length;
    if (last) {
      setMode("score");
      return;
    }
    setIdx((i) => i + 1);
    setPhase("preview");
    setPicked(null);
    fade.setValue(1);
    setTimeLeft(PREVIEW_SECS);
  };

  const finishQuestion = (choice: number | null) => {
    const card = cards[idx];
    const ok = choice !== null && card && choice === card.correctIndex;
    if (ok) setCorrect((c) => c + 1);
    setPicked(choice as number | null);
  };

  const revealAnswers = () => {
    setPhase("answers");
    setTimeLeft(ANSWER_SECS);
    fade.setValue(0);
    Animated.timing(fade, { toValue: 1, duration: FADE_MS, useNativeDriver: true }).start();
  };

  const progressText = useMemo(() => `${Math.min(idx + 1, cards.length)} / ${cards.length || 10}`, [idx, cards.length]);
  const current = cards[idx];

  const onEyePress = () => {
    if (phase === "preview") revealAnswers();
    else if (picked !== null) proceedAfterPick();
  };

  return (
    <SafeAreaView edges={mode === "intro" ? ["top", "bottom", "left", "right"] : ["top", "bottom"]} style={styles.safeArea}>
      <View style={styles.root}>
        {mode === "intro" && (
          <View style={styles.introRow}>
            <View style={styles.introLeft}>
              <Text style={styles.introTitle}>{theme.title}</Text>
              <View style={[styles.introUnderline, { backgroundColor: theme.accent }]} />
              <Text style={styles.introBlurb}>{theme.blurb}</Text>
              <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.smallBack, { backgroundColor: theme.accent }]}>
                <Text style={styles.smallBackIcon}>←</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.introRight}>
              <View style={styles.imageCard}>
                <Image source={theme.image} style={styles.image} resizeMode="cover" />
              </View>
              <TouchableOpacity onPress={startNow} style={[styles.startBtn, { backgroundColor: theme.accent }]}>
                <Text style={styles.startBtnText}>Start Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {mode === "quiz" && (
          <>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.headerBack, { borderColor: theme.accent }]}>
                <Text style={[styles.headerBackIcon, { color: theme.accent }]}>←</Text>
              </TouchableOpacity>
              <View style={styles.headerCenter}>
                <Text style={styles.topTitle}>{theme.title}</Text>
                <Text style={styles.topProgress}>{progressText}</Text>
              </View>
              <View style={{ width: 40 }} />
            </View>

            <View style={styles.timerTrack}>
              <View
                style={[
                  styles.timerFill,
                  {
                    backgroundColor: theme.danger,
                    width:
                      phase === "preview"
                        ? `${Math.max(0, (timeLeft / PREVIEW_SECS) * 100)}%`
                        : picked === null
                        ? `${Math.max(0, (timeLeft / ANSWER_SECS) * 100)}%`
                        : "0%"
                  }
                ]}
              />
              <Text style={styles.timerText}>
                {phase === "preview" ? `${Math.max(0, timeLeft)}s` : picked === null ? `${Math.max(0, timeLeft)}s` : " "}
              </Text>
            </View>

            <View style={styles.deckWrap}>
              <View pointerEvents="box-none" style={styles.sideZone}>
                <TouchableOpacity onPress={proceedAfterPick} activeOpacity={0.9} style={styles.sideBtnLeft}>
                  <Ionicons name="close" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onEyePress} activeOpacity={0.9} style={[styles.sideBtnRight, { backgroundColor: theme.accent }]}>
                  <Ionicons name="eye" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {phase === "preview" ? (
                <Swiper
                  ref={swiperRef}
                  cards={cards}
                  cardIndex={idx}
                  backgroundColor="transparent"
                  stackSize={4}
                  stackScale={14}
                  stackSeparation={16}
                  cardVerticalMargin={10}
                  disableTopSwipe
                  disableBottomSwipe
                  onSwipedLeft={proceedAfterPick}
                  onSwipedRight={revealAnswers}
                  onSwipedAll={() => {}}
                  containerStyle={styles.swiperContainer}
                  cardStyle={styles.swiperCardStyle}
                  renderCard={(card: CardDoc | undefined) =>
                    card ? (
                      <View style={styles.card}>
                        <View style={styles.previewCenter}>
                          <Text style={styles.q}>{card.question}</Text>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.fallback}>
                        <Text style={styles.loading}>Loading…</Text>
                      </View>
                    )
                  }
                  animateOverlayLabelsOpacity
                  useViewOverflow={Platform.OS === "ios"}
                />
              ) : (
                <Animated.View style={[styles.card, { opacity: fade }]}>
                  {current ? (
                    <View>
                      <Text style={[styles.q, { marginBottom: 12 }]}>{current.question}</Text>
                      {current.options.map((opt, i) => {
                        const show = picked !== null;
                        const isOk = i === current.correctIndex;
                        const wasPicked = picked === i;
                        const bg =
                          show && isOk ? { backgroundColor: theme.accent } :
                          show && wasPicked && !isOk ? { backgroundColor: theme.danger } :
                          styles.optNeutral;
                        return (
                          <TouchableOpacity
                            key={i}
                            disabled={picked !== null || timeLeft <= 0}
                            onPress={() => { if (picked === null && timeLeft > 0) finishQuestion(i); }}
                            style={[styles.opt, bg]}
                            activeOpacity={0.9}
                          >
                            <Text style={styles.optText}>{String.fromCharCode(97 + i)}) {opt}</Text>
                          </TouchableOpacity>
                        );
                      })}
                      {picked !== null && current.explanation ? (
                        <View style={styles.explain}>
                          <Text style={styles.explainText}>{current.explanation}</Text>
                        </View>
                      ) : null}
                      {picked !== null && (
                        <TouchableOpacity style={[styles.nextBtn, { backgroundColor: theme.accent }]} onPress={proceedAfterPick}>
                          <Text style={styles.nextBtnText}>Next</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ) : (
                    <View style={styles.fallback}>
                      <Text style={styles.loading}>Loading…</Text>
                    </View>
                  )}
                </Animated.View>
              )}
            </View>
          </>
        )}

        {mode === "score" && (
          <View style={styles.scoreWrap}>
            <Text style={styles.scoreTitle}>{theme.title}</Text>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>Your Score</Text>
              <View style={styles.scoreTrack}>
                <View style={[styles.scoreFill, { width: `${Math.round((correct / Math.max(cards.length, 1)) * 100)}%` }]} />
              </View>
              <Text style={styles.scoreText}>{correct}/{cards.length}</Text>
              <TouchableOpacity style={[styles.homeBtn, { backgroundColor: theme.accent }]} onPress={() => navigation.replace("Home")}>
                <Text style={styles.homeBtnText}>Home</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
    paddingHorizontal: 24,
    paddingVertical: 16
  },
  introRow: {
    flex: 1,
    flexDirection: "row",
    gap: 24,
    alignItems: "center"
  },
  introLeft: {
    flex: 1
  },
  introTitle: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: 1
  },
  introUnderline: {
    width: 140,
    height: 4,
    borderRadius: 2,
    marginTop: 14,
    marginBottom: 18
  },
  introBlurb: {
    color: "#FFFFFF",
    opacity: 0.9,
    fontSize: 16,
    lineHeight: 24
  },
  smallBack: {
    marginTop: 18,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  smallBackIcon: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "800"
  },
  introRight: {
    flex: 1,
    alignItems: "center"
  },
  imageCard: {
    width: "82%",
    aspectRatio: 1.4,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 10,
    marginBottom: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 14
  },
  startBtn: {
    width: "82%",
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 28,
    alignItems: "center",
    justifyContent: "center"
  },
  startBtnText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6
  },
  headerBack: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center"
  },
  headerBackIcon: {
    fontSize: 16,
    fontWeight: "800"
  },
  headerCenter: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  topTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 1
  },
  topProgress: {
    color: "#7AE2CF",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 2
  },
  timerTrack: {
    height: 14,
    backgroundColor: "#1B1B1B",
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 12,
    position: "relative"
  },
  timerFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0
  },
  timerText: {
    position: "absolute",
    right: 8,
    top: -1,
    color: "#FFFFFF",
    fontWeight: "700"
  },
  deckWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%"
  },
  sideZone: {
    position: "absolute",
    width: "100%",
    zIndex: 10,
    top: "50%",
    transform: [{ translateY: -28 }],
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 14
  },
  sideBtnLeft: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#FD5308",
    alignItems: "center",
    justifyContent: "center"
  },
  sideBtnRight: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center"
  },
  swiperContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 4
  },
  swiperCardStyle: {
    alignSelf: "center"
  },
  card: {
    width: "68%",
    minHeight: Platform.OS === "ios" ? 220 : 210,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    alignSelf: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8
  },
  previewCenter: {
    flex: 1,
    minHeight: 180,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8
  },
  q: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "800"
  },
  opt: {
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    paddingHorizontal: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#E6E6E6"
  },
  optNeutral: {
    backgroundColor: "#FFFFFF"
  },
  optText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "600"
  },
  explain: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#F4F7F7"
  },
  explainText: {
    color: "#333333",
    fontSize: 13
  },
  nextBtn: {
    marginTop: 14,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  nextBtnText: {
    color: "#FFFFFF",
    fontWeight: "800"
  },
  fallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  loading: {
    color: "#FFFFFF"
  },
  scoreWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  scoreTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 12
  },
  scoreCard: {
    width: "70%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8
  },
  scoreTrack: {
    width: "90%",
    height: 18,
    borderRadius: 9,
    backgroundColor: "#EEEEEE",
    overflow: "hidden",
    marginBottom: 8
  },
  scoreFill: {
    height: "100%",
    backgroundColor: "#FD5308"
  },
  scoreText: {
    fontWeight: "800",
    marginBottom: 12
  },
  homeBtn: {
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7AE2CF"
  },
  homeBtnText: {
    color: "#FFFFFF",
    fontWeight: "800"
  }
});
