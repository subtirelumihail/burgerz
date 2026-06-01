"use client";

import { useBurger } from "@/hooks/useBurger";

import { BurgerHeroSkeleton } from "@/components/BurgerPage/components/BurgerHeroSkeleton/BurgerHeroSkeleton";

import { AddReviewBurgerSummary } from "./components/AddReviewBurgerSummary/AddReviewBurgerSummary";
import { AddReviewForm } from "./components/AddReviewForm/AddReviewForm";
import type { AddReviewPageContentProps } from "./types";

import styles from "./AddReviewPageContent.module.css";

export function AddReviewPageContent({ burgerId }: AddReviewPageContentProps) {
  const { burger, isLoading, error } = useBurger(burgerId);

  if (!isLoading && !burger && !error) {
    return <p className={styles.notFound}>Burger not found</p>;
  }

  return (
    <div className={styles.root}>
      {isLoading ? <BurgerHeroSkeleton /> : null}
      {!isLoading && burger ? <AddReviewBurgerSummary burger={burger} /> : null}
      {error ? (
        <p className={styles.error} role="alert">
          {error.message}
        </p>
      ) : null}
      {!isLoading && burger ? (
        <section
          className={styles.formSection}
          aria-labelledby="add-review-heading"
        >
          <h2 id="add-review-heading" className={styles.formHeading}>
            Add your review
          </h2>
          <AddReviewForm burgerId={burgerId} />
        </section>
      ) : null}
    </div>
  );
}
