"use client";

import { useBurger } from "@/hooks/useBurger";

import { BurgerHero } from "@/components/BurgerPage/components/BurgerHero/BurgerHero";
import { BurgerHeroSkeleton } from "@/components/BurgerPage/components/BurgerHeroSkeleton/BurgerHeroSkeleton";
import { AddBurgerReviewForm } from "./components/AddBurgerReviewForm/AddBurgerReviewForm";
import type { AddBurgerReviewPageContentProps } from "./types";

import styles from "./AddBurgerReviewPageContent.module.css";

export function AddBurgerReviewPageContent({
  burgerId,
}: AddBurgerReviewPageContentProps) {
  const { burger, isLoading, error } = useBurger(burgerId);

  if (!isLoading && !burger && !error) {
    return <p className={styles.notFound}>Burger not found</p>;
  }

  return (
    <div className={styles.root}>
      {isLoading ? <BurgerHeroSkeleton /> : null}
      {!isLoading && burger ? <BurgerHero burger={burger} /> : null}
      {error ? (
        <p className={styles.error} role="alert">
          {error.message}
        </p>
      ) : null}
      {!isLoading && burger ? (
        <section
          className={styles.formSection}
          aria-labelledby="add-burger-review-heading"
        >
          <h2 id="add-burger-review-heading" className={styles.formHeading}>
            Add your review
          </h2>
          <AddBurgerReviewForm burgerId={burgerId} />
        </section>
      ) : null}
    </div>
  );
}
