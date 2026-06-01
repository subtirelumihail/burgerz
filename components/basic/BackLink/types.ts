import type { LinkProps } from "next/link";
import type { ReactNode } from "react";

export interface BackLinkProps extends Omit<LinkProps, "children"> {
  children: ReactNode;
}
