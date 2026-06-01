import { describe, expect, it } from "vitest";

import { getDistanceKm } from "./distance";

describe("getDistanceKm", () => {
  it("returns zero for identical coordinates", () => {
    const coordinates = { latitude: 37.7749, longitude: -122.4194 };

    expect(getDistanceKm(coordinates, coordinates)).toBe(0);
  });

  it("calculates distance between two known points", () => {
    const sanFrancisco = { latitude: 37.7749, longitude: -122.4194 };
    const oakland = { latitude: 37.8044, longitude: -122.2712 };
    const distance = getDistanceKm(sanFrancisco, oakland);

    expect(distance).toBeGreaterThan(10);
    expect(distance).toBeLessThan(20);
  });
});
