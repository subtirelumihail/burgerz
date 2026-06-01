import { cn } from "@/lib/cn";

import styles from "./List.module.css";
import type { ListProps } from "./types";

export function List<T>({
  items,
  keyExtractor,
  renderItem,
  emptyMessage = "No items found.",
  className,
  ariaLabel,
}: ListProps<T>) {
  if (items.length === 0) {
    return <p className={styles.empty}>{emptyMessage}</p>;
  }

  return (
    <ul className={cn(styles.root, className)} aria-label={ariaLabel}>
      {items.map((item, index) => (
        <li key={keyExtractor(item)} className={styles.item}>
          {renderItem(item, index)}
        </li>
      ))}
    </ul>
  );
}
