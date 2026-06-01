import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BurgerReviewsListSkeleton } from "./BurgerReviewsListSkeleton";

describe("BurgerReviewsListSkeleton", () => {
  it("renders the default number of placeholder items", () => {
    const { container } = render(<BurgerReviewsListSkeleton />);

    expect(container.querySelectorAll("li")).toHaveLength(3);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });

  it("renders a custom number of placeholder items", () => {
    const { container } = render(<BurgerReviewsListSkeleton count={2} />);

    expect(container.querySelectorAll("li")).toHaveLength(2);
  });

  it("renders image placeholders on even-indexed items only", () => {
    const { container } = render(<BurgerReviewsListSkeleton count={4} />);
    const items = container.querySelectorAll("li");

    expect(items[0]?.querySelector('[class*="image"]')).not.toBeNull();
    expect(items[1]?.querySelector('[class*="image"]')).toBeNull();
    expect(items[2]?.querySelector('[class*="image"]')).not.toBeNull();
    expect(items[3]?.querySelector('[class*="image"]')).toBeNull();
  });
});
