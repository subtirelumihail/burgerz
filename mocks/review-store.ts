import { mockReviews } from "@/mocks/data/reviews";
import type {
  BurgerUserReview,
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
