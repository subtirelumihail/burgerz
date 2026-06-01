import { ImageThumbnail } from "@/components/basic/ImageThumbnail/ImageThumbnail";
import { Review } from "@/components/basic/Review/Review";
import { BurgerScores } from "@/components/BurgersList/components/BurgerScores/BurgerScores";
import { formatRestaurantSummaryLabel } from "@/lib/a11y/list-item-labels";

import type { RestaurantHeroProps } from "./types";

import styles from "./RestaurantHero.module.css";

export function RestaurantHero({ restaurant }: RestaurantHeroProps) {
  const summaryId = `${restaurant.id}-summary`;

  return (
    <header className={styles.root}>
      <div className={styles.primary}>
        <ImageThumbnail
          image={restaurant.image}
          alt={restaurant.name}
          width={160}
          height={160}
          className={styles.imageWrap}
          imageClassName={styles.image}
          priority
          sizes="(max-width: 640px) 112px, 160px"
        />
        <div className={styles.details}>
          <div
            role="group"
            tabIndex={0}
            aria-labelledby={summaryId}
            className={styles.summaryFocus}
          >
            <p id={summaryId} className={styles.srOnly}>
              {formatRestaurantSummaryLabel(restaurant)}
            </p>
            <div className={styles.intro}>
              <h1 className={styles.title}>{restaurant.name}</h1>
              <p className={styles.location}>{restaurant.location.address}</p>
            </div>
            <div className={styles.metrics}>
              <Review
                score={restaurant.reviewScore}
                reviewCount={restaurant.reviewCount}
              />
              <BurgerScores scores={restaurant.scores} />
            </div>
          </div>
          <div className={styles.meta}>
            <div className={styles.hours}>
              <h2 className={styles.hoursTitle}>Opening times</h2>
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
      </div>
    </header>
  );
}
