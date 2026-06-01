import { cn } from "@/lib/cn";

import type { BurgerScoresProps } from "./types";

import styles from "./BurgerScores.module.css";

const SCORE_ITEMS = [
  { key: "taste", label: "Taste", variant: "taste" },
  { key: "texture", label: "Texture", variant: "texture" },
  {
    key: "visualPresentation",
    label: "Visual presentation",
    variant: "visualPresentation",
  },
] as const;

function formatScore(score: number): string {
  return Math.min(Math.max(score, 0), 5).toFixed(1);
}

export function BurgerScores({ scores }: BurgerScoresProps) {
  return (
    <div className={styles.root}>
      {SCORE_ITEMS.map(({ key, label, variant }) => (
        <span key={key} className={cn(styles.pill, styles[variant])}>
          <span className={styles.label}>{label}</span>
          <span className={styles.score}>{formatScore(scores[key])}</span>
        </span>
      ))}
    </div>
  );
}
