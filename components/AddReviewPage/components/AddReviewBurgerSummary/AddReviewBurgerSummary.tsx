import Link from "next/link";

import { ImageThumbnail } from "@/components/basic/ImageThumbnail/ImageThumbnail";

import type { AddReviewBurgerSummaryProps } from "./types";

import styles from "./AddReviewBurgerSummary.module.css";

export function AddReviewBurgerSummary({
  burger,
}: AddReviewBurgerSummaryProps) {
  return (
    <header className={styles.root}>
      <ImageThumbnail
        image={burger.image}
        alt={burger.title}
        width={160}
        height={160}
        className={styles.imageWrap}
        imageClassName={styles.image}
        priority
        sizes="(max-width: 640px) 112px, 160px"
      />
      <div className={styles.content}>
        <div className={styles.intro}>
          <h1 className={styles.title}>{burger.title}</h1>
          <Link
            href={`/restaurants/${burger.restaurant.id}`}
            className={styles.restaurant}
          >
            {burger.restaurant.name}
          </Link>
        </div>
      </div>
    </header>
  );
}
