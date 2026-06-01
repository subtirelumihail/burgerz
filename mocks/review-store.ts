import { mockReviews } from "@/mocks/data/reviews";
import type {
  BurgerUserReview,
  BurgerUserReviewAspects,
  BurgerUserReviewRating,
  CreateBurgerReviewRequest,
  GetBurgerReviewsResponse,
} from "@/types/review";
import { DEFAULT_REVIEWS_PAGE_SIZE } from "@/types/review";

const reviews: BurgerUserReview[] = [...mockReviews];

interface ListReviewsOptions {
  burgerId: string;
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
  burgerId: string,
  query?: string | null,
): BurgerUserReview[] {
  const burgerReviews = reviews.filter(
    (review) => review.burgerId === burgerId,
  );

  if (!query) {
    return burgerReviews;
  }

  const normalizedQuery = query.toLowerCase();

  return burgerReviews.filter((review) => {
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

export function listBurgerReviews({
  burgerId,
  query = null,
  page = 1,
  pageSize = DEFAULT_REVIEWS_PAGE_SIZE,
}: ListReviewsOptions): GetBurgerReviewsResponse {
  const filtered = filterReviews(burgerId, query);
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

export function parseListReviewsParams(
  burgerId: string,
  searchParams: URLSearchParams,
): ListReviewsOptions {
  return {
    burgerId,
    query: searchParams.get("q"),
    page: parsePositiveInteger(searchParams.get("page"), 1),
    pageSize: parsePositiveInteger(
      searchParams.get("pageSize"),
      DEFAULT_REVIEWS_PAGE_SIZE,
    ),
  };
}

function averageAspectScores(
  aspects: CreateBurgerReviewRequest["aspects"],
): BurgerUserReviewRating {
  const mean =
    (aspects.taste + aspects.texture + aspects.visualPresentation) / 3;

  return Math.round(mean) as BurgerUserReviewRating;
}

function toReviewAspects(
  aspects: CreateBurgerReviewRequest["aspects"],
): BurgerUserReviewAspects {
  return {
    taste: { text: "", score: aspects.taste },
    texture: { text: "", score: aspects.texture },
    visualPresentation: { text: "", score: aspects.visualPresentation },
  };
}

export function createBurgerReview(
  burgerId: string,
  payload: CreateBurgerReviewRequest,
): BurgerUserReview {
  const aspects = toReviewAspects(payload.aspects);
  const review: BurgerUserReview = {
    id: `${burgerId}-review-${Date.now()}`,
    burgerId,
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
