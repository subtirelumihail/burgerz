import Link from "next/link";

import { cn } from "@/lib/cn";

import styles from "./List.module.css";
import type { ListProps } from "./types";

export function List<T>({
  items,
  keyExtractor,
  renderItem,
  getItemHref,
  getItemLabel,
  emptyMessage = "No items found.",
  className,
  ariaLabel,
}: ListProps<T>) {
  if (items.length === 0) {
    return <p className={styles.empty}>{emptyMessage}</p>;
  }

  return (
    <ul className={cn(styles.root, className)} aria-label={ariaLabel}>
      {items.map((item, index) => {
        const content = renderItem(item, index);

        if (!getItemHref) {
          return (
            <li key={keyExtractor(item)} className={styles.item}>
              {content}
            </li>
          );
        }

        const href = getItemHref(item);
        const label = getItemLabel?.(item);

        return (
          <li key={keyExtractor(item)} className={styles.item}>
            <Link href={href} className={styles.link} aria-label={label}>
              {content}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
