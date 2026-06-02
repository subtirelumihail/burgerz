"use client";

import { BurgerSearch } from "@/components/BurgerSearch/BurgerSearch";
import { BurgersList } from "@/components/BurgersList/BurgersList";
import { Pagination } from "@/components/basic/Pagination/Pagination";
import { useRestaurantBurgers } from "@/hooks/useRestaurantBurgers";

import type { RestaurantBurgersProps } from "./types";

import styles from "./RestaurantBurgers.module.css";

export function RestaurantBurgers({ restaurantId }: RestaurantBurgersProps) {
  const returnTo = `/restaurants/${restaurantId}`;
  const {
    burgers,
    query,
    setQuery,
    search,
    clearSearch,
    pagination,
    goToPage,
    isLoading,
    error,
  } = useRestaurantBurgers(restaurantId);

  return (
    <section className={styles.root} aria-label="Burgers menu">
      <BurgerSearch
        query={query}
        onQueryChange={setQuery}
        onSearch={search}
        onClear={clearSearch}
        isLoading={isLoading}
      />
      {error ? (
        <p className={styles.error} role="alert">
          {error.message}
        </p>
      ) : null}
      <BurgersList
        burgers={burgers}
        isLoading={isLoading}
        returnTo={returnTo}
        showRestaurant={false}
      />
      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={goToPage}
        isLoading={isLoading}
        className={styles.pagination}
      />
    </section>
  );
}
