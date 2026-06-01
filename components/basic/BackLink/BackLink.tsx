import Link from "next/link";
import { FiChevronLeft } from "react-icons/fi";

import type { BackLinkProps } from "./types";

import styles from "./BackLink.module.css";

export function BackLink({ children, ...linkProps }: BackLinkProps) {
  return (
    <Link {...linkProps} className={styles.root}>
      <FiChevronLeft className={styles.icon} aria-hidden />
      {children}
    </Link>
  );
}
