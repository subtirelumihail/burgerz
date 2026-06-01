import styles from "./BurgerHeroSkeleton.module.css";

export function BurgerHeroSkeleton() {
  return (
    <div className={styles.root} aria-hidden>
      <div className={styles.primary}>
        <div className={styles.image} />
        <div className={styles.details}>
          <div className={styles.intro}>
            <div className={`${styles.line} ${styles.lineShort}`} />
            <div className={`${styles.line} ${styles.lineMedium}`} />
          </div>
          <div className={styles.metrics}>
            <div className={`${styles.line} ${styles.lineMedium}`} />
            <div className={styles.block} />
          </div>
        </div>
      </div>
    </div>
  );
}
