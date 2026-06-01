import type { PaginationMeta } from "@/types/api";
import type { ImageAsset } from "@/types/image";

export const DEFAULT_RESTAURANTS_PAGE_SIZE = 6;

export type RestaurantSortOption = "nearby" | "name" | "name-desc";

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface OpeningHours {
  days: string;
  hours: string;
}

export interface RestaurantLocation {
  address: string;
  coordinates: GeoCoordinates;
}

export interface RestaurantSummary {
  id: string;
  name: string;
}

export interface Restaurant extends RestaurantSummary {
  image: ImageAsset;
  location: RestaurantLocation;
  openingHours: OpeningHours[];
  distanceKm?: number;
}

export interface GetRestaurantsParams {
  q?: string;
  page?: number;
  pageSize?: number;
  sort?: RestaurantSortOption;
  latitude?: number;
  longitude?: number;
}

export interface GetRestaurantsResponse {
  restaurants: Restaurant[];
  pagination: PaginationMeta;
}
