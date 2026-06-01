import type { PaginationMeta } from "@/types/api";
import type { ImageAsset } from "@/types/image";

export const DEFAULT_REVIEWS_PAGE_SIZE = 5;

export interface BurgerUserReview {
  id: string;
  burgerId: string;
  authorName: string;
  text: string;
  score: number;
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
