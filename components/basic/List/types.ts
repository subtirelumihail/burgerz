import type { ReactNode } from "react";

export interface ListProps<T> {
  items: T[];
  keyExtractor: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  getItemHref?: (item: T) => string;
  getItemLabel?: (item: T) => string;
  emptyMessage?: string;
  className?: string;
  ariaLabel?: string;
}
