import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getBurger } from "@/lib/services/burger.service";
import { mockImageAsset } from "@/test/mock-image";
import type { Burger } from "@/types/burger";

import { AddBurgerReviewPageContent } from "./AddBurgerReviewPageContent";

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

describe("AddBurgerReviewPageContent", () => {
  beforeEach(() => {
    vi.mocked(getBurger).mockResolvedValue(mockBurger);
  });

  it("renders the same burger header and voice-over navigation as the burger page", async () => {
    render(<AddBurgerReviewPageContent burgerId="burger-1" />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Smash Shack Classic",
      );
    });

    expect(screen.getByRole("link", { name: "Smash Shack" })).toHaveAttribute(
      "href",
      "/restaurants/restaurant-1",
    );
    expect(
      screen.getByLabelText(
        "Smash Shack Classic. 4.5 out of 5 stars based on 10 reviews. Aspect scores: Taste, 4.5 out of 5. Texture, 4.5 out of 5. Visual presentation, 4.5 out of 5.",
      ),
    ).toHaveAttribute("tabindex", "0");
    expect(
      screen.getByRole("heading", { level: 2, name: "Add your review" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("form", { name: "Add burger review" }),
    ).toBeInTheDocument();
  });

  it("shows not found when burger does not exist", async () => {
    vi.mocked(getBurger).mockResolvedValue(null);

    render(<AddBurgerReviewPageContent burgerId="missing" />);

    await waitFor(() => {
      expect(screen.getByText("Burger not found")).toBeInTheDocument();
    });
  });
});
