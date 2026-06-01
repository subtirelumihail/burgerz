import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getRestaurants } from "@/lib/services/restaurant.service";
import { mockImageAsset } from "@/test/mock-image";
import type { Restaurant } from "@/types/restaurant";
import { DEFAULT_RESTAURANTS_PAGE_SIZE } from "@/types/restaurant";

import { useRestaurants } from "./useRestaurants";

vi.mock("@/hooks/useGeolocation", () => ({
  useGeolocation: vi.fn(),
}));

vi.mock("@/lib/services/restaurant.service", () => ({
  getRestaurants: vi.fn(),
}));

const { useGeolocation } = await import("@/hooks/useGeolocation");

const mockRestaurant: Restaurant = {
  id: "restaurant-1",
  name: "Smash Shack",
  image: mockImageAsset,
  location: {
    address: "Strada Lipscani 25, Bucharest, Romania",
    coordinates: { latitude: 44.4319, longitude: 26.1027 },
  },
  openingHours: [{ days: "Mon – Fri", hours: "11:00 – 22:00" }],
};

const mockPaginatedResponse = {
  restaurants: [mockRestaurant],
  pagination: {
    page: 1,
    pageSize: DEFAULT_RESTAURANTS_PAGE_SIZE,
    total: 1,
    totalPages: 1,
  },
};

function TestHarness() {
  const {
    restaurants,
    query,
    setQuery,
    search,
    clearSearch,
    sort,
    setSort,
    pagination,
    goToPage,
    isLoading,
    error,
    needsLocationAccess,
    enableLocation,
  } = useRestaurants();

  return (
    <div>
      <input
        aria-label="Query"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <button
        type="button"
        onClick={() => {
          void search();
        }}
      >
        Search
      </button>
      <button
        type="button"
        onClick={() => {
          void clearSearch();
        }}
      >
        Clear search
      </button>
      <button
        type="button"
        onClick={() => {
          void goToPage(2);
        }}
      >
        Page 2
      </button>
      <button type="button" onClick={() => setSort("name")}>
        Sort by name
      </button>
      <button type="button" onClick={enableLocation}>
        Enable location
      </button>
      <p>Sort: {sort}</p>
      <p>Total pages: {pagination.totalPages}</p>
      {isLoading ? <p role="status">Loading</p> : null}
      {error ? <p role="alert">{error.message}</p> : null}
      {needsLocationAccess ? <p>Needs location access</p> : null}
      <ul>
        {restaurants.map((restaurant) => (
          <li key={restaurant.id}>{restaurant.name}</li>
        ))}
      </ul>
    </div>
  );
}

describe("useRestaurants", () => {
  beforeEach(() => {
    vi.mocked(getRestaurants).mockResolvedValue(mockPaginatedResponse);
    vi.mocked(useGeolocation).mockReturnValue({
      coordinates: { latitude: 44.437, longitude: 26.097 },
      status: "granted",
      isLocationAvailable: true,
      needsLocationAccess: false,
      isLocationPending: false,
      requestLocation: vi.fn(),
    });
  });

  it("loads nearby restaurants when location is available", async () => {
    render(<TestHarness />);

    await waitFor(() => {
      expect(screen.getByText("Smash Shack")).toBeInTheDocument();
    });

    expect(getRestaurants).toHaveBeenCalledWith({
      page: 1,
      pageSize: DEFAULT_RESTAURANTS_PAGE_SIZE,
      sort: "nearby",
      latitude: 44.437,
      longitude: 26.097,
    });
  });

  it("loads name sort after location prompt is dismissed", async () => {
    vi.mocked(useGeolocation).mockReturnValue({
      coordinates: null,
      status: "denied",
      isLocationAvailable: false,
      needsLocationAccess: true,
      isLocationPending: false,
      requestLocation: vi.fn(),
    });

    render(<TestHarness />);

    await waitFor(() => {
      expect(screen.getByText("Smash Shack")).toBeInTheDocument();
    });

    expect(getRestaurants).toHaveBeenCalledWith({
      page: 1,
      pageSize: DEFAULT_RESTAURANTS_PAGE_SIZE,
      sort: "name",
    });
    expect(screen.getByText("Needs location access")).toBeInTheDocument();
  });

  it("searches restaurants by query", async () => {
    const user = userEvent.setup();
    render(<TestHarness />);

    await waitFor(() => {
      expect(screen.getByText("Smash Shack")).toBeInTheDocument();
    });

    await user.type(screen.getByRole("textbox", { name: "Query" }), "coastal");
    await user.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(getRestaurants).toHaveBeenLastCalledWith({
        q: "coastal",
        page: 1,
        pageSize: DEFAULT_RESTAURANTS_PAGE_SIZE,
        sort: "nearby",
        latitude: 44.437,
        longitude: 26.097,
      });
    });
  });
});
