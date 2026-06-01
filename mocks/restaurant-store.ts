import { getDistanceKm } from "@/lib/distance";
import { mockRestaurants } from "@/mocks/data/restaurants";
import type {
  GeoCoordinates,
  GetRestaurantsResponse,
  Restaurant,
  RestaurantSortOption,
} from "@/types/restaurant";
import { DEFAULT_RESTAURANTS_PAGE_SIZE } from "@/types/restaurant";

const restaurants: Restaurant[] = [...mockRestaurants];

interface ListRestaurantsOptions {
  query?: string | null;
  page?: number;
  pageSize?: number;
  sort?: RestaurantSortOption;
  userLocation?: GeoCoordinates | null;
}

function filterRestaurants(query?: string | null): Restaurant[] {
  if (!query) {
    return restaurants;
  }

  const normalizedQuery = query.toLowerCase();

  return restaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(normalizedQuery) ||
      restaurant.location.address.toLowerCase().includes(normalizedQuery),
  );
}

function sortRestaurants(
  items: Restaurant[],
  sort: RestaurantSortOption,
  userLocation?: GeoCoordinates | null,
): Restaurant[] {
  const sorted = [...items];

  if (sort === "nearby" && userLocation) {
    return sorted
      .map((restaurant) => ({
        ...restaurant,
        distanceKm: getDistanceKm(
          userLocation,
          restaurant.location.coordinates,
        ),
      }))
      .sort((left, right) => (left.distanceKm ?? 0) - (right.distanceKm ?? 0));
  }

  if (sort === "name-desc") {
    return sorted.sort((left, right) =>
      right.name.localeCompare(left.name, undefined, { sensitivity: "base" }),
    );
  }

  return sorted.sort((left, right) =>
    left.name.localeCompare(right.name, undefined, { sensitivity: "base" }),
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

function parseCoordinate(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number.parseFloat(value);

  if (Number.isNaN(parsed)) {
    return null;
  }

  return parsed;
}

export function listRestaurants({
  query = null,
  page = 1,
  pageSize = DEFAULT_RESTAURANTS_PAGE_SIZE,
  sort = "name",
  userLocation = null,
}: ListRestaurantsOptions = {}): GetRestaurantsResponse {
  const filtered = filterRestaurants(query);
  const sorted = sortRestaurants(filtered, sort, userLocation);
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    restaurants: sorted.slice(start, start + pageSize),
    pagination: {
      page: safePage,
      pageSize,
      total,
      totalPages,
    },
  };
}

export function parseListRestaurantsParams(
  searchParams: URLSearchParams,
): ListRestaurantsOptions {
  const latitude = parseCoordinate(searchParams.get("latitude"));
  const longitude = parseCoordinate(searchParams.get("longitude"));
  const sortParam = searchParams.get("sort");
  const sort: RestaurantSortOption =
    sortParam === "nearby" || sortParam === "name" || sortParam === "name-desc"
      ? sortParam
      : "name";

  return {
    query: searchParams.get("q"),
    page: parsePositiveInteger(searchParams.get("page"), 1),
    pageSize: parsePositiveInteger(
      searchParams.get("pageSize"),
      DEFAULT_RESTAURANTS_PAGE_SIZE,
    ),
    sort,
    userLocation:
      latitude !== null && longitude !== null ? { latitude, longitude } : null,
  };
}
