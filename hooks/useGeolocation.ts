"use client";

import { useCallback, useEffect, useState } from "react";

import type { GeoCoordinates } from "@/types/restaurant";

export type GeolocationStatus =
  | "idle"
  | "pending"
  | "granted"
  | "denied"
  | "unavailable";

export interface UseGeolocationResult {
  coordinates: GeoCoordinates | null;
  status: GeolocationStatus;
  isLocationAvailable: boolean;
  needsLocationAccess: boolean;
  isLocationPending: boolean;
  requestLocation: () => void;
}

const geolocationOptions: PositionOptions = {
  enableHighAccuracy: false,
  maximumAge: 0,
  timeout: 10_000,
};

function isGeolocationSupported(): boolean {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.geolocation?.getCurrentPosition === "function"
  );
}

function readCurrentPosition(
  onSuccess: (coordinates: GeoCoordinates) => void,
  onFailure: (
    status: Exclude<GeolocationStatus, "granted" | "pending" | "idle">,
  ) => void,
): void {
  if (!isGeolocationSupported()) {
    queueMicrotask(() => {
      onFailure("unavailable");
    });
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      onSuccess({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    (error) => {
      onFailure(
        error.code === error.PERMISSION_DENIED ? "denied" : "unavailable",
      );
    },
    geolocationOptions,
  );
}

export function useGeolocation(): UseGeolocationResult {
  const [coordinates, setCoordinates] = useState<GeoCoordinates | null>(null);
  // Always "idle" on first render so SSR and hydration match; unsupported
  // browsers are updated in useEffect after mount.
  const [status, setStatus] = useState<GeolocationStatus>("idle");

  const requestLocation = useCallback(() => {
    if (!isGeolocationSupported()) {
      setCoordinates(null);
      setStatus("unavailable");
      return;
    }

    setStatus("pending");
    setCoordinates(null);

    readCurrentPosition(
      (nextCoordinates) => {
        setCoordinates(nextCoordinates);
        setStatus("granted");
      },
      (nextStatus) => {
        setCoordinates(null);
        setStatus(nextStatus);
      },
    );
  }, []);

  useEffect(() => {
    let isCancelled = false;

    readCurrentPosition(
      (nextCoordinates) => {
        if (!isCancelled) {
          setCoordinates(nextCoordinates);
          setStatus("granted");
        }
      },
      (nextStatus) => {
        if (!isCancelled) {
          setCoordinates(null);
          setStatus(nextStatus);
        }
      },
    );

    return () => {
      isCancelled = true;
    };
  }, []);

  const isLocationAvailable = status === "granted" && coordinates !== null;

  return {
    coordinates,
    status,
    isLocationAvailable,
    needsLocationAccess: !isLocationAvailable,
    isLocationPending: status === "pending",
    requestLocation,
  };
}
