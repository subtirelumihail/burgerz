import Link from "next/link";

import { RestaurantPageContent } from "@/components/RestaurantPage/RestaurantPageContent";

import styles from "./page.module.css";

interface RestaurantPageProps {
  params: Promise<{ id: string }>;
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { id } = await params;

  return (
    <div className={styles.root}>
      <Link href="/" className={styles.back}>
        Back to restaurants
      </Link>
      <RestaurantPageContent restaurantId={id} />
    </div>
  );
}
