import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BurgerHeroSkeleton } from "./BurgerHeroSkeleton";

describe("BurgerHeroSkeleton", () => {
  it("renders a hidden loading placeholder", () => {
    const { container } = render(<BurgerHeroSkeleton />);

    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });
});
