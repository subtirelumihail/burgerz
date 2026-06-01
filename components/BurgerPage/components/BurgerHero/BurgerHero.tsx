import Link from "next/link";

import { ImageThumbnail } from "@/components/basic/ImageThumbnail/ImageThumbnail";
import { Review } from "@/components/basic/Review/Review";
import { BurgerScores } from "@/components/BurgersList/components/BurgerScores/BurgerScores";
import { formatBurgerSummaryLabel } from "@/lib/a11y/list-item-labels";

import type { BurgerHeroProps } from "./types";

import styles from "./BurgerHero.module.css";

export function BurgerHero({ burger, onHeroImageLoad }: BurgerHeroProps) {
  const summaryId = `${burger.id}-summary`;

  return (
    <header className={styles.root}>
      <div className={styles.primary}>
        <ImageThumbnail
          image={burger.image}
          alt={burger.title}
          width={192}
          height={192}
          className={styles.imageWrap}
          imageClassName={styles.image}
          priority
          sizes="(max-width: 640px) 160px, 192px"
          onImageLoad={onHeroImageLoad}
        />
        <div className={styles.details}>
          <Link
            href={`/restaurants/${burger.restaurant.id}`}
            className={styles.restaurant}
          >
            {burger.restaurant.name}
          </Link>
          <div
            role="group"
            tabIndex={0}
            aria-labelledby={summaryId}
            className={styles.summaryFocus}
          >
            <p id={summaryId} className={styles.srOnly}>
              {formatBurgerSummaryLabel(burger)}
            </p>
            <h1 className={styles.title}>{burger.title}</h1>
            <div className={styles.metrics}>
              <Review
                score={burger.reviewScore}
                reviewCount={burger.reviewCount}
              />
              <BurgerScores scores={burger.scores} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
