"use client";

import { BurgerReviewsList } from "@/components/BurgerReviewsList/BurgerReviewsList";
import { Pagination } from "@/components/basic/Pagination/Pagination";
import { ReviewSearch } from "@/components/ReviewSearch/ReviewSearch";
import { useBurger } from "@/hooks/useBurger";
import { useBurgerReviews } from "@/hooks/useBurgerReviews";

import { BurgerHero } from "./components/BurgerHero/BurgerHero";
import { BurgerHeroSkeleton } from "./components/BurgerHeroSkeleton/BurgerHeroSkeleton";
import type { BurgerPageContentProps } from "./types";

import styles from "./BurgerPageContent.module.css";

export function BurgerPageContent({ burgerId }: BurgerPageContentProps) {
  const {
    burger,
    isLoading: isBurgerLoading,
    error: burgerError,
  } = useBurger(burgerId);
  const {
    reviews,
    query,
    setQuery,
    search,
    clearSearch,
    pagination,
    goToPage,
    isLoading: isReviewsLoading,
    error: reviewsError,
  } = useBurgerReviews(burgerId);

  const error = burgerError ?? reviewsError;

  if (!isBurgerLoading && !burger && !burgerError) {
    return <p className={styles.notFound}>Burger not found</p>;
  }

  return (
    <div className={styles.root}>
      {isBurgerLoading ? <BurgerHeroSkeleton /> : null}
      {!isBurgerLoading && burger ? <BurgerHero burger={burger} /> : null}
      {error ? (
        <p className={styles.error} role="alert">
          {error.message}
        </p>
      ) : null}
      <section className={styles.reviewsSection} aria-label="Reviews">
        <h2 className={styles.reviewsHeading}>Customer reviews</h2>
        <ReviewSearch
          query={query}
          onQueryChange={setQuery}
          onSearch={() => {
            void search();
          }}
          onClear={() => {
            void clearSearch();
          }}
          isLoading={isReviewsLoading}
        />
        <BurgerReviewsList reviews={reviews} isLoading={isReviewsLoading} />
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={goToPage}
          isLoading={isReviewsLoading}
          className={styles.pagination}
        />
      </section>
    </div>
  );
}
