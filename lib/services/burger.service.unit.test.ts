import { describe, expect, it, vi } from "vitest";

import { apiClient } from "@/lib/api/client";

import { getBurgers } from "./burger.service";

vi.mock("@/lib/api/client", () => ({
  apiClient: {
    get: vi.fn(),
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
});
