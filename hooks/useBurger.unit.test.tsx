import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getBurger } from "@/lib/services/burger.service";
import { mockImageAsset } from "@/test/mock-image";
import type { Burger } from "@/types/burger";

import { useBurger } from "./useBurger";

vi.mock("@/lib/services/burger.service", () => ({
  getBurger: vi.fn(),
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

function TestHarness({ id }: { id: string }) {
  const { burger, isLoading, error } = useBurger(id);

  return (
    <div>
      {isLoading ? <p role="status">Loading</p> : null}
      {error ? <p role="alert">{error.message}</p> : null}
      {burger ? <p>{burger.title}</p> : null}
      {!isLoading && !burger ? <p>Not found</p> : null}
    </div>
  );
}

describe("useBurger", () => {
  beforeEach(() => {
    vi.mocked(getBurger).mockResolvedValue(mockBurger);
  });

  it("loads burger from the API on mount", async () => {
    render(<TestHarness id="burger-1" />);

    expect(screen.getByText("Loading")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Smash Shack Classic")).toBeInTheDocument();
    });

    expect(getBurger).toHaveBeenCalledWith("burger-1");
  });

  it("shows not found when burger is null", async () => {
    vi.mocked(getBurger).mockResolvedValue(null);

    render(<TestHarness id="missing" />);

    await waitFor(() => {
      expect(screen.getByText("Not found")).toBeInTheDocument();
    });
  });

  it("surfaces fetch errors", async () => {
    vi.mocked(getBurger).mockRejectedValue(new Error("Network error"));

    render(<TestHarness id="burger-1" />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Network error");
    });
  });
});
