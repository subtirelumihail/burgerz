import type { BurgerScores } from "@/types/burger";
import type { BurgerUserReviewAspects } from "@/types/review";

export function toCategoryScores(
  aspects: BurgerUserReviewAspects,
): BurgerScores {
  return {
    taste: aspects.taste.score,
    texture: aspects.texture.score,
    visualPresentation: aspects.visualPresentation.score,
  };
}

export function formatReviewDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(isoDate));
}
