"use client";

import { useCallback, useEffect, useState } from "react";

import { getBurgers } from "@/lib/services/burger.service";
import type { PaginationMeta } from "@/types/api";
import type { Burger } from "@/types/burger";
import { DEFAULT_BURGERS_PAGE_SIZE } from "@/types/burger";

interface UseBurgersResult {
  burgers: Burger[];
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
  pageSize: DEFAULT_BURGERS_PAGE_SIZE,
  total: 0,
  totalPages: 1,
};

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error("Failed to load burgers");
}

export function useBurgers(): UseBurgersResult {
  const [burgers, setBurgers] = useState<Burger[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] =
    useState<PaginationMeta>(defaultPagination);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadBurgers = useCallback(async (q?: string, nextPage = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getBurgers({
        q,
        page: nextPage,
        pageSize: DEFAULT_BURGERS_PAGE_SIZE,
      });
      setBurgers(response.burgers);
      setPagination(response.pagination);
      setPage(response.pagination.page);
    } catch (err) {
      setError(toError(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;

    getBurgers({ page: 1, pageSize: DEFAULT_BURGERS_PAGE_SIZE })
      .then((response) => {
        if (!isCancelled) {
          setBurgers(response.burgers);
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
  }, []);

  const search = useCallback(() => {
    const trimmedQuery = query.trim();
    void loadBurgers(trimmedQuery || undefined, 1);
  }, [loadBurgers, query]);

  const clearSearch = useCallback(() => {
    setQuery("");
    void loadBurgers(undefined, 1);
  }, [loadBurgers]);

  const goToPage = useCallback(
    (nextPage: number) => {
      const trimmedQuery = query.trim();
      void loadBurgers(trimmedQuery || undefined, nextPage);
    },
    [loadBurgers, query],
  );

  return {
    burgers,
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
