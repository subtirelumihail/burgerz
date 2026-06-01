import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

import { cn } from "@/lib/cn";

import styles from "./Review.module.css";
import type { ReviewProps } from "./types";

const MAX_STARS = 5;

function clampScore(score: number): number {
  return Math.min(Math.max(score, 0), MAX_STARS);
}

function formatScore(score: number): string {
  const clampedScore = clampScore(score);

  return Number.isInteger(clampedScore)
    ? String(clampedScore)
    : clampedScore.toFixed(1);
}

function renderStars(score: number) {
  const clampedScore = clampScore(score);
  const usesHalfStars = !Number.isInteger(clampedScore);

  return Array.from({ length: MAX_STARS }, (_, index) => {
    const starValue = index + 1;

    if (clampedScore >= starValue) {
      return <FaStar key={starValue} aria-hidden />;
    }

    if (usesHalfStars && clampedScore >= starValue - 0.5) {
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
  const starRatingLabel = `${formattedScore} out of ${MAX_STARS} stars`;
  const ratingWithCountLabel =
    reviewCount !== undefined
      ? `${starRatingLabel} based on ${reviewCount} reviews`
      : starRatingLabel;
  const screenReaderLabel = label
    ? `${label} rating, ${starRatingLabel}`
    : ratingWithCountLabel;

  return (
    <div className={styles.root}>
      <span className={styles.srOnly}>{screenReaderLabel}</span>
      <div aria-hidden="true" className={styles.visual}>
        {label ? <span className={styles.label}>{label}</span> : null}
        <div
          className={cn(
            styles.stars,
            size === "sm" ? styles.starsSm : styles.starsMd,
          )}
        >
          {renderStars(score)}
        </div>
        <span className={styles.score}>{formattedScore}</span>
        {reviewCount !== undefined ? (
          <span className={styles.count}>({reviewCount} reviews)</span>
        ) : null}
      </div>
    </div>
  );
}
