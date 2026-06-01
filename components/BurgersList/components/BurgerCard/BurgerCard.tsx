import Link from "next/link";

import { Review } from "@/components/basic/Review/Review";
import { buildBurgerDetailPath } from "@/lib/burger-navigation";
import { ThumbnailImage } from "@/components/basic/ThumbnailImage/ThumbnailImage";
import {
  formatBurgerListItemLabel,
  formatBurgerThumbnailLabel,
} from "@/lib/a11y/list-item-labels";

import { BurgerScores } from "../BurgerScores/BurgerScores";
import type { BurgerCardProps } from "./types";

import styles from "./BurgerCard.module.css";

function BurgerCardContent({
  burger,
  burgerDetailPath,
  usePlainText,
  showRestaurant = true,
  embedded = false,
}: {
  burger: BurgerCardProps["burger"];
  burgerDetailPath: string;
  usePlainText: boolean;
  showRestaurant?: boolean;
  embedded?: boolean;
}) {
  const title = burger.title;
  const restaurantName = burger.restaurant.name;

  const body = (
    <>
      <header className={styles.header}>
        {showRestaurant ? (
          usePlainText ? (
            <span className={styles.restaurant}>{restaurantName}</span>
          ) : (
            <Link
              href={`/restaurants/${burger.restaurant.id}`}
              className={styles.restaurant}
            >
              {restaurantName}
            </Link>
          )
        ) : null}
        <h2 className={styles.title}>
          {usePlainText ? (
            <span className={styles.titleLink}>{title}</span>
          ) : (
            <Link href={burgerDetailPath} className={styles.titleLink}>
              {title}
            </Link>
          )}
        </h2>
      </header>
      <div className={styles.review}>
        <Review score={burger.reviewScore} reviewCount={burger.reviewCount} />
        <BurgerScores scores={burger.scores} />
      </div>
    </>
  );

  if (embedded) {
    return body;
  }

  return <div className={styles.content}>{body}</div>;
}

export function BurgerCard({
  burger,
  imagePriority = false,
  listMode = false,
  returnTo,
  showRestaurant = true,
}: BurgerCardProps) {
  const href = buildBurgerDetailPath(burger.id, returnTo);

  if (listMode) {
    return (
      <article className={styles.root}>
        <Link
          href={href}
          className={styles.imageLink}
          aria-label={formatBurgerThumbnailLabel(burger)}
        >
          <ThumbnailImage
            src={burger.image.thumbnailUrl}
            alt=""
            width={96}
            height={96}
            className={styles.imageWrap}
            imageClassName={styles.image}
            priority={imagePriority}
          />
        </Link>
        <div className={`${styles.content} ${styles.listContent}`}>
          {showRestaurant ? (
            <Link
              href={`/restaurants/${burger.restaurant.id}`}
              className={styles.restaurant}
            >
              {burger.restaurant.name}
            </Link>
          ) : null}
          <Link
            href={href}
            className={styles.contentLink}
            aria-label={formatBurgerListItemLabel(burger)}
          >
            <div aria-hidden="true" className={styles.contentLinkBody}>
              <BurgerCardContent
                burger={burger}
                burgerDetailPath={href}
                usePlainText
                showRestaurant={false}
                embedded
              />
            </div>
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className={styles.root}>
      <Link href={href} className={styles.imageLink}>
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
      <BurgerCardContent
        burger={burger}
        burgerDetailPath={href}
        usePlainText={false}
        showRestaurant={showRestaurant}
      />
    </article>
  );
}
