import Link from "next/link";

import { Review } from "@/components/basic/Review/Review";
import { ThumbnailImage } from "@/components/basic/ThumbnailImage/ThumbnailImage";
import { BurgerScores } from "@/components/BurgersList/components/BurgerScores/BurgerScores";
import {
  formatRestaurantListItemLabel,
  formatRestaurantThumbnailLabel,
} from "@/lib/a11y/list-item-labels";

import type { RestaurantCardProps } from "../../types";

import styles from "./RestaurantCard.module.css";

function formatDistance(distanceKm?: number): string | null {
  if (distanceKm === undefined) {
    return null;
  }

  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m away`;
  }

  return `${distanceKm.toFixed(1)} km away`;
}

function RestaurantCardContent({
  restaurant,
  usePlainText,
  showDistance = false,
}: {
  restaurant: RestaurantCardProps["restaurant"];
  usePlainText: boolean;
  showDistance?: boolean;
}) {
  const distanceLabel =
    showDistance && restaurant.distanceKm !== undefined
      ? formatDistance(restaurant.distanceKm)
      : null;

  return (
    <div className={styles.content}>
      <header className={styles.header}>
        <h2 className={styles.title}>
          {usePlainText ? (
            <span className={styles.titleLink}>{restaurant.name}</span>
          ) : (
            <Link
              href={`/restaurants/${restaurant.id}`}
              className={styles.titleLink}
            >
              {restaurant.name}
            </Link>
          )}
        </h2>
        <p className={styles.location}>{restaurant.location.address}</p>
        {distanceLabel ? (
          <p className={styles.distance}>{distanceLabel}</p>
        ) : null}
      </header>
      <div className={styles.review}>
        <Review
          score={restaurant.reviewScore}
          reviewCount={restaurant.reviewCount}
        />
        <BurgerScores scores={restaurant.scores} />
      </div>
      <div className={styles.details}>
        <div className={styles.hours}>
          <h3 className={styles.hoursTitle}>Opening times</h3>
          <ul className={styles.hoursList}>
            {restaurant.openingHours.map((entry) => (
              <li
                key={`${entry.days}-${entry.hours}`}
                className={styles.hoursItem}
              >
                <span className={styles.hoursDays}>{entry.days}</span>
                <span className={styles.hoursTime}>{entry.hours}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function RestaurantCard({
  restaurant,
  imagePriority = false,
  listMode = false,
  showDistance = false,
}: RestaurantCardProps) {
  const href = `/restaurants/${restaurant.id}`;

  if (listMode) {
    return (
      <article className={styles.root}>
        <Link
          href={href}
          className={styles.imageLink}
          aria-label={formatRestaurantThumbnailLabel(restaurant)}
        >
          <ThumbnailImage
            src={restaurant.image.thumbnailUrl}
            alt=""
            width={96}
            height={96}
            className={styles.imageWrap}
            imageClassName={styles.image}
            priority={imagePriority}
          />
        </Link>
        <Link
          href={href}
          className={styles.contentLink}
          aria-label={formatRestaurantListItemLabel(restaurant, {
            showDistance,
          })}
        >
          <div aria-hidden="true">
            <RestaurantCardContent
              restaurant={restaurant}
              usePlainText
              showDistance={showDistance}
            />
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className={styles.root}>
      <Link href={href} className={styles.imageLink}>
        <ThumbnailImage
          src={restaurant.image.thumbnailUrl}
          alt={restaurant.name}
          width={96}
          height={96}
          className={styles.imageWrap}
          imageClassName={styles.image}
          priority={imagePriority}
        />
      </Link>
      <RestaurantCardContent
        restaurant={restaurant}
        usePlainText={false}
        showDistance={showDistance}
      />
    </article>
  );
}
