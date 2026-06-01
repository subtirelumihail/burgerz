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

function formatScore(score: number, decimals: 0 | 1): string {
  const clamped = Math.min(Math.max(score, 0), 5);

  return decimals === 0 ? String(Math.round(clamped)) : clamped.toFixed(1);
}

export function BurgerScores({ scores, decimals = 1 }: BurgerScoresProps) {
  return (
    <ul className={styles.root} aria-label="Aspect scores">
      {SCORE_ITEMS.map(({ key, label, variant }) => {
        const formattedScore = formatScore(scores[key], decimals);
        const pillLabel = `${label}, ${formattedScore} out of 5`;

        return (
          <li key={key} className={styles.item}>
            <span className={styles.srOnly}>{pillLabel}</span>
            <span
              aria-hidden="true"
              className={cn(styles.pill, styles[variant])}
            >
              <span className={styles.label}>{label}</span>
              <span className={styles.score}>{formattedScore}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
