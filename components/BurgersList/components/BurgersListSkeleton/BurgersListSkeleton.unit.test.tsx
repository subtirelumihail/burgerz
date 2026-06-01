import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BurgersListSkeleton } from "./BurgersListSkeleton";

describe("BurgersListSkeleton", () => {
  it("renders the default number of placeholder items", () => {
    const { container } = render(<BurgersListSkeleton />);

    expect(container.querySelectorAll("li")).toHaveLength(3);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });

  it("renders a custom number of placeholder items", () => {
    const { container } = render(<BurgersListSkeleton count={4} />);

    expect(container.querySelectorAll("li")).toHaveLength(4);
  });
});
