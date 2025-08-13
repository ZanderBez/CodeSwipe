import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, BackHandler } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-deck-swiper";
import { fetchDeckCards } from "../services/flashcardService";
import { CardDoc, DeckId } from "../types/flashcards";
import { THEMES } from "../services/themes";

type Mode = "intro" | "quiz" | "score";
type Phase = "preview" | "answers";

const validIds: DeckId[] = ["beginner", "intermediate", "advanced", "nolifers"];

function normalizeDeckId(input: any): DeckId {
  if (typeof input !== "string") return "beginner";
  const id = input.toLowerCase().replace(/\s+/g, "");
  if (validIds.includes(id as DeckId)) return id as DeckId;
  return "beginner";
}

const PREVIEW_SECS = 10;
const ANSWER_SECS = 15;

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
  const [revealTransition, setRevealTransition] = useState(false);

  const swiperRef = useRef<Swiper<CardDoc>>(null);

  useEffect(() => {
    fetchDeckCards(deckId).then(setCards);
  }, [deckId]);

  useEffect(() => {
    if (mode !== "quiz") return;
    setTimeLeft(phase === "preview" ? PREVIEW_SECS : ANSWER_SECS);
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [mode, phase, idx]);

  useEffect(() => {
    if (mode !== "quiz") return;
    if (timeLeft > 0) return;
    if (phase === "preview") {
      setPhase("answers");
      setTimeLeft(ANSWER_SECS);
      setRevealTransition(true);
      requestAnimationFrame(() => swiperRef.current?.swipeBack());
      setTimeout(() => setRevealTransition(false), 220);
    } else {
      finishQuestion(null);
    }
  }, [timeLeft, mode, phase]);

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
    setMode("quiz");
  };

  const finishQuestion = (choice: number | null) => {
    const card = cards[idx];
    const ok = choice !== null && card && choice === card.correctIndex;
    if (ok) setCorrect(c => c + 1);
    setTimeout(() => nextCard(), 1000);
  };

  const nextCard = () => {
    const last = idx + 1 >= cards.length;
    if (last) { setMode("score"); return; }
    setIdx(i => i + 1);
    setPhase("preview");
    setPicked(null);
  };

  const progressText = useMemo(() => `${Math.min(idx + 1, cards.length)} / ${cards.length || 10}`, [idx, cards.length]);

  const current = cards[idx];

  return (
    <SafeAreaView style={styles.safeArea}>
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
            <View style={styles.topBar}>
              <Text style={styles.topTitle}>{theme.title}</Text>
              <Text style={styles.topProgress}>{progressText}</Text>
            </View>

            <View style={styles.timerTrack}>
              <View style={[styles.timerFill, { width: `${(timeLeft / (phase === "preview" ? PREVIEW_SECS : ANSWER_SECS)) * 100}%` }]} />
              <Text style={styles.timerText}>{timeLeft}s</Text>
            </View>

            <View style={styles.deckWrap}>
              <View style={styles.sideIndicatorLeft}>
                <Text style={styles.sideIcon}>✖</Text>
                <Text style={styles.sideHint}>Swipe left</Text>
              </View>
              <View style={styles.sideIndicatorRight}>
                <Text style={styles.sideIcon}>👁</Text>
                <Text style={styles.sideHint}>Swipe right</Text>
              </View>

              <Swiper
                ref={swiperRef}
                cards={cards}
                cardIndex={idx}
                containerStyle={styles.swiperContainer}
                renderCard={() =>
                  current ? (
                    <View style={styles.card}>
                      {phase === "preview" ? (
                        <View style={styles.previewCenter}>
                          <Text style={styles.q}>{current.question}</Text>
                        </View>
                      ) : (
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
                                disabled={picked !== null || revealTransition}
                                onPress={() => { setPicked(i); finishQuestion(i); }}
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
                        </View>
                      )}
                    </View>
                  ) : (
                    <View style={styles.fallback}><Text style={styles.loading}>Loading…</Text></View>
                  )
                }
                backgroundColor="transparent"
                stackSize={4}
                stackScale={14}
                stackSeparation={16}
                cardVerticalMargin={10}
                disableTopSwipe
                disableBottomSwipe
                onSwipedLeft={() => {
                  if (phase === "preview") finishQuestion(null);
                  else finishQuestion(null);
                }}
                onSwipedRight={() => {
                  if (phase === "preview") {
                    setPhase("answers");
                    setTimeLeft(ANSWER_SECS);
                    setRevealTransition(true);
                    requestAnimationFrame(() => swiperRef.current?.swipeBack());
                    setTimeout(() => setRevealTransition(false), 220);
                  } else {
                    finishQuestion(null);
                  }
                }}
                onSwipedAll={() => setMode("score")}
                animateOverlayLabelsOpacity
                useViewOverflow={Platform.OS === "ios"}
              />
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
    shadowColor: "#000",
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
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8
  },
  topTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800"
  },
  topProgress: {
    color: "#7AE2CF",
    fontSize: 16,
    fontWeight: "700"
  },
  timerTrack: {
    height: 12,
    backgroundColor: "#1B1B1B",
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 10,
    position: "relative"
  },
  timerFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#FD5308"
  },
  timerText: {
    position: "absolute",
    right: 8,
    top: -2,
    color: "#FFFFFF",
    fontWeight: "700"
  },
  deckWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  swiperContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 4
  },
  sideIndicatorLeft: {
    position: "absolute",
    left: 10,
    top: "50%",
    transform: [{ translateY: -30 }],
    alignItems: "center",
    zIndex: 5
  },
  sideIndicatorRight: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -30 }],
    alignItems: "center",
    zIndex: 5
  },
  sideIcon: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 2
  },
  sideHint: {
    color: "#FFFFFF",
    fontSize: 10,
    opacity: 0.8
  },
  card: {
    width: "68%",
    minHeight: Platform.OS === "ios" ? 220 : 210,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    alignSelf: "center",
    shadowColor: "#000",
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
    shadowColor: "#000",
    shadowOpacity: 0.12,
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
