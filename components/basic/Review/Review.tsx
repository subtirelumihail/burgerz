import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

import { cn } from "@/lib/cn";

import styles from "./Review.module.css";
import type { ReviewProps } from "./types";

const MAX_STARS = 5;

function clampScore(score: number): number {
  return Math.min(Math.max(score, 0), MAX_STARS);
}

function formatScore(score: number): string {
  return clampScore(score).toFixed(1);
}

function renderStars(score: number) {
  const clampedScore = clampScore(score);

  return Array.from({ length: MAX_STARS }, (_, index) => {
    const starValue = index + 1;

    if (clampedScore >= starValue) {
      return <FaStar key={starValue} aria-hidden />;
    }

    if (clampedScore >= starValue - 0.5) {
      return <FaStarHalfAlt key={starValue} aria-hidden />;
    }

    return <FaRegStar key={starValue} aria-hidden />;
  });
}

export function Review({
  score,
  reviewCount,
  label,
  size = "md",
}: ReviewProps) {
  const formattedScore = formatScore(score);
  const ariaLabel =
    reviewCount !== undefined
      ? `${formattedScore} out of ${MAX_STARS} stars based on ${reviewCount} reviews`
      : `${formattedScore} out of ${MAX_STARS} stars`;

  return (
    <div className={styles.root}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <div
        className={cn(
          styles.stars,
          size === "sm" ? styles.starsSm : styles.starsMd,
        )}
        role="img"
        aria-label={ariaLabel}
      >
        {renderStars(score)}
      </div>
      <span className={styles.score}>{formattedScore}</span>
      {reviewCount !== undefined ? (
        <span className={styles.count}>({reviewCount} reviews)</span>
      ) : null}
    </div>
  );
}
