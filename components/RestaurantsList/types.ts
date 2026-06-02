import type { Restaurant } from "@/types/restaurant";

export interface RestaurantCardProps {
  restaurant: Restaurant;
  /** Enables split keyboard focus: thumbnail link + details link. */
  listMode?: boolean;
  showDistance?: boolean;
}

export interface RestaurantsListProps {
  restaurants: Restaurant[];
  isLoading?: boolean;
  showDistance?: boolean;
}
