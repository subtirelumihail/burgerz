"use client";

import { cn } from "@/lib/cn";

import styles from "./Pagination.module.css";
import type { PaginationProps } from "./types";

interface PaginationItem {
  type: "page" | "ellipsis";
  page?: number;
  key: string;
}

function buildPaginationItems(
  page: number,
  totalPages: number,
): PaginationItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => ({
      type: "page" as const,
      page: index + 1,
      key: `page-${index + 1}`,
    }));
  }

  const items: PaginationItem[] = [{ type: "page", page: 1, key: "page-1" }];

  if (page > 3) {
    items.push({ type: "ellipsis", key: "ellipsis-start" });
  }

  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  for (let currentPage = start; currentPage <= end; currentPage += 1) {
    items.push({
      type: "page",
      page: currentPage,
      key: `page-${currentPage}`,
    });
  }

  if (page < totalPages - 2) {
    items.push({ type: "ellipsis", key: "ellipsis-end" });
  }

  items.push({
    type: "page",
    page: totalPages,
    key: `page-${totalPages}`,
  });

  return items;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  isLoading = false,
  className,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const items = buildPaginationItems(page, totalPages);
  const isPreviousDisabled = isLoading || page <= 1;
  const isNextDisabled = isLoading || page >= totalPages;

  return (
    <nav className={cn(styles.root, className)} aria-label="Pagination">
      <button
        type="button"
        className={styles.pageButton}
        onClick={() => onPageChange(page - 1)}
        disabled={isPreviousDisabled}
        aria-label="Go to previous page"
      >
        Previous
      </button>

      {items.map((item) => {
        if (item.type === "ellipsis") {
          return (
            <span key={item.key} className={styles.ellipsis} aria-hidden>
              …
            </span>
          );
        }

        const isActive = item.page === page;

        return (
          <button
            key={item.key}
            type="button"
            className={cn(
              styles.pageButton,
              isActive && styles.pageButtonActive,
            )}
            onClick={() => {
              if (item.page) {
                onPageChange(item.page);
              }
            }}
            disabled={isLoading || isActive}
            aria-label={`Go to page ${item.page}`}
            aria-current={isActive ? "page" : undefined}
          >
            {item.page}
          </button>
        );
      })}

      <button
        type="button"
        className={styles.pageButton}
        onClick={() => onPageChange(page + 1)}
        disabled={isNextDisabled}
        aria-label="Go to next page"
      >
        Next
      </button>
    </nav>
  );
}
