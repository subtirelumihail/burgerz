"use client";

import { useCallback, useEffect, useState } from "react";

import { useGeolocation } from "@/hooks/useGeolocation";
import { getRestaurants } from "@/lib/services/restaurant.service";
import type { PaginationMeta } from "@/types/api";
import type { Restaurant, RestaurantSortOption } from "@/types/restaurant";
import { DEFAULT_RESTAURANTS_PAGE_SIZE } from "@/types/restaurant";

interface UseRestaurantsResult {
  restaurants: Restaurant[];
  query: string;
  setQuery: (query: string) => void;
  search: () => void;
  clearSearch: () => void;
  sort: RestaurantSortOption;
  setSort: (sort: RestaurantSortOption) => void;
  page: number;
  pagination: PaginationMeta;
  goToPage: (page: number) => void;
  isLoading: boolean;
  error: Error | null;
  needsLocationAccess: boolean;
  isLocationPending: boolean;
  enableLocation: () => void;
}

const defaultPagination: PaginationMeta = {
  page: 1,
  pageSize: DEFAULT_RESTAURANTS_PAGE_SIZE,
  total: 0,
  totalPages: 1,
};

function toError(error: unknown): Error {
  return error instanceof Error
    ? error
    : new Error("Failed to load restaurants");
}

function getEffectiveSort(
  sort: RestaurantSortOption,
  isLocationAvailable: boolean,
): RestaurantSortOption {
  if (sort === "nearby" && !isLocationAvailable) {
    return "name";
  }

  return sort;
}

interface FetchRestaurantsOptions {
  q?: string;
  page?: number;
  sort: RestaurantSortOption;
  coordinates: ReturnType<typeof useGeolocation>["coordinates"];
  isLocationAvailable: boolean;
}

function buildRestaurantRequest({
  q,
  page = 1,
  sort,
  coordinates,
  isLocationAvailable,
}: FetchRestaurantsOptions) {
  const effectiveSort = getEffectiveSort(sort, isLocationAvailable);

  return {
    q,
    page,
    pageSize: DEFAULT_RESTAURANTS_PAGE_SIZE,
    sort: effectiveSort,
    latitude:
      effectiveSort === "nearby" && coordinates
        ? coordinates.latitude
        : undefined,
    longitude:
      effectiveSort === "nearby" && coordinates
        ? coordinates.longitude
        : undefined,
  };
}

export function useRestaurants(): UseRestaurantsResult {
  const {
    coordinates,
    status: geolocationStatus,
    isLocationAvailable,
    needsLocationAccess,
    isLocationPending,
    requestLocation,
  } = useGeolocation();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<RestaurantSortOption>("nearby");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] =
    useState<PaginationMeta>(defaultPagination);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadRestaurants = useCallback(
    async (
      q?: string,
      nextPage = 1,
      nextSort: RestaurantSortOption = sort,
      location = coordinates,
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getRestaurants(
          buildRestaurantRequest({
            q,
            page: nextPage,
            sort: nextSort,
            coordinates: location,
            isLocationAvailable,
          }),
        );
        setRestaurants(response.restaurants);
        setPagination(response.pagination);
        setPage(response.pagination.page);
      } catch (err) {
        setError(toError(err));
      } finally {
        setIsLoading(false);
      }
    },
    [coordinates, isLocationAvailable, sort],
  );

  useEffect(() => {
    if (geolocationStatus === "idle" || geolocationStatus === "pending") {
      return;
    }

    let isCancelled = false;

    getRestaurants(
      buildRestaurantRequest({
        page: 1,
        sort,
        coordinates,
        isLocationAvailable,
      }),
    )
      .then((response) => {
        if (!isCancelled) {
          setRestaurants(response.restaurants);
          setPagination(response.pagination);
          setPage(response.pagination.page);
          setError(null);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          setError(toError(err));
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [coordinates, geolocationStatus, isLocationAvailable, sort]);

  const search = useCallback(() => {
    const trimmedQuery = query.trim();
    void loadRestaurants(trimmedQuery || undefined, 1, sort, coordinates);
  }, [coordinates, loadRestaurants, query, sort]);

  const clearSearch = useCallback(() => {
    setQuery("");
    void loadRestaurants(undefined, 1, sort, coordinates);
  }, [coordinates, loadRestaurants, sort]);

  const goToPage = useCallback(
    (nextPage: number) => {
      const trimmedQuery = query.trim();
      void loadRestaurants(
        trimmedQuery || undefined,
        nextPage,
        sort,
        coordinates,
      );
    },
    [coordinates, loadRestaurants, query, sort],
  );

  const handleSetSort = useCallback((nextSort: RestaurantSortOption) => {
    setSort(nextSort);
    setIsLoading(true);
  }, []);

  const enableLocation = useCallback(() => {
    requestLocation();
    setSort("nearby");
  }, [requestLocation]);

  return {
    restaurants,
    query,
    setQuery,
    search,
    clearSearch,
    sort,
    setSort: handleSetSort,
    page,
    pagination,
    goToPage,
    isLoading,
    error,
    needsLocationAccess,
    isLocationPending,
    enableLocation,
  };
}
