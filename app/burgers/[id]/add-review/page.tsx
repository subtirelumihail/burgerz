import { BackLink } from "@/components/basic/BackLink/BackLink";
import { AddBurgerReviewPageContent } from "@/components/AddBurgerReviewPage/AddBurgerReviewPageContent";

import styles from "./page.module.css";

interface AddBurgerReviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function AddBurgerReviewPage({
  params,
}: AddBurgerReviewPageProps) {
  const { id } = await params;

  return (
    <div className={styles.root}>
      <BackLink href={`/burgers/${id}`}>Back to burger</BackLink>
      <AddBurgerReviewPageContent burgerId={id} />
    </div>
  );
}
