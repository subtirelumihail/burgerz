import { ImageThumbnail } from "@/components/basic/ImageThumbnail/ImageThumbnail";
import { Review } from "@/components/basic/Review/Review";

import type { UserReviewCardProps } from "./types";

import styles from "./UserReviewCard.module.css";

function formatReviewDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(isoDate));
}

export function UserReviewCard({ review }: UserReviewCardProps) {
  return (
    <article className={styles.root}>
      <header className={styles.header}>
        <div>
          <p className={styles.author}>{review.authorName}</p>
          <time className={styles.date} dateTime={review.createdAt}>
            {formatReviewDate(review.createdAt)}
          </time>
        </div>
        <div className={styles.rating}>
          <Review score={review.score} size="sm" />
        </div>
      </header>
      <p className={styles.text}>{review.text}</p>
      {review.image ? (
        <ImageThumbnail
          image={review.image}
          alt={`Photo from ${review.authorName}'s review`}
          width={200}
          height={150}
          className={styles.imageWrap}
          imageClassName={styles.image}
          sizes="200px"
        />
      ) : null}
    </article>
  );
}
