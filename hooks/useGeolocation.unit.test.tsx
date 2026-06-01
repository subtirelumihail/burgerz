import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useGeolocation } from "./useGeolocation";

const mockGetCurrentPosition = vi.fn();

function TestHarness() {
  const geolocation = useGeolocation();

  return (
    <div>
      <p>Status: {geolocation.status}</p>
      <p>
        Coordinates:{" "}
        {geolocation.coordinates
          ? `${geolocation.coordinates.latitude},${geolocation.coordinates.longitude}`
          : "none"}
      </p>
      <p>Needs access: {geolocation.needsLocationAccess ? "yes" : "no"}</p>
      <button type="button" onClick={geolocation.requestLocation}>
        Request location
      </button>
    </div>
  );
}

describe("useGeolocation", () => {
  beforeEach(() => {
    mockGetCurrentPosition.mockReset();
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: {
        getCurrentPosition: mockGetCurrentPosition,
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("requests location on mount", async () => {
    mockGetCurrentPosition.mockImplementation((success) => {
      success({
        coords: { latitude: 37.77, longitude: -122.42 },
      });
    });

    render(<TestHarness />);

    expect(mockGetCurrentPosition).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.getByText("Status: granted")).toBeInTheDocument();
    });

    expect(screen.getByText("Coordinates: 37.77,-122.42")).toBeInTheDocument();
    expect(screen.getByText("Needs access: no")).toBeInTheDocument();
  });

  it("marks location as denied when permission is refused on mount", async () => {
    mockGetCurrentPosition.mockImplementation((_success, error) => {
      error({ code: 1, PERMISSION_DENIED: 1 });
    });

    render(<TestHarness />);

    await waitFor(() => {
      expect(screen.getByText("Status: denied")).toBeInTheDocument();
    });

    expect(screen.getByText("Needs access: yes")).toBeInTheDocument();
  });

  it("requests location on click and stores coordinates when granted", async () => {
    mockGetCurrentPosition
      .mockImplementationOnce((_success, error) => {
        error({ code: 1, PERMISSION_DENIED: 1 });
      })
      .mockImplementationOnce((success) => {
        success({
          coords: { latitude: 37.77, longitude: -122.42 },
        });
      });

    const user = userEvent.setup();
    render(<TestHarness />);

    await waitFor(() => {
      expect(screen.getByText("Status: denied")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Request location" }));

    expect(mockGetCurrentPosition).toHaveBeenCalledTimes(2);

    await waitFor(() => {
      expect(screen.getByText("Status: granted")).toBeInTheDocument();
    });

    expect(screen.getByText("Coordinates: 37.77,-122.42")).toBeInTheDocument();
    expect(screen.getByText("Needs access: no")).toBeInTheDocument();
  });

  it("allows requesting location again after denial", async () => {
    mockGetCurrentPosition
      .mockImplementationOnce((_success, error) => {
        error({ code: 1, PERMISSION_DENIED: 1 });
      })
      .mockImplementationOnce((_success, error) => {
        error({ code: 1, PERMISSION_DENIED: 1 });
      })
      .mockImplementationOnce((success) => {
        success({
          coords: { latitude: 37.78, longitude: -122.41 },
        });
      });

    const user = userEvent.setup();
    render(<TestHarness />);

    await waitFor(() => {
      expect(screen.getByText("Status: denied")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Request location" }));

    await waitFor(() => {
      expect(mockGetCurrentPosition).toHaveBeenCalledTimes(2);
    });

    await user.click(screen.getByRole("button", { name: "Request location" }));

    await waitFor(() => {
      expect(screen.getByText("Status: granted")).toBeInTheDocument();
    });

    expect(mockGetCurrentPosition).toHaveBeenCalledTimes(3);
  });
});
