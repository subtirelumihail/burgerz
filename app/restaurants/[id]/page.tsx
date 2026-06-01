import { BackLink } from "@/components/basic/BackLink/BackLink";
import { RestaurantPageContent } from "@/components/RestaurantPage/RestaurantPageContent";

import styles from "./page.module.css";

interface RestaurantPageProps {
  params: Promise<{ id: string }>;
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { id } = await params;

  return (
    <div className={styles.root}>
      <BackLink href="/">Back to restaurants</BackLink>
      <RestaurantPageContent restaurantId={id} />
    </div>
  );
}
