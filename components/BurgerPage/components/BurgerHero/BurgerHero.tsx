import Link from "next/link";

import { ImageThumbnail } from "@/components/basic/ImageThumbnail/ImageThumbnail";
import { Review } from "@/components/basic/Review/Review";
import { BurgerScores } from "@/components/BurgersList/components/BurgerScores/BurgerScores";

import type { BurgerHeroProps } from "./types";

import styles from "./BurgerHero.module.css";

export function BurgerHero({ burger }: BurgerHeroProps) {
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
        sizes="160px"
      />
      <div className={styles.content}>
        <h1 className={styles.title}>{burger.title}</h1>
        <Link
          href={`/restaurants/${burger.restaurant.id}`}
          className={styles.restaurant}
        >
          {burger.restaurant.name}
        </Link>
        <div className={styles.review}>
          <Review score={burger.reviewScore} reviewCount={burger.reviewCount} />
          <BurgerScores scores={burger.scores} />
        </div>
      </div>
    </header>
  );
}
