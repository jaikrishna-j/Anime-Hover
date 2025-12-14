import { AnimeTitle } from "./types";

export const ANIMATION_CONFIG = {
  initial: {
    scaleY: 1.15,
  },
  hover: {
    scaleY: 1.3,
  },
  transition: {
    type: "spring",
    stiffness: 300,
    damping: 10,
    mass: 0.8,
  },
} as const;

export const ANIME_TITLES: AnimeTitle[] = [
  { id: "onePiece", displayName: "one piece" },
  { id: "bleach", displayName: "bleach" },
  { id: "dragonBall", displayName: "dragon ball" },
  { id: "soloLeveling", displayName: "solo leveling" },
  { id: "blackClover", displayName: "black clover" },
  { id: "attackOnTitan", displayName: "attack on titan" },
  { id: "demonSlayer", displayName: "demon slayer" },
];