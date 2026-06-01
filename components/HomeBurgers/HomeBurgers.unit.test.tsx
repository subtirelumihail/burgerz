import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getBurgers } from "@/lib/services/burger.service";
import { mockImageAsset } from "@/test/mock-image";
import type { Burger } from "@/types/burger";
import { DEFAULT_BURGERS_PAGE_SIZE } from "@/types/burger";

import { HomeBurgers } from "./HomeBurgers";

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

describe("HomeBurgers", () => {
  beforeEach(() => {
    vi.mocked(getBurgers).mockResolvedValue(mockPaginatedResponse);
  });

  it("loads and displays burgers from the API", async () => {
    render(<HomeBurgers />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { level: 2, name: /smash shack classic/i }),
      ).toBeInTheDocument();
    });

    expect(getBurgers).toHaveBeenCalledWith({
      page: 1,
      pageSize: DEFAULT_BURGERS_PAGE_SIZE,
    });
  });

  it("refetches burgers when searching", async () => {
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
      });

    render(<HomeBurgers />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { level: 2, name: /smash shack classic/i }),
      ).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(getBurgers).toHaveBeenLastCalledWith({
        page: 1,
        pageSize: DEFAULT_BURGERS_PAGE_SIZE,
      });
    });
  });

  it("clears search and reloads burgers", async () => {
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

    render(<HomeBurgers />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { level: 2, name: /smash shack classic/i }),
      ).toBeInTheDocument();
    });

    await user.type(
      screen.getByRole("searchbox", { name: /search burgers/i }),
      "garden",
    );
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

    expect(
      screen.getByRole("searchbox", { name: /search burgers/i }),
    ).toHaveValue("");
  });

  it("renders pagination when there are multiple pages", async () => {
    vi.mocked(getBurgers).mockResolvedValue({
      burgers: [mockBurger],
      pagination: {
        page: 1,
        pageSize: DEFAULT_BURGERS_PAGE_SIZE,
        total: 12,
        totalPages: 2,
      },
    });

    render(<HomeBurgers />);

    await waitFor(() => {
      expect(
        screen.getByRole("navigation", { name: "Pagination" }),
      ).toBeInTheDocument();
    });
  });
});
