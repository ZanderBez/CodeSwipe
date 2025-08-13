export type DeckId = "beginner" | "intermediate" | "advanced" | "nolifers";

export interface CardDoc {
  id: string;
  index: number;
  question: string;
  options: [string, string, string];
  correctIndex: 0 | 1 | 2;
  explanation?: string;
  approved?: boolean;
}

export interface DeckTheme {
  title: string;
  accent: string;
  danger: string;
  image: any;
  blurb: string;
}
