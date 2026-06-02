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

export interface UserReviewContent {
  id: string;
  authorName: string;
  text: string;
  score: BurgerUserReviewRating;
  aspects: BurgerUserReviewAspects;
  image?: ImageAsset;
  createdAt: string;
}

export interface BurgerUserReview extends UserReviewContent {
  burgerId: string;
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

export interface CreateBurgerReviewAspectScores {
  taste: BurgerUserReviewRating;
  texture: BurgerUserReviewRating;
  visualPresentation: BurgerUserReviewRating;
}

export interface CreateBurgerReviewRequest {
  authorName: string;
  text: string;
  aspects: CreateBurgerReviewAspectScores;
  image?: ImageAsset;
}

export type CreateBurgerReviewResponse = BurgerUserReview;

export interface RestaurantUserReview extends UserReviewContent {
  restaurantId: string;
}

export interface GetRestaurantReviewsParams {
  q?: string;
  page?: number;
  pageSize?: number;
}

export interface GetRestaurantReviewsResponse {
  reviews: RestaurantUserReview[];
  pagination: PaginationMeta;
}

export interface CreateRestaurantReviewRequest {
  authorName: string;
  text: string;
  aspects: CreateBurgerReviewAspectScores;
  image?: ImageAsset;
}

export type CreateRestaurantReviewResponse = RestaurantUserReview;
