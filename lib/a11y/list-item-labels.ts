import { formatReviewDate } from "@/lib/utils/reviews.util";
import type { Burger } from "@/types/burger";
import type { Restaurant } from "@/types/restaurant";
import type { BurgerUserReview } from "@/types/review";

const ASPECT_LABELS = {
  taste: "Taste",
  texture: "Texture",
  visualPresentation: "Visual presentation",
} as const;

function formatStarRating(score: number, max = 5): string {
  const formattedScore = Number.isInteger(score)
    ? String(score)
    : score.toFixed(1);

  return `${formattedScore} out of ${max} stars`;
}

function formatDistanceLabel(distanceKm?: number): string | null {
  if (distanceKm === undefined) {
    return null;
  }

  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} meters away`;
  }

  return `${distanceKm.toFixed(1)} kilometers away`;
}

function formatAspectScores(scores: Burger["scores"]): string {
  return (
    Object.entries(ASPECT_LABELS)
      .map(([key, label]) => {
        const score = scores[key as keyof Burger["scores"]];
        const formattedScore = Number.isInteger(score)
          ? String(score)
          : score.toFixed(1);

        return `${label}, ${formattedScore} out of 5`;
      })
      .join(". ") + "."
  );
}

export function formatBurgerThumbnailLabel(burger: Burger): string {
  return `View photo of ${burger.title}`;
}

export function formatRestaurantThumbnailLabel(restaurant: Restaurant): string {
  return `View photo of ${restaurant.name}`;
}

function formatBurgerReviewSummary(burger: Burger): string {
  const reviewSummary = `${formatStarRating(burger.reviewScore)} based on ${burger.reviewCount} reviews`;

  return `${reviewSummary}. Aspect scores: ${formatAspectScores(burger.scores)}`;
}

export function formatBurgerSummaryLabel(burger: Burger): string {
  return `${burger.title}. ${formatBurgerReviewSummary(burger)}`;
}

export function formatBurgerListItemLabel(burger: Burger): string {
  return `${burger.title}, from ${burger.restaurant.name}. ${formatBurgerReviewSummary(burger)}`;
}

export function formatRestaurantListItemLabel(restaurant: Restaurant): string {
  const parts = [restaurant.name];
  const distanceLabel = formatDistanceLabel(restaurant.distanceKm);

  if (distanceLabel) {
    parts.push(distanceLabel);
  }

  parts.push(restaurant.location.address);

  const openingHours = restaurant.openingHours
    .map((entry) => `${entry.days}, ${entry.hours}`)
    .join(". ");

  parts.push(`Opening times: ${openingHours}.`);

  return parts.join(". ");
}

export function formatReviewListItemLabel(
  review: BurgerUserReview,
  options?: { includePhotoNote?: boolean },
): string {
  const parts = [
    `${review.authorName}, ${formatReviewDate(review.createdAt)}.`,
    `Overall rating, ${formatStarRating(review.score)}.`,
    review.text,
  ];

  const aspectSummaries = (
    Object.entries(ASPECT_LABELS) as Array<[keyof typeof ASPECT_LABELS, string]>
  ).map(([key, label]) => {
    const aspect = review.aspects[key];

    return `${label}, ${aspect.score} out of 5: ${aspect.text}`;
  });

  parts.push(aspectSummaries.join(". ") + ".");

  if (review.image && options?.includePhotoNote !== false) {
    parts.push("Includes a review photo.");
  }

  return parts.join(" ");
}
