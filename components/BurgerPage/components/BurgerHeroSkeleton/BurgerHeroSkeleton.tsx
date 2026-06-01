import styles from "./BurgerHeroSkeleton.module.css";

export function BurgerHeroSkeleton() {
  return (
    <div className={styles.root} aria-hidden>
      <div className={styles.image} />
      <div className={styles.content}>
        <div className={`${styles.line} ${styles.lineShort}`} />
        <div className={`${styles.line} ${styles.lineMedium}`} />
        <div className={styles.block} />
      </div>
    </div>
  );
}
