"use client";

import { useRestaurant } from "@/hooks/useRestaurant";

import { RestaurantHero } from "@/components/RestaurantPage/components/RestaurantHero/RestaurantHero";
import { AddRestaurantReviewForm } from "./components/AddRestaurantReviewForm/AddRestaurantReviewForm";
import type { AddRestaurantReviewPageContentProps } from "./types";

import styles from "./AddRestaurantReviewPageContent.module.css";

export function AddRestaurantReviewPageContent({
  restaurantId,
}: AddRestaurantReviewPageContentProps) {
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
        <section
          className={styles.formSection}
          aria-labelledby="add-restaurant-review-heading"
        >
          <h2 id="add-restaurant-review-heading" className={styles.formHeading}>
            Add your review
          </h2>
          <AddRestaurantReviewForm restaurantId={restaurantId} />
        </section>
      ) : null}
    </div>
  );
}
