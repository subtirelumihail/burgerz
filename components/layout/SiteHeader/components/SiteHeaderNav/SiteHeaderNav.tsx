"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";

import type { SiteHeaderNavProps } from "./types";

import styles from "./SiteHeaderNav.module.css";

const navItems = [
  { href: "/", label: "Restaurants" },
  { href: "/burgers", label: "Burgers" },
] as const;

function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/" || pathname.startsWith("/restaurants");
  }

  if (href === "/burgers") {
    return pathname === "/burgers" || pathname.startsWith("/burgers/");
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeaderNav({ className }: SiteHeaderNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn(styles.root, className)} aria-label="Main">
      {navItems.map((item) => {
        const isActive = isNavItemActive(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(styles.link, isActive && styles.linkActive)}
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
