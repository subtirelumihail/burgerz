import type { ReactNode } from "react";

export interface ListProps<T> {
  items: T[];
  keyExtractor: (item: T) => string;
  renderItem: (item: T, index: number) => ReactNode;
  emptyMessage?: string;
  className?: string;
  ariaLabel?: string;
}
