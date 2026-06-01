import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AddReviewLink } from "./AddReviewLink";

describe("AddReviewLink", () => {
  it("links to the add review page for the burger", () => {
    render(<AddReviewLink burgerId="burger-1" />);

    expect(screen.getByRole("link", { name: "Add Review" })).toHaveAttribute(
      "href",
      "/burgers/burger-1/add-review",
    );
  });
});
