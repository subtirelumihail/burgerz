import { BackLink } from "@/components/basic/BackLink/BackLink";
import { AddRestaurantReviewPageContent } from "@/components/AddRestaurantReviewPage/AddRestaurantReviewPageContent";

import styles from "./page.module.css";

interface AddRestaurantReviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function AddRestaurantReviewPage({
  params,
}: AddRestaurantReviewPageProps) {
  const { id } = await params;

  return (
    <div className={styles.root}>
      <BackLink href={`/restaurants/${id}`}>Back to restaurant</BackLink>
      <AddRestaurantReviewPageContent restaurantId={id} />
    </div>
  );
}
