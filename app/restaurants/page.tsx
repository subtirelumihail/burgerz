import { HomeRestaurants } from "@/components/HomeRestaurants/HomeRestaurants";

import styles from "./page.module.css";

export default function RestaurantsPage() {
  return (
    <div className={styles.root}>
      <h1 className={styles.title}>Find your next spot</h1>
      <HomeRestaurants />
    </div>
  );
}
