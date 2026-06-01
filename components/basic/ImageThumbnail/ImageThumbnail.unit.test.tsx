import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ImageThumbnail } from "./ImageThumbnail";

const mockImage = {
  thumbnailUrl: "https://example.com/thumb.jpg",
  fullUrl: "https://example.com/full.jpg",
  width: 960,
  height: 640,
};

describe("ImageThumbnail", () => {
  it("renders thumbnail image", () => {
    render(
      <ImageThumbnail
        image={mockImage}
        alt="Burger photo"
        width={160}
        height={160}
      />,
    );

    expect(screen.getByRole("img", { name: "Burger photo" })).toHaveAttribute(
      "src",
      expect.stringContaining("thumb.jpg"),
    );
  });

  it("opens lightbox when clicked", async () => {
    const user = userEvent.setup();

    render(
      <ImageThumbnail
        image={mockImage}
        alt="Burger photo"
        width={160}
        height={160}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "View full size: Burger photo" }),
    );

    expect(
      screen.getByRole("dialog", { name: "Burger photo" }),
    ).toBeInTheDocument();
  });
});
