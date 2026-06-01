import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SiteHeader } from "./SiteHeader";

describe("SiteHeader", () => {
  it("renders Burgerz brand link", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: "Burgerz" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("renders main navigation links", () => {
    render(<SiteHeader />);

    expect(screen.getByRole("link", { name: "Burgers" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "Restaurants" })).toHaveAttribute(
      "href",
      "/restaurants",
    );
  });
});
