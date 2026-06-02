import { List } from "@/components/basic/List/List";
import { cn } from "@/lib/cn";

import { RestaurantCard } from "./components/RestaurantCard/RestaurantCard";
import { RestaurantsListSkeleton } from "./components/RestaurantsListSkeleton/RestaurantsListSkeleton";
import type { RestaurantsListProps } from "./types";

import styles from "./RestaurantsList.module.css";

export function RestaurantsList({
  restaurants,
  isLoading = false,
  showDistance = false,
}: RestaurantsListProps) {
  const showSkeleton = isLoading && restaurants.length === 0;
  const showList = restaurants.length > 0;

  return (
    <section
      className={styles.root}
      aria-label="Restaurant results"
      aria-busy={isLoading || undefined}
    >
      {showSkeleton ? <RestaurantsListSkeleton /> : null}
      {showList ? (
        <List
          className={cn(styles.list, isLoading && styles.listLoading)}
          items={restaurants}
          keyExtractor={(restaurant) => restaurant.id}
          renderItem={(restaurant) => (
            <RestaurantCard
              restaurant={restaurant}
              listMode
              showDistance={showDistance}
            />
          )}
          emptyMessage="No restaurants match your search."
          ariaLabel="Restaurants"
        />
      ) : null}
      {!isLoading && restaurants.length === 0 ? (
        <p className={styles.empty}>No restaurants match your search.</p>
      ) : null}
    </section>
  );
}
