import { List } from "@/components/basic/List/List";
import { cn } from "@/lib/cn";

import { UserReviewCard } from "./components/UserReviewCard/UserReviewCard";
import { BurgerReviewsListSkeleton } from "./components/BurgerReviewsListSkeleton/BurgerReviewsListSkeleton";
import type { BurgerReviewsListProps } from "./types";

import styles from "./BurgerReviewsList.module.css";

export function BurgerReviewsList({
  reviews,
  isLoading = false,
  showReviewImages = true,
}: BurgerReviewsListProps) {
  const showSkeleton = isLoading && reviews.length === 0;
  const showList = reviews.length > 0;

  return (
    <section
      className={styles.root}
      aria-label="Customer reviews"
      aria-busy={isLoading || undefined}
    >
      {showSkeleton ? <BurgerReviewsListSkeleton /> : null}
      {showList ? (
        <List
          className={cn(styles.list, isLoading && styles.listLoading)}
          items={reviews}
          keyExtractor={(review) => review.id}
          renderItem={(review) => (
            <UserReviewCard
              review={review}
              showReviewImage={showReviewImages}
              listMode
            />
          )}
          emptyMessage="No reviews match your search."
          ariaLabel="Reviews"
        />
      ) : null}
      {!isLoading && reviews.length === 0 ? (
        <p className={styles.empty}>No reviews match your search.</p>
      ) : null}
    </section>
  );
}
