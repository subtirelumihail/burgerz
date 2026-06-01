import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { usePathname } from "next/navigation";

import { SiteHeaderNav } from "./SiteHeaderNav";

vi.mocked(usePathname).mockReturnValue("/restaurants");

describe("SiteHeaderNav", () => {
  it("renders burgers and restaurants links with active state", () => {
    render(<SiteHeaderNav />);

    expect(screen.getByRole("link", { name: "Burgers" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "Restaurants" })).toHaveAttribute(
      "href",
      "/restaurants",
    );
    expect(screen.getByRole("link", { name: "Restaurants" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
