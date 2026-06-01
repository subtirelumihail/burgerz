import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RestaurantsListSkeleton } from "./RestaurantsListSkeleton";

describe("RestaurantsListSkeleton", () => {
  it("renders the default number of placeholder items", () => {
    const { container } = render(<RestaurantsListSkeleton />);

    expect(container.querySelectorAll("li")).toHaveLength(3);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });

  it("renders a custom number of placeholder items", () => {
    const { container } = render(<RestaurantsListSkeleton count={5} />);

    expect(container.querySelectorAll("li")).toHaveLength(5);
  });
});
