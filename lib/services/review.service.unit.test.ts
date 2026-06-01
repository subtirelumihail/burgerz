import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "@/lib/api/client";

import { getBurgerReviews } from "./review.service";

vi.mock("@/lib/api/client", () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe("review.service", () => {
  beforeEach(() => {
    vi.mocked(apiClient.get).mockResolvedValue({
      reviews: [],
      pagination: { page: 1, pageSize: 5, total: 0, totalPages: 1 },
    });
  });

  it("getBurgerReviews calls correct endpoint without params", async () => {
    await getBurgerReviews("burger-1");

    expect(apiClient.get).toHaveBeenCalledWith("/api/burgers/burger-1/reviews");
  });

  it("getBurgerReviews builds query string from params", async () => {
    await getBurgerReviews("burger-1", { q: "juicy", page: 2, pageSize: 5 });

    expect(apiClient.get).toHaveBeenCalledWith(
      "/api/burgers/burger-1/reviews?q=juicy&page=2&pageSize=5",
    );
  });
});
