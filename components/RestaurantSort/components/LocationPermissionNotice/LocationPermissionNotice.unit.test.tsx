import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LocationPermissionNotice } from "./LocationPermissionNotice";

describe("LocationPermissionNotice", () => {
  it("renders prompt guidance and enable action when location is not yet granted", async () => {
    const user = userEvent.setup();
    const onEnableLocation = vi.fn();

    render(
      <LocationPermissionNotice
        locationStatus="idle"
        onEnableLocation={onEnableLocation}
      />,
    );

    expect(
      screen.getByLabelText(
        /location access is needed to sort restaurants by distance\. click enable location below and allow access when chrome prompts you\./i,
      ),
    ).toHaveAttribute("tabindex", "0");

    await user.click(screen.getByRole("button", { name: "Enable location" }));

    expect(onEnableLocation).toHaveBeenCalledTimes(1);
  });

  it("renders Chrome settings guidance when location is denied", async () => {
    const user = userEvent.setup();
    const onEnableLocation = vi.fn();

    render(
      <LocationPermissionNotice
        locationStatus="denied"
        onEnableLocation={onEnableLocation}
      />,
    );

    expect(
      screen.getByLabelText(
        /location access is blocked for this site\. to sort restaurants by distance, enable it in chrome: click the lock icon in the address bar, open site settings, set location to allow, then click try again below\./i,
      ),
    ).toHaveAttribute("tabindex", "0");

    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(onEnableLocation).toHaveBeenCalledTimes(1);
  });

  it("renders unavailable guidance without an action when geolocation is unsupported", () => {
    render(
      <LocationPermissionNotice
        locationStatus="unavailable"
        onEnableLocation={vi.fn()}
      />,
    );

    expect(
      screen.getByLabelText(
        /location is unavailable in this browser\. sorting by distance is not supported here\./i,
      ),
    ).toHaveAttribute("tabindex", "0");
    expect(
      screen.queryByRole("button", { name: /enable location|try again/i }),
    ).not.toBeInTheDocument();
  });
});
