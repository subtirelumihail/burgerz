import type { BurgersListSkeletonProps } from "./types";

import styles from "./BurgersListSkeleton.module.css";

export function BurgersListSkeleton({ count = 3 }: BurgersListSkeletonProps) {
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
