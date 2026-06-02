import { SkeletonBlock, SkeletonImage, SkeletonLine } from "@/components/basic";

import type { BurgersListSkeletonProps } from "./types";

import styles from "./BurgersListSkeleton.module.css";

export function BurgersListSkeleton({ count = 3 }: BurgersListSkeletonProps) {
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
