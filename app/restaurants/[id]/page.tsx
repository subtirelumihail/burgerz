import Link from "next/link";

import { getRestaurantById } from "@/mocks/data/restaurants";

import styles from "./page.module.css";

interface RestaurantPageProps {
  params: Promise<{ id: string }>;
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { id } = await params;
  const restaurant = getRestaurantById(id);

  if (!restaurant) {
    return (
      <div className={styles.root}>
        <Link href="/" className={styles.back}>
          Back to search
        </Link>
        <h1 className={styles.title}>Restaurant not found</h1>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <Link href="/" className={styles.back}>
        Back to search
      </Link>
      <h1 className={styles.title}>{restaurant.name}</h1>
      <p className={styles.message}>Restaurant page coming soon.</p>
    </div>
  );
}
