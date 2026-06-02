import { SkeletonBlock, SkeletonImage, SkeletonLine } from "@/components/basic";

import type { BurgerReviewsListSkeletonProps } from "./types";

import styles from "./BurgerReviewsListSkeleton.module.css";

export function BurgerReviewsListSkeleton({
  count = 3,
}: BurgerReviewsListSkeletonProps) {
  return (
    <ul className={styles.root} aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <li key={index} className={styles.item}>
          <SkeletonLine width="third" />
          <SkeletonLine width="half" />
          <SkeletonBlock height="md" />
          {index % 2 === 0 ? <SkeletonImage size="fluid" /> : null}
        </li>
      ))}
    </ul>
  );
}
