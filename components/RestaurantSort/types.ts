import type { RestaurantSortOption } from "@/types/restaurant";

import type { GeolocationStatus } from "@/hooks/useGeolocation";

export interface RestaurantSortProps {
  sort: RestaurantSortOption;
  onSortChange: (sort: RestaurantSortOption) => void;
  needsLocationAccess: boolean;
  locationStatus: GeolocationStatus;
  isLocationPending?: boolean;
  onEnableLocation: () => void;
  isLoading?: boolean;
}

export interface SortOption {
  value: RestaurantSortOption;
  label: string;
}
