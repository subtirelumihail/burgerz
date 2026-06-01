import type { PaginationMeta } from "@/types/api";
import type { ImageAsset } from "@/types/image";

export const DEFAULT_REVIEWS_PAGE_SIZE = 5;

export type BurgerUserReviewRating = 1 | 2 | 3 | 4 | 5;

export interface BurgerUserReviewAspect {
  text: string;
  score: BurgerUserReviewRating;
}

export interface BurgerUserReviewAspects {
  taste: BurgerUserReviewAspect;
  texture: BurgerUserReviewAspect;
  visualPresentation: BurgerUserReviewAspect;
}

export interface BurgerUserReview {
  id: string;
  burgerId: string;
  authorName: string;
  /** Overall review text */
  text: string;
  /** Overall score (1–5, whole stars only) */
  score: BurgerUserReviewRating;
  aspects: BurgerUserReviewAspects;
  image?: ImageAsset;
  createdAt: string;
}

export interface GetBurgerReviewsParams {
  q?: string;
  page?: number;
  pageSize?: number;
}

export interface GetBurgerReviewsResponse {
  reviews: BurgerUserReview[];
  pagination: PaginationMeta;
}
