import type { BurgerReviewsListSkeletonProps } from "./types";

import styles from "./BurgerReviewsListSkeleton.module.css";

export function BurgerReviewsListSkeleton({
  count = 3,
}: BurgerReviewsListSkeletonProps) {
  return (
    <ul className={styles.root} aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <li key={index} className={styles.item}>
          <div className={`${styles.line} ${styles.lineShort}`} />
          <div className={`${styles.line} ${styles.lineMedium}`} />
          <div className={styles.block} />
          {index % 2 === 0 ? <div className={styles.image} /> : null}
        </li>
      ))}
    </ul>
  );
}
