import { mockRestaurantReviews } from "@/mocks/data/restaurant-reviews";
import type {
  CreateRestaurantReviewRequest,
  GetRestaurantReviewsResponse,
  RestaurantUserReview,
  BurgerUserReviewAspects,
  BurgerUserReviewRating,
} from "@/types/review";
import { DEFAULT_REVIEWS_PAGE_SIZE } from "@/types/review";

const reviews: RestaurantUserReview[] = [...mockRestaurantReviews];

interface ListRestaurantReviewsOptions {
  restaurantId: string;
  query?: string | null;
  page?: number;
  pageSize?: number;
}

function parsePositiveInteger(value: string | null, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
}

function filterReviews(
  restaurantId: string,
  query?: string | null,
): RestaurantUserReview[] {
  const restaurantReviews = reviews.filter(
    (review) => review.restaurantId === restaurantId,
  );

  if (!query) {
    return restaurantReviews;
  }

  const normalizedQuery = query.toLowerCase();

  return restaurantReviews.filter((review) => {
    const aspectTexts = [
      review.aspects.taste.text,
      review.aspects.texture.text,
      review.aspects.visualPresentation.text,
    ];

    return (
      review.authorName.toLowerCase().includes(normalizedQuery) ||
      review.text.toLowerCase().includes(normalizedQuery) ||
      aspectTexts.some((aspectText) =>
        aspectText.toLowerCase().includes(normalizedQuery),
      )
    );
  });
}

export function listRestaurantReviews({
  restaurantId,
  query = null,
  page = 1,
  pageSize = DEFAULT_REVIEWS_PAGE_SIZE,
}: ListRestaurantReviewsOptions): GetRestaurantReviewsResponse {
  const filtered = filterReviews(restaurantId, query);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    reviews: filtered.slice(start, start + pageSize),
    pagination: {
      page: safePage,
      pageSize,
      total,
      totalPages,
    },
  };
}

export function parseListRestaurantReviewsParams(
  restaurantId: string,
  searchParams: URLSearchParams,
): ListRestaurantReviewsOptions {
  return {
    restaurantId,
    query: searchParams.get("q"),
    page: parsePositiveInteger(searchParams.get("page"), 1),
    pageSize: parsePositiveInteger(
      searchParams.get("pageSize"),
      DEFAULT_REVIEWS_PAGE_SIZE,
    ),
  };
}

function averageAspectScores(
  aspects: CreateRestaurantReviewRequest["aspects"],
): BurgerUserReviewRating {
  const mean =
    (aspects.taste + aspects.texture + aspects.visualPresentation) / 3;

  return Math.round(mean) as BurgerUserReviewRating;
}

function toReviewAspects(
  aspects: CreateRestaurantReviewRequest["aspects"],
): BurgerUserReviewAspects {
  return {
    taste: { text: "", score: aspects.taste },
    texture: { text: "", score: aspects.texture },
    visualPresentation: { text: "", score: aspects.visualPresentation },
  };
}

export function createRestaurantReview(
  restaurantId: string,
  payload: CreateRestaurantReviewRequest,
): RestaurantUserReview {
  const aspects = toReviewAspects(payload.aspects);
  const review: RestaurantUserReview = {
    id: `${restaurantId}-review-${Date.now()}`,
    restaurantId,
    authorName: payload.authorName.trim(),
    text: payload.text.trim(),
    score: averageAspectScores(payload.aspects),
    aspects,
    createdAt: new Date().toISOString(),
    ...(payload.image ? { image: payload.image } : {}),
  };

  reviews.unshift(review);

  return review;
}
