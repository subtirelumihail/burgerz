import { List } from "@/components/basic/List/List";
import { cn } from "@/lib/cn";

import { BurgerCard } from "./components/BurgerCard/BurgerCard";
import { BurgersListSkeleton } from "./components/BurgersListSkeleton/BurgersListSkeleton";
import type { BurgersListProps } from "./types";

import styles from "./BurgersList.module.css";

export function BurgersList({
  burgers,
  isLoading = false,
  returnTo,
  showRestaurant = true,
}: BurgersListProps) {
  const showSkeleton = isLoading && burgers.length === 0;
  const showList = burgers.length > 0;

  return (
    <section
      className={styles.root}
      aria-label="Burger results"
      aria-busy={isLoading || undefined}
    >
      {showSkeleton ? <BurgersListSkeleton /> : null}
      {showList ? (
        <List
          className={cn(styles.list, isLoading && styles.listLoading)}
          items={burgers}
          keyExtractor={(burger) => burger.id}
          renderItem={(burger) => (
            <BurgerCard
              burger={burger}
              listMode
              returnTo={returnTo}
              showRestaurant={showRestaurant}
            />
          )}
          emptyMessage="No burgers match your search."
          ariaLabel="Burgers"
        />
      ) : null}
      {!isLoading && burgers.length === 0 ? (
        <p className={styles.empty}>No burgers match your search.</p>
      ) : null}
    </section>
  );
}
