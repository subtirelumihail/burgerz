import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LocationPermissionNotice } from "./LocationPermissionNotice";

describe("LocationPermissionNotice", () => {
  it("renders guidance and enable action", async () => {
    const user = userEvent.setup();
    const onEnableLocation = vi.fn();

    render(<LocationPermissionNotice onEnableLocation={onEnableLocation} />);

    expect(
      screen.getByText(
        /location access is needed to sort restaurants by distance/i,
      ),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Enable location" }));

    expect(onEnableLocation).toHaveBeenCalledTimes(1);
  });
});
