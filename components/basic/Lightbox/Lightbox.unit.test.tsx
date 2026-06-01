import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Lightbox } from "./Lightbox";

const mockImage = {
  thumbnailUrl: "https://example.com/thumb.jpg",
  fullUrl: "https://example.com/full.jpg",
  width: 960,
  height: 640,
};

describe("Lightbox", () => {
  it("renders nothing when closed", () => {
    render(
      <Lightbox
        isOpen={false}
        onClose={vi.fn()}
        image={mockImage}
        alt="Burger photo"
      />,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows full image when open", () => {
    render(
      <Lightbox
        isOpen
        onClose={vi.fn()}
        image={mockImage}
        alt="Burger photo"
      />,
    );

    expect(
      screen.getByRole("dialog", { name: "Burger photo" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Burger photo" })).toHaveAttribute(
      "src",
      expect.stringContaining("full.jpg"),
    );
  });

  it("closes on escape key", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Lightbox
        isOpen
        onClose={onClose}
        image={mockImage}
        alt="Burger photo"
      />,
    );

    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes when close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Lightbox
        isOpen
        onClose={onClose}
        image={mockImage}
        alt="Burger photo"
      />,
    );

    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
