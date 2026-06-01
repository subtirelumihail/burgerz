import type { PaginationMeta } from "@/types/api";
import type { RestaurantSummary } from "@/types/restaurant";

export const DEFAULT_BURGERS_PAGE_SIZE = 6;

export interface BurgerScores {
  taste: number;
  texture: number;
  visualPresentation: number;
}

export interface Burger {
  id: string;
  title: string;
  restaurant: RestaurantSummary;
  imageUrl: string;
  reviewCount: number;
  reviewScore: number;
  scores: BurgerScores;
}

export interface GetBurgersParams {
  q?: string;
  page?: number;
  pageSize?: number;
}

export interface GetBurgersResponse {
  burgers: Burger[];
  pagination: PaginationMeta;
}

export interface CreateBurgerRequest {
  title: string;
  restaurantId: string;
  imageUrl: string;
  scores: BurgerScores;
}

export type CreateBurgerResponse = Burger;
