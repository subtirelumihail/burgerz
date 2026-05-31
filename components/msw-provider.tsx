"use client";

import { useEffect, useState, type ReactNode } from "react";

interface MswProviderProps {
  children: ReactNode;
}

export function MswProvider({ children }: MswProviderProps) {
  const [isReady, setIsReady] = useState(
    process.env.NEXT_PUBLIC_API_MOCKING !== "enabled",
  );

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_API_MOCKING !== "enabled") {
      return;
    }

    async function enableMocking() {
      const { worker } = await import("@/mocks/browser");
      await worker.start({ onUnhandledRequest: "bypass" });
      setIsReady(true);
    }

    void enableMocking();
  }, []);

  if (!isReady) {
    return null;
  }

  return children;
}
