"use client";

import { useCallback, useEffect, useState } from "react";

import { getBurgerReviews } from "@/lib/services/review.service";
import type { PaginationMeta } from "@/types/api";
import type { BurgerUserReview } from "@/types/review";
import { DEFAULT_REVIEWS_PAGE_SIZE } from "@/types/review";

interface UseBurgerReviewsResult {
  reviews: BurgerUserReview[];
  query: string;
  setQuery: (query: string) => void;
  search: () => void;
  clearSearch: () => void;
  page: number;
  pagination: PaginationMeta;
  goToPage: (page: number) => void;
  isLoading: boolean;
  error: Error | null;
}

const defaultPagination: PaginationMeta = {
  page: 1,
  pageSize: DEFAULT_REVIEWS_PAGE_SIZE,
  total: 0,
  totalPages: 1,
};

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error("Failed to load reviews");
}

export function useBurgerReviews(burgerId: string): UseBurgerReviewsResult {
  const [reviews, setReviews] = useState<BurgerUserReview[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] =
    useState<PaginationMeta>(defaultPagination);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadReviews = useCallback(
    async (q?: string, nextPage = 1) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getBurgerReviews(burgerId, {
          q,
          page: nextPage,
          pageSize: DEFAULT_REVIEWS_PAGE_SIZE,
        });
        setReviews(response.reviews);
        setPagination(response.pagination);
        setPage(response.pagination.page);
      } catch (err) {
        setError(toError(err));
      } finally {
        setIsLoading(false);
      }
    },
    [burgerId],
  );

  useEffect(() => {
    let isCancelled = false;

    getBurgerReviews(burgerId, {
      page: 1,
      pageSize: DEFAULT_REVIEWS_PAGE_SIZE,
    })
      .then((response) => {
        if (!isCancelled) {
          setReviews(response.reviews);
          setPagination(response.pagination);
          setPage(response.pagination.page);
          setError(null);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          setError(toError(err));
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [burgerId]);

  const search = useCallback(() => {
    const trimmedQuery = query.trim();
    void loadReviews(trimmedQuery || undefined, 1);
  }, [loadReviews, query]);

  const clearSearch = useCallback(() => {
    setQuery("");
    void loadReviews(undefined, 1);
  }, [loadReviews]);

  const goToPage = useCallback(
    (nextPage: number) => {
      const trimmedQuery = query.trim();
      void loadReviews(trimmedQuery || undefined, nextPage);
    },
    [loadReviews, query],
  );

  return {
    reviews,
    query,
    setQuery,
    search,
    clearSearch,
    page,
    pagination,
    goToPage,
    isLoading,
    error,
  };
}
