"use client";

import { useEffect, useState } from "react";

import { getBurger } from "@/lib/services/burger.service";
import type { Burger } from "@/types/burger";

interface UseBurgerResult {
  burger: Burger | null;
  isLoading: boolean;
  error: Error | null;
}

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error("Failed to load burger");
}

export function useBurger(id: string): UseBurgerResult {
  const [burger, setBurger] = useState<Burger | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isCancelled = false;

    getBurger(id)
      .then((result) => {
        if (!isCancelled) {
          setBurger(result);
          setError(null);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          setError(toError(err));
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [id]);

  return {
    burger,
    isLoading,
    error,
  };
}
