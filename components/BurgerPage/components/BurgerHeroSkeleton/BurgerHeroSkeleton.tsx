import { SkeletonBlock, SkeletonImage, SkeletonLine } from "@/components/basic";

import styles from "./BurgerHeroSkeleton.module.css";

export function BurgerHeroSkeleton() {
  return (
    <div className={styles.root} aria-hidden>
      <div className={styles.primary}>
        <SkeletonImage size="md" className={styles.image} />
        <div className={styles.details}>
          <SkeletonLine width="half" />
          <div className={styles.summary}>
            <SkeletonLine width="threeQuarters" height="lg" />
            <SkeletonLine width="half" />
            <SkeletonBlock />
          </div>
        </div>
      </div>
    </div>
  );
}
