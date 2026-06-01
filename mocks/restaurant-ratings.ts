import { mockBurgers } from "@/mocks/data/burgers";
import type { BurgerScores } from "@/types/burger";
import type { BurgerUserReview } from "@/types/review";

export interface RestaurantRatings {
  reviewCount: number;
  reviewScore: number;
  scores: BurgerScores;
}

const EMPTY_RATINGS: RestaurantRatings = {
  reviewCount: 0,
  reviewScore: 0,
  scores: {
    taste: 0,
    texture: 0,
    visualPresentation: 0,
  },
};

function roundScore(value: number, decimals = 1): number {
  const factor = 10 ** decimals;

  return Math.round(value * factor) / factor;
}

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function computeRestaurantRatings(
  restaurantId: string,
  reviews: readonly BurgerUserReview[],
): RestaurantRatings {
  const burgerIds = new Set(
    mockBurgers
      .filter((burger) => burger.restaurant.id === restaurantId)
      .map((burger) => burger.id),
  );
  const restaurantReviews = reviews.filter((review) =>
    burgerIds.has(review.burgerId),
  );

  if (restaurantReviews.length === 0) {
    return EMPTY_RATINGS;
  }

  return {
    reviewCount: restaurantReviews.length,
    reviewScore: roundScore(
      average(restaurantReviews.map((review) => review.score)),
    ),
    scores: {
      taste: roundScore(
        average(restaurantReviews.map((review) => review.aspects.taste.score)),
      ),
      texture: roundScore(
        average(
          restaurantReviews.map((review) => review.aspects.texture.score),
        ),
      ),
      visualPresentation: roundScore(
        average(
          restaurantReviews.map(
            (review) => review.aspects.visualPresentation.score,
          ),
        ),
      ),
    },
  };
}

export function enrichRestaurantWithRatings<
  T extends { id: string },
  R extends T & RestaurantRatings,
>(restaurant: T, reviews: readonly BurgerUserReview[]): R {
  return {
    ...restaurant,
    ...computeRestaurantRatings(restaurant.id, reviews),
  } as R;
}
