import Link from "next/link";

import { RestaurantBurgers } from "@/components/RestaurantBurgers/RestaurantBurgers";
import { RestaurantHero } from "@/components/RestaurantPage/components/RestaurantHero/RestaurantHero";
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
        <Link href="/restaurants" className={styles.back}>
          Back to restaurants
        </Link>
        <h1 className={styles.title}>Restaurant not found</h1>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <Link href="/restaurants" className={styles.back}>
        Back to restaurants
      </Link>
      <RestaurantHero restaurant={restaurant} />
      <RestaurantBurgers restaurantId={restaurant.id} />
    </div>
  );
}
