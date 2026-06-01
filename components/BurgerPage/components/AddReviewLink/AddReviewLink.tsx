import Link from "next/link";
import { FiEdit3 } from "react-icons/fi";

import { cn } from "@/lib/cn";

import type { AddReviewLinkProps } from "./types";

import buttonStyles from "@/components/basic/Button/Button.module.css";
import styles from "./AddReviewLink.module.css";

export function AddReviewLink({ burgerId }: AddReviewLinkProps) {
  return (
    <div className={styles.root}>
      <Link
        href={`/burgers/${burgerId}/add-review`}
        className={cn(buttonStyles.root, styles.link)}
      >
        <FiEdit3 className={buttonStyles.icon} aria-hidden />
        <span>Add Review</span>
      </Link>
    </div>
  );
}
