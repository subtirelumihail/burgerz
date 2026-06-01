import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { MAX_UPLOAD_IMAGE_SIZE_BYTES } from "@/lib/upload-image";

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

  it("shows max file size in the hint and dropzone", () => {
    render(
      <UploadImage label="Photo" hint="Add a photo of the burger you tried." />,
    );

    expect(screen.getAllByText(/Max file size: 5 MB\./)).toHaveLength(2);
    expect(
      screen.getByText(
        "Add a photo of the burger you tried. Max file size: 5 MB.",
      ),
    ).toBeInTheDocument();
  });

  it("rejects files larger than the max size", async () => {
    const user = userEvent.setup();
    const onImageChange = vi.fn();

    render(<UploadImage label="Photo" onImageChange={onImageChange} />);

    const largeFile = new File(
      [new ArrayBuffer(MAX_UPLOAD_IMAGE_SIZE_BYTES + 1)],
      "large.png",
      { type: "image/png" },
    );
    const input = screen.getByLabelText("Photo");

    await user.upload(input, largeFile);

    expect(onImageChange).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Image must be 5 MB or smaller.",
    );
    expect(
      screen.queryByAltText("Selected image preview"),
    ).not.toBeInTheDocument();
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
