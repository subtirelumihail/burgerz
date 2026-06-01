import { HomeBurgers } from "@/components/HomeBurgers/HomeBurgers";

import styles from "./page.module.css";

export default function BurgersPage() {
  return (
    <div className={styles.root}>
      <h1 className={styles.title}>Find your next burger</h1>
      <HomeBurgers />
    </div>
  );
}
