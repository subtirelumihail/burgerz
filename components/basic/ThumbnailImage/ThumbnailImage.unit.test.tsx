import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ThumbnailImage } from "./ThumbnailImage";

describe("ThumbnailImage", () => {
  it("shows loading indicator until image loads", () => {
    render(
      <ThumbnailImage
        src="https://example.com/thumb.jpg"
        alt="Burger photo"
        width={96}
        height={96}
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent("Loading image");

    fireEvent.load(screen.getByRole("img", { name: "Burger photo" }));

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("fills container when fitContainer is enabled", () => {
    render(
      <div style={{ width: 112, height: 112 }}>
        <ThumbnailImage
          src="https://example.com/thumb.jpg"
          alt="Burger photo"
          width={160}
          height={160}
          fitContainer
        />
      </div>,
    );

    const wrapper = screen.getByRole("img", {
      name: "Burger photo",
    }).parentElement;
    expect(wrapper).not.toHaveAttribute("style");
  });

  it("resets loading state when src changes", () => {
    const { rerender } = render(
      <ThumbnailImage
        src="https://example.com/thumb-a.jpg"
        alt="Burger photo"
        width={96}
        height={96}
      />,
    );

    fireEvent.load(screen.getByRole("img", { name: "Burger photo" }));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    rerender(
      <ThumbnailImage
        src="https://example.com/thumb-b.jpg"
        alt="Burger photo"
        width={96}
        height={96}
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent("Loading image");
  });
});
