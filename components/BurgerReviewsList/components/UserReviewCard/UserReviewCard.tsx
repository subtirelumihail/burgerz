import { ImageThumbnail } from "@/components/basic/ImageThumbnail/ImageThumbnail";
import { Review } from "@/components/basic/Review/Review";
import { BurgerScores } from "@/components/BurgersList/components/BurgerScores/BurgerScores";
import { formatReviewListItemLabel } from "@/lib/a11y/list-item-labels";
import { formatReviewDate, toCategoryScores } from "@/lib/utils/reviews.util";

import type { UserReviewCardProps } from "./types";

import styles from "./UserReviewCard.module.css";

function ReviewCardContent({
  review,
}: {
  review: UserReviewCardProps["review"];
}) {
  return (
    <>
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
        <h3 id={`${review.id}-aspects`} className={styles.sectionHeading}>
          Aspect scores
        </h3>
        <BurgerScores scores={toCategoryScores(review.aspects)} decimals={0} />
      </section>
    </>
  );
}

export function UserReviewCard({
  review,
  showReviewImage = true,
  listMode = false,
}: UserReviewCardProps) {
  const hasReviewImage = showReviewImage && review.image;

  if (listMode) {
    const summaryId = `${review.id}-summary`;

    return (
      <article className={styles.root}>
        <div
          role="group"
          tabIndex={0}
          aria-labelledby={summaryId}
          className={styles.contentFocus}
        >
          <p id={summaryId} className={styles.srOnly}>
            {formatReviewListItemLabel(review, { includePhotoNote: false })}
          </p>
          <ReviewCardContent review={review} />
        </div>
        {hasReviewImage ? (
          <ImageThumbnail
            image={review.image!}
            alt={`Photo from ${review.authorName}'s review`}
            width={128}
            height={96}
            className={styles.imageWrap}
            imageClassName={styles.image}
            sizes="(max-width: 640px) 128px, 144px"
          />
        ) : null}
      </article>
    );
  }

  return (
    <article className={styles.root}>
      <ReviewCardContent review={review} />
      {hasReviewImage ? (
        <ImageThumbnail
          image={review.image!}
          alt={`Photo from ${review.authorName}'s review`}
          width={128}
          height={96}
          className={styles.imageWrap}
          imageClassName={styles.image}
          sizes="(max-width: 640px) 128px, 144px"
        />
      ) : null}
    </article>
  );
}
