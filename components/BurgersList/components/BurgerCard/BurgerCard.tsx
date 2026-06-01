import Link from "next/link";

import { Review } from "@/components/basic/Review/Review";
import { ThumbnailImage } from "@/components/basic/ThumbnailImage/ThumbnailImage";

import { BurgerScores } from "../BurgerScores/BurgerScores";
import type { BurgerCardProps } from "./types";

import styles from "./BurgerCard.module.css";

export function BurgerCard({ burger, imagePriority = false }: BurgerCardProps) {
  return (
    <article className={styles.root}>
      <Link href={`/burgers/${burger.id}`} className={styles.imageLink}>
        <ThumbnailImage
          src={burger.image.thumbnailUrl}
          alt={burger.title}
          width={96}
          height={96}
          className={styles.imageWrap}
          imageClassName={styles.image}
          priority={imagePriority}
        />
      </Link>
      <div className={styles.content}>
        <header className={styles.header}>
          <h2 className={styles.title}>
            <Link href={`/burgers/${burger.id}`} className={styles.titleLink}>
              {burger.title}
            </Link>
          </h2>
          <Link
            href={`/restaurants/${burger.restaurant.id}`}
            className={styles.restaurant}
          >
            {burger.restaurant.name}
          </Link>
        </header>
        <div className={styles.review}>
          <Review score={burger.reviewScore} reviewCount={burger.reviewCount} />
          <BurgerScores scores={burger.scores} />
        </div>
      </div>
    </article>
  );
}
