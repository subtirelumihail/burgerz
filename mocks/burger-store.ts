import type {
  Burger,
  CreateBurgerRequest,
  GetBurgersResponse,
} from "@/types/burger";
import { DEFAULT_BURGERS_PAGE_SIZE } from "@/types/burger";

import { mockBurgers } from "@/mocks/data/burgers";
import { getRestaurantSummaryById } from "@/mocks/data/restaurants";

const burgers: Burger[] = [...mockBurgers];

interface ListBurgersOptions {
  query?: string | null;
  page?: number;
  pageSize?: number;
}

function createBurgerId(): string {
  return `burger-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function filterBurgers(query?: string | null): Burger[] {
  if (!query) {
    return burgers;
  }

  const normalizedQuery = query.toLowerCase();

  return burgers.filter(
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
  page = 1,
  pageSize = DEFAULT_BURGERS_PAGE_SIZE,
}: ListBurgersOptions = {}): GetBurgersResponse {
  const filtered = filterBurgers(query);
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

export function addBurger(body: CreateBurgerRequest): Burger {
  const restaurant = getRestaurantSummaryById(body.restaurantId);

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  const newBurger: Burger = {
    id: createBurgerId(),
    title: body.title,
    restaurant,
    image: body.image,
    reviewCount: 0,
    reviewScore: 0,
    scores: body.scores,
  };

  burgers.unshift(newBurger);

  return newBurger;
}
