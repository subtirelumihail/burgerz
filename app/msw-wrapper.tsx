import { MswProvider } from "@/components/msw-provider";

export function MswWrapper({ children }: { children: React.ReactNode }) {
  return process.env.NEXT_PUBLIC_API_MOCKING === "enabled" ? (
    <MswProvider>{children}</MswProvider>
  ) : (
    children
  );
}
