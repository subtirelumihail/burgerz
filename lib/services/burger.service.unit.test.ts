import { describe, expect, it, vi } from "vitest";

import { apiClient } from "@/lib/api/client";

import { createBurger, getBurgers } from "./burger.service";

vi.mock("@/lib/api/client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("burger.service", () => {
  it("getBurgers calls list endpoint", async () => {
    vi.mocked(apiClient.get).mockResolvedValue([]);

    await getBurgers();

    expect(apiClient.get).toHaveBeenCalledWith("/api/burgers");
  });

  it("getBurgers passes search query", async () => {
    vi.mocked(apiClient.get).mockResolvedValue([]);

    await getBurgers({ q: "smash" });

    expect(apiClient.get).toHaveBeenCalledWith("/api/burgers?q=smash");
  });

  it("getBurgers passes restaurant id", async () => {
    vi.mocked(apiClient.get).mockResolvedValue([]);

    await getBurgers({ restaurantId: "restaurant-1" });

    expect(apiClient.get).toHaveBeenCalledWith(
      "/api/burgers?restaurantId=restaurant-1",
    );
  });

  it("createBurger posts payload", async () => {
    const payload = {
      title: "New Burger",
      address: "1 Main St",
      imageUrl: "https://example.com/burger.jpg",
      reviewScore: 4.0,
      scores: { taste: 4, texture: 4, visualPresentation: 4 },
    };

    vi.mocked(apiClient.post).mockResolvedValue({
      id: "99",
      ...payload,
      reviewCount: 0,
    });

    const burger = await createBurger(payload);

    expect(apiClient.post).toHaveBeenCalledWith("/api/burgers", payload);
    expect(burger.id).toBe("99");
  });
});
