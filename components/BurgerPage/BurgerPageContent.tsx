"use client";

import { useState } from "react";

import { BurgerReviewsList } from "@/components/BurgerReviewsList/BurgerReviewsList";
import { Pagination } from "@/components/basic/Pagination/Pagination";
import { ReviewSearch } from "@/components/ReviewSearch/ReviewSearch";
import { useBurger } from "@/hooks/useBurger";
import { useBurgerReviews } from "@/hooks/useBurgerReviews";

import { AddReviewLink } from "./components/AddReviewLink/AddReviewLink";
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

  const [heroImageReadyForBurgerId, setHeroImageReadyForBurgerId] = useState<
    string | null
  >(null);

  const error = burgerError ?? reviewsError;
  const isHeroImageReady = heroImageReadyForBurgerId === burgerId;
  const canShowReviewImages =
    !isBurgerLoading && burger !== null && isHeroImageReady;

  if (!isBurgerLoading && !burger && !burgerError) {
    return <p className={styles.notFound}>Burger not found</p>;
  }

  return (
    <div className={styles.root}>
      {isBurgerLoading ? <BurgerHeroSkeleton /> : null}
      {!isBurgerLoading && burger ? (
        <BurgerHero
          burger={burger}
          onHeroImageLoad={() => {
            setHeroImageReadyForBurgerId(burgerId);
          }}
        />
      ) : null}
      {error ? (
        <p className={styles.error} role="alert">
          {error.message}
        </p>
      ) : null}
      <section className={styles.reviewsSection} aria-label="Reviews">
        <div className={styles.reviewsHeader}>
          <h2 className={styles.reviewsHeading}>Customer reviews</h2>
          {!isBurgerLoading && burger ? (
            <AddReviewLink burgerId={burgerId} />
          ) : null}
        </div>
        <ReviewSearch
          query={query}
          onQueryChange={setQuery}
          onSearch={search}
          onClear={clearSearch}
          isLoading={isReviewsLoading}
        />
        <BurgerReviewsList
          reviews={reviews}
          isLoading={isReviewsLoading}
          showReviewImages={canShowReviewImages}
        />
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
