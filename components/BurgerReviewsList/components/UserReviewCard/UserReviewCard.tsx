import { ImageThumbnail } from "@/components/basic/ImageThumbnail/ImageThumbnail";
import { Review } from "@/components/basic/Review/Review";
import { BurgerScores } from "@/components/BurgersList/components/BurgerScores/BurgerScores";
import { formatReviewDate, toCategoryScores } from "@/lib/utils/reviews.util";

import type { UserReviewCardProps } from "./types";

import styles from "./UserReviewCard.module.css";

export function UserReviewCard({
  review,
  showReviewImage = true,
}: UserReviewCardProps) {
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
          <Review score={review.score} size="sm" label="Overall" />
        </div>
      </header>

      <section
        className={styles.mainReview}
        aria-labelledby={`${review.id}-overall`}
      >
        <h3 id={`${review.id}-overall`} className={styles.sectionHeading}>
          Overall
        </h3>
        <p className={styles.text}>{review.text}</p>
      </section>

      <section
        className={styles.aspects}
        aria-labelledby={`${review.id}-aspects`}
      >
        <BurgerScores scores={toCategoryScores(review.aspects)} decimals={0} />
      </section>

      {showReviewImage && review.image ? (
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
