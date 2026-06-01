import Link from "next/link";

import { AddReviewPageContent } from "@/components/AddReviewPage/AddReviewPageContent";

import styles from "./page.module.css";

interface AddReviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function AddReviewPage({ params }: AddReviewPageProps) {
  const { id } = await params;

  return (
    <div className={styles.root}>
      <Link href={`/burgers/${id}`} className={styles.back}>
        Back to burger
      </Link>
      <AddReviewPageContent burgerId={id} />
    </div>
  );
}
