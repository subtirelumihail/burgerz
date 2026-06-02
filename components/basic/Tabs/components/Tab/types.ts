import type { ReactNode } from "react";

export interface TabProps<T extends string = string> {
  id: T;
  label: string;
  children: ReactNode;
}
