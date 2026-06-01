import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { UploadImage } from "./UploadImage";

describe("UploadImage", () => {
  it("renders label and file input", () => {
    render(<UploadImage label="Burger photo" />);
    expect(screen.getByText("Burger photo")).toBeInTheDocument();
    expect(screen.getByLabelText("Burger photo")).toHaveAttribute(
      "type",
      "file",
    );
  });

  it("calls onImageChange when a file is selected", async () => {
    const user = userEvent.setup();
    const onImageChange = vi.fn();
    const createObjectURL = vi.fn(() => "blob:preview");
    vi.stubGlobal("URL", {
      createObjectURL,
      revokeObjectURL: vi.fn(),
    });

    render(<UploadImage label="Photo" onImageChange={onImageChange} />);

    const file = new File(["pixels"], "burger.png", { type: "image/png" });
    const input = screen.getByLabelText("Photo");

    await user.upload(input, file);

    expect(onImageChange).toHaveBeenCalledWith(file, "blob:preview");
    vi.unstubAllGlobals();
  });
});
