import type { RestaurantSortOption } from "@/types/restaurant";

export interface RestaurantSortProps {
  sort: RestaurantSortOption;
  onSortChange: (sort: RestaurantSortOption) => void;
  needsLocationAccess: boolean;
  isLocationPending?: boolean;
  onEnableLocation: () => void;
  isLoading?: boolean;
}

export interface SortOption {
  value: RestaurantSortOption;
  label: string;
}
