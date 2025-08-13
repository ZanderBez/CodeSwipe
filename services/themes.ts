import { DeckId } from "../types/flashcards";

export const THEMES: Record<DeckId, {
  title: string;
  accent: string;
  danger: string;
  image: any;
  blurb: string;
}> = {
  beginner: {
    title: "BEGINNER",
    accent: "#7AE2CF",
    danger: "#FD5308",
    image: require("../assets/card1.png"),
    blurb: "Beginner flash cards cover the basics in a simple, easy to understand way. Perfect for anyone new to coding, each card focuses on one clear concept to help you learn and build confidence step by step."
  },
  intermediate: {
    title: "INTERMEDIATE",
    accent: "#7AE2CF",
    danger: "#FD5308",
    image: require("../assets/card2.png"),
    blurb: "Sharpen your skills with practical problems and common pitfalls."
  },
  advanced: {
    title: "ADVANCED",
    accent: "#7AE2CF",
    danger: "#FD5308",
    image: require("../assets/card3.png"),
    blurb: "Deep dives, tricky concepts, and performance-minded questions."
  },
  nolifers: {
    title: "NO LIFERS",
    accent: "#7AE2CF",
    danger: "#FD5308",
    image: require("../assets/card4.png"),
    blurb: "Brutal mode. Edge cases, debugging, and speed under pressure."
  }
};

export const DECK_ORDER: DeckId[] = ["beginner", "intermediate", "advanced", "nolifers"];
