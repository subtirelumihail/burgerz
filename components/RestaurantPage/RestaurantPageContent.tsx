"use client";

import { RestaurantPageTabs } from "./components/RestaurantPageTabs/RestaurantPageTabs";
import { useRestaurant } from "@/hooks/useRestaurant";

import { RestaurantHero } from "./components/RestaurantHero/RestaurantHero";
import type { RestaurantPageContentProps } from "./types";

import styles from "./RestaurantPageContent.module.css";

export function RestaurantPageContent({
  restaurantId,
}: RestaurantPageContentProps) {
  const { restaurant, isLoading, error } = useRestaurant(restaurantId);

  if (!isLoading && !restaurant && !error) {
    return <p className={styles.notFound}>Restaurant not found</p>;
  }

  return (
    <div className={styles.root}>
      {!isLoading && restaurant ? (
        <RestaurantHero restaurant={restaurant} />
      ) : null}
      {error ? (
        <p className={styles.error} role="alert">
          {error.message}
        </p>
      ) : null}
      {!isLoading && restaurant ? (
        <RestaurantPageTabs restaurantId={restaurant.id} />
      ) : null}
    </div>
  );
}
