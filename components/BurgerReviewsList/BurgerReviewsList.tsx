import { cn } from "@/lib/cn";

import { UserReviewCard } from "./components/UserReviewCard/UserReviewCard";
import { BurgerReviewsListSkeleton } from "./components/BurgerReviewsListSkeleton/BurgerReviewsListSkeleton";
import type { BurgerReviewsListProps } from "./types";

import styles from "./BurgerReviewsList.module.css";

export function BurgerReviewsList({
  reviews,
  isLoading = false,
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
        <ul
          className={cn(styles.list, isLoading && styles.listLoading)}
          aria-label="Reviews"
        >
          {reviews.map((review) => (
            <li key={review.id}>
              <UserReviewCard review={review} />
            </li>
          ))}
        </ul>
      ) : null}
      {!isLoading && reviews.length === 0 ? (
        <p className={styles.empty}>No reviews match your search.</p>
      ) : null}
    </section>
  );
}
