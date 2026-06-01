"use client";

import { useEffect, useState } from "react";

import { getRestaurant } from "@/lib/services/restaurant.service";
import type { Restaurant } from "@/types/restaurant";

interface UseRestaurantResult {
  restaurant: Restaurant | null;
  isLoading: boolean;
  error: Error | null;
}

function toError(error: unknown): Error {
  return error instanceof Error
    ? error
    : new Error("Failed to load restaurant");
}

export function useRestaurant(id: string): UseRestaurantResult {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadRestaurant() {
      try {
        const result = await getRestaurant(id);

        if (!isCancelled) {
          setRestaurant(result);
          setError(null);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(toError(err));
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadRestaurant();

    return () => {
      isCancelled = true;
    };
  }, [id]);

  return {
    restaurant,
    isLoading,
    error,
  };
}
