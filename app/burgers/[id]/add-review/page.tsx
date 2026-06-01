import { BackLink } from "@/components/basic/BackLink/BackLink";
import { AddReviewPageContent } from "@/components/AddReviewPage/AddReviewPageContent";

import styles from "./page.module.css";

interface AddReviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function AddReviewPage({ params }: AddReviewPageProps) {
  const { id } = await params;

  return (
    <div className={styles.root}>
      <BackLink href={`/burgers/${id}`}>Back to burger</BackLink>
      <AddReviewPageContent burgerId={id} />
    </div>
  );
}
