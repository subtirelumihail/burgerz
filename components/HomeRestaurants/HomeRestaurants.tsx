"use client";

import { Pagination } from "@/components/basic/Pagination/Pagination";
import { RestaurantSearch } from "@/components/RestaurantSearch/RestaurantSearch";
import { RestaurantSort } from "@/components/RestaurantSort/RestaurantSort";
import { RestaurantsList } from "@/components/RestaurantsList/RestaurantsList";
import { useRestaurants } from "@/hooks/useRestaurants";

import styles from "./HomeRestaurants.module.css";

export function HomeRestaurants() {
  const {
    restaurants,
    query,
    setQuery,
    search,
    clearSearch,
    sort,
    setSort,
    pagination,
    goToPage,
    isLoading,
    error,
    needsLocationAccess,
    isLocationPending,
    locationStatus,
    enableLocation,
  } = useRestaurants();

  return (
    <>
      <RestaurantSearch
        query={query}
        onQueryChange={setQuery}
        onSearch={() => {
          void search();
        }}
        onClear={() => {
          void clearSearch();
        }}
        isLoading={isLoading}
      />
      <RestaurantSort
        sort={sort}
        onSortChange={setSort}
        needsLocationAccess={needsLocationAccess}
        locationStatus={locationStatus}
        isLocationPending={isLocationPending}
        onEnableLocation={enableLocation}
        isLoading={isLoading}
      />
      {error ? (
        <p className={styles.error} role="alert">
          {error.message}
        </p>
      ) : null}
      <RestaurantsList restaurants={restaurants} isLoading={isLoading} />
      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={goToPage}
        isLoading={isLoading}
        className={styles.pagination}
      />
    </>
  );
}
