import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getBurgers } from "@/lib/services/burger.service";
import { mockImageAsset } from "@/test/mock-image";
import type { Burger } from "@/types/burger";
import { DEFAULT_BURGERS_PAGE_SIZE } from "@/types/burger";

import { useRestaurantBurgers } from "./useRestaurantBurgers";

vi.mock("@/lib/services/burger.service", () => ({
  getBurgers: vi.fn(),
}));

const mockBurger: Burger = {
  id: "burger-1",
  title: "Smash Shack Classic",
  restaurant: { id: "restaurant-1", name: "Smash Shack" },
  image: mockImageAsset,
  reviewCount: 10,
  reviewScore: 4.5,
  scores: {
    taste: 4.5,
    texture: 4.5,
    visualPresentation: 4.5,
  },
};

const mockPaginatedResponse = {
  burgers: [mockBurger],
  pagination: {
    page: 1,
    pageSize: DEFAULT_BURGERS_PAGE_SIZE,
    total: 1,
    totalPages: 1,
  },
};

function TestHarness() {
  const {
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
  } = useRestaurantBurgers("restaurant-1");

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
      <p data-testid="count">{burgers.length}</p>
      <p data-testid="page">{page}</p>
      <p data-testid="total-pages">{pagination.totalPages}</p>
      <p data-testid="loading">{String(isLoading)}</p>
      <p data-testid="error">{error?.message ?? ""}</p>
    </div>
  );
}

describe("useRestaurantBurgers", () => {
  beforeEach(() => {
    vi.mocked(getBurgers).mockResolvedValue(mockPaginatedResponse);
  });

  it("loads burgers for the restaurant on mount", async () => {
    render(<TestHarness />);

    await waitFor(() => {
      expect(screen.getByTestId("count")).toHaveTextContent("1");
    });

    expect(getBurgers).toHaveBeenCalledWith({
      restaurantId: "restaurant-1",
      page: 1,
      pageSize: DEFAULT_BURGERS_PAGE_SIZE,
    });
  });

  it("searches burgers within the restaurant", async () => {
    const user = userEvent.setup();
    render(<TestHarness />);

    await waitFor(() => {
      expect(screen.getByTestId("count")).toHaveTextContent("1");
    });

    await user.type(screen.getByLabelText("Query"), "classic");
    await user.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(getBurgers).toHaveBeenCalledWith({
        restaurantId: "restaurant-1",
        q: "classic",
        page: 1,
        pageSize: DEFAULT_BURGERS_PAGE_SIZE,
      });
    });
  });

  it("clears search and reloads restaurant burgers", async () => {
    const user = userEvent.setup();
    render(<TestHarness />);

    await waitFor(() => {
      expect(screen.getByTestId("count")).toHaveTextContent("1");
    });

    await user.type(screen.getByLabelText("Query"), "classic");
    await user.click(screen.getByRole("button", { name: "Clear search" }));

    await waitFor(() => {
      expect(getBurgers).toHaveBeenLastCalledWith({
        restaurantId: "restaurant-1",
        page: 1,
        pageSize: DEFAULT_BURGERS_PAGE_SIZE,
      });
    });
    expect(screen.getByLabelText("Query")).toHaveValue("");
  });
});
