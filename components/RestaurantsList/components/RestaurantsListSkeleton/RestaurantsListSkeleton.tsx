import { SkeletonBlock, SkeletonImage, SkeletonLine } from "@/components/basic";

import type { RestaurantsListSkeletonProps } from "./types";

import styles from "./RestaurantsListSkeleton.module.css";

export function RestaurantsListSkeleton({
  count = 3,
}: RestaurantsListSkeletonProps) {
  return (
    <ul className={styles.root} aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <li key={index} className={styles.item}>
          <SkeletonImage size="sm" />
          <div className={styles.content}>
            <SkeletonLine width="twoThirds" />
            <SkeletonLine width="half" />
            <SkeletonBlock />
          </div>
        </li>
      ))}
    </ul>
  );
}
