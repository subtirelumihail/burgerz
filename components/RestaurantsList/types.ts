import type { Restaurant } from "@/types/restaurant";

export interface RestaurantCardProps {
  restaurant: Restaurant;
  imagePriority?: boolean;
}

export interface RestaurantsListProps {
  restaurants: Restaurant[];
  isLoading?: boolean;
}
