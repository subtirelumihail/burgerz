"use client";

import { BurgerReviewsList } from "@/components/BurgerReviewsList/BurgerReviewsList";
import { Pagination } from "@/components/basic/Pagination/Pagination";
import { ReviewSearch } from "@/components/ReviewSearch/ReviewSearch";
import { useRestaurantReviews } from "@/hooks/useRestaurantReviews";

import { AddReviewLink } from "./components/AddReviewLink/AddReviewLink";
import type { RestaurantReviewsProps } from "./types";

import styles from "./RestaurantReviews.module.css";

export function RestaurantReviews({ restaurantId }: RestaurantReviewsProps) {
  const {
    reviews,
    query,
    setQuery,
    search,
    clearSearch,
    pagination,
    goToPage,
    isLoading,
    error,
  } = useRestaurantReviews(restaurantId);

  return (
    <section className={styles.root} aria-label="Reviews">
      <div className={styles.header}>
        <h2 className={styles.heading}>Customer reviews</h2>
        <AddReviewLink restaurantId={restaurantId} />
      </div>
      {error ? (
        <p className={styles.error} role="alert">
          {error.message}
        </p>
      ) : null}
      <ReviewSearch
        query={query}
        onQueryChange={setQuery}
        onSearch={search}
        onClear={clearSearch}
        isLoading={isLoading}
      />
      <BurgerReviewsList
        reviews={reviews}
        isLoading={isLoading}
        showReviewImages
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
