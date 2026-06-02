import Link from "next/link";
import { FiEdit3 } from "react-icons/fi";

import { cn } from "@/lib/cn";

import type { AddRestaurantReviewLinkProps } from "./types";

import buttonStyles from "@/components/basic/Button/Button.module.css";
import styles from "./AddReviewLink.module.css";

export function AddReviewLink({ restaurantId }: AddRestaurantReviewLinkProps) {
  return (
    <div className={styles.root}>
      <Link
        href={`/restaurants/${restaurantId}/add-review`}
        className={cn(buttonStyles.root, styles.link)}
      >
        <FiEdit3 className={buttonStyles.icon} aria-hidden />
        <span>Add Review</span>
      </Link>
    </div>
  );
}
