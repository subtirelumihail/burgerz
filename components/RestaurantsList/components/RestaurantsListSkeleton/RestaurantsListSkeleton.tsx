import type { RestaurantsListSkeletonProps } from "./types";

import styles from "./RestaurantsListSkeleton.module.css";

export function RestaurantsListSkeleton({
  count = 3,
}: RestaurantsListSkeletonProps) {
  return (
    <ul className={styles.root} aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <li key={index} className={styles.item}>
          <div className={styles.image} />
          <div className={styles.content}>
            <div className={`${styles.line} ${styles.lineShort}`} />
            <div className={`${styles.line} ${styles.lineMedium}`} />
            <div className={styles.block} />
          </div>
        </li>
      ))}
    </ul>
  );
}
