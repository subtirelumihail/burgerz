import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getBurgerReviews } from "@/lib/services/review.service";
import { DEFAULT_REVIEWS_PAGE_SIZE } from "@/types/review";
import { mockBurgerUserReview } from "@/test/mock-review";

import { useBurgerReviews } from "./useBurgerReviews";

vi.mock("@/lib/services/review.service", () => ({
  getBurgerReviews: vi.fn(),
}));

const mockReview = mockBurgerUserReview;

const mockPaginatedResponse = {
  reviews: [mockReview],
  pagination: {
    page: 1,
    pageSize: DEFAULT_REVIEWS_PAGE_SIZE,
    total: 1,
    totalPages: 1,
  },
};

function TestHarness() {
  const {
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
  } = useBurgerReviews("burger-1");

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
        {reviews.map((review) => (
          <li key={review.id}>{review.authorName}</li>
        ))}
      </ul>
    </div>
  );
}

describe("useBurgerReviews", () => {
  beforeEach(() => {
    vi.mocked(getBurgerReviews).mockResolvedValue(mockPaginatedResponse);
  });

  it("loads reviews from the API on mount", async () => {
    render(<TestHarness />);

    expect(screen.getByText("Loading")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Alex Rivera")).toBeInTheDocument();
    });

    expect(getBurgerReviews).toHaveBeenCalledWith("burger-1", {
      page: 1,
      pageSize: DEFAULT_REVIEWS_PAGE_SIZE,
    });
  });

  it("searches reviews", async () => {
    const user = userEvent.setup();
    vi.mocked(getBurgerReviews)
      .mockResolvedValueOnce(mockPaginatedResponse)
      .mockResolvedValueOnce({
        reviews: [],
        pagination: {
          page: 1,
          pageSize: DEFAULT_REVIEWS_PAGE_SIZE,
          total: 0,
          totalPages: 1,
        },
      });

    render(<TestHarness />);

    await waitFor(() => {
      expect(screen.getByText("Alex Rivera")).toBeInTheDocument();
    });

    await user.type(screen.getByRole("textbox", { name: "Query" }), "juicy");
    await user.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(getBurgerReviews).toHaveBeenLastCalledWith("burger-1", {
        q: "juicy",
        page: 1,
        pageSize: DEFAULT_REVIEWS_PAGE_SIZE,
      });
    });
  });

  it("loads a specific page", async () => {
    const user = userEvent.setup();
    vi.mocked(getBurgerReviews)
      .mockResolvedValueOnce(mockPaginatedResponse)
      .mockResolvedValueOnce({
        reviews: [{ ...mockReview, id: "review-2", authorName: "Jordan Kim" }],
        pagination: {
          page: 2,
          pageSize: DEFAULT_REVIEWS_PAGE_SIZE,
          total: 10,
          totalPages: 2,
        },
      });

    render(<TestHarness />);

    await waitFor(() => {
      expect(screen.getByText("Alex Rivera")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Page 2" }));

    await waitFor(() => {
      expect(screen.getByText("Jordan Kim")).toBeInTheDocument();
    });

    expect(getBurgerReviews).toHaveBeenLastCalledWith("burger-1", {
      page: 2,
      pageSize: DEFAULT_REVIEWS_PAGE_SIZE,
    });
  });
});
