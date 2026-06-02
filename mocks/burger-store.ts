import type { Burger, GetBurgersResponse } from "@/types/burger";
import { DEFAULT_BURGERS_PAGE_SIZE } from "@/types/burger";

import { mockBurgers } from "@/mocks/data/burgers";

const burgers: Burger[] = [...mockBurgers];

interface ListBurgersOptions {
  query?: string | null;
  restaurantId?: string | null;
  page?: number;
  pageSize?: number;
}

function filterBurgers(
  query?: string | null,
  restaurantId?: string | null,
): Burger[] {
  let filtered = burgers;

  if (restaurantId) {
    filtered = filtered.filter(
      (burger) => burger.restaurant.id === restaurantId,
    );
  }

  if (!query) {
    return filtered;
  }

  const normalizedQuery = query.toLowerCase();

  return filtered.filter(
    (burger) =>
      burger.title.toLowerCase().includes(normalizedQuery) ||
      burger.restaurant.name.toLowerCase().includes(normalizedQuery),
  );
}

function parsePositiveInteger(value: string | null, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
}

export function listBurgers({
  query = null,
  restaurantId = null,
  page = 1,
  pageSize = DEFAULT_BURGERS_PAGE_SIZE,
}: ListBurgersOptions = {}): GetBurgersResponse {
  const filtered = filterBurgers(query, restaurantId);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    burgers: filtered.slice(start, start + pageSize),
    pagination: {
      page: safePage,
      pageSize,
      total,
      totalPages,
    },
  };
}

export function parseListBurgersParams(
  searchParams: URLSearchParams,
): ListBurgersOptions {
  return {
    query: searchParams.get("q"),
    restaurantId: searchParams.get("restaurantId"),
    page: parsePositiveInteger(searchParams.get("page"), 1),
    pageSize: parsePositiveInteger(
      searchParams.get("pageSize"),
      DEFAULT_BURGERS_PAGE_SIZE,
    ),
  };
}

export function getBurgerById(id: string): Burger | null {
  return burgers.find((burger) => burger.id === id) ?? null;
}
