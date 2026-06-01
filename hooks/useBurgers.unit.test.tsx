import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getBurgers } from "@/lib/services/burger.service";
import { mockImageAsset } from "@/test/mock-image";
import type { Burger } from "@/types/burger";
import { DEFAULT_BURGERS_PAGE_SIZE } from "@/types/burger";

import { useBurgers } from "./useBurgers";

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
  } = useBurgers();

  return (
    <div>
      <input
        aria-label="Query"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <button type="button" onClick={search}>
        Search
      </button>
      <button type="button" onClick={clearSearch}>
        Clear search
      </button>
      <button type="button" onClick={() => goToPage(2)}>
        Page 2
      </button>
      <p>Current page: {page}</p>
      <p>Total pages: {pagination.totalPages}</p>
      {isLoading ? <p role="status">Loading</p> : null}
      {error ? <p role="alert">{error.message}</p> : null}
      <ul>
        {burgers.map((burger) => (
          <li key={burger.id}>{burger.title}</li>
        ))}
      </ul>
    </div>
  );
}

describe("useBurgers", () => {
  beforeEach(() => {
    vi.mocked(getBurgers).mockResolvedValue(mockPaginatedResponse);
  });

  it("loads burgers from the API on mount", async () => {
    render(<TestHarness />);

    expect(screen.getByText("Loading")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Smash Shack Classic")).toBeInTheDocument();
    });

    expect(getBurgers).toHaveBeenCalledWith({
      page: 1,
      pageSize: DEFAULT_BURGERS_PAGE_SIZE,
    });
  });

  it("searches burgers without reloading", async () => {
    const user = userEvent.setup();
    let resolveSearch: (value: typeof mockPaginatedResponse) => void = () =>
      undefined;
    vi.mocked(getBurgers)
      .mockResolvedValueOnce(mockPaginatedResponse)
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveSearch = resolve;
          }),
      );

    render(<TestHarness />);

    await waitFor(() => {
      expect(screen.getByText("Smash Shack Classic")).toBeInTheDocument();
    });

    await user.type(screen.getByRole("textbox", { name: "Query" }), "garden");
    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(screen.getByText("Loading")).toBeInTheDocument();

    resolveSearch({
      burgers: [],
      pagination: {
        page: 1,
        pageSize: DEFAULT_BURGERS_PAGE_SIZE,
        total: 0,
        totalPages: 1,
      },
    });

    await waitFor(() => {
      expect(getBurgers).toHaveBeenLastCalledWith({
        q: "garden",
        page: 1,
        pageSize: DEFAULT_BURGERS_PAGE_SIZE,
      });
    });
  });

  it("clears search and reloads unfiltered burgers", async () => {
    const user = userEvent.setup();
    vi.mocked(getBurgers)
      .mockResolvedValueOnce(mockPaginatedResponse)
      .mockResolvedValueOnce({
        burgers: [],
        pagination: {
          page: 1,
          pageSize: DEFAULT_BURGERS_PAGE_SIZE,
          total: 0,
          totalPages: 1,
        },
      })
      .mockResolvedValueOnce(mockPaginatedResponse);

    render(<TestHarness />);

    await waitFor(() => {
      expect(screen.getByText("Smash Shack Classic")).toBeInTheDocument();
    });

    await user.type(screen.getByRole("textbox", { name: "Query" }), "garden");
    await user.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(getBurgers).toHaveBeenLastCalledWith({
        q: "garden",
        page: 1,
        pageSize: DEFAULT_BURGERS_PAGE_SIZE,
      });
    });

    await user.click(screen.getByRole("button", { name: "Clear search" }));

    await waitFor(() => {
      expect(getBurgers).toHaveBeenLastCalledWith({
        page: 1,
        pageSize: DEFAULT_BURGERS_PAGE_SIZE,
      });
    });

    expect(screen.getByRole("textbox", { name: "Query" })).toHaveValue("");
  });

  it("loads a specific page", async () => {
    const user = userEvent.setup();
    vi.mocked(getBurgers)
      .mockResolvedValueOnce(mockPaginatedResponse)
      .mockResolvedValueOnce({
        burgers: [
          { ...mockBurger, id: "burger-7", title: "Patty Palace Original" },
        ],
        pagination: {
          page: 2,
          pageSize: DEFAULT_BURGERS_PAGE_SIZE,
          total: 12,
          totalPages: 2,
        },
      });

    render(<TestHarness />);

    await waitFor(() => {
      expect(screen.getByText("Smash Shack Classic")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Page 2" }));

    await waitFor(() => {
      expect(screen.getByText("Patty Palace Original")).toBeInTheDocument();
    });

    expect(getBurgers).toHaveBeenLastCalledWith({
      page: 2,
      pageSize: DEFAULT_BURGERS_PAGE_SIZE,
    });
    expect(screen.getByText("Current page: 2")).toBeInTheDocument();
  });

  it("surfaces fetch errors", async () => {
    vi.mocked(getBurgers).mockRejectedValue(new Error("Network error"));

    render(<TestHarness />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Network error");
    });
  });
});
