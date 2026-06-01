export const BURGER_FROM_SEARCH_PARAM = "from";

export function isSafeRelativePath(path: string): boolean {
  if (!path.startsWith("/") || path.startsWith("//")) {
    return false;
  }

  return !path.includes("://");
}

export function buildBurgerDetailPath(burgerId: string, from?: string): string {
  const base = `/burgers/${burgerId}`;

  if (!from || !isSafeRelativePath(from)) {
    return base;
  }

  const searchParams = new URLSearchParams();
  searchParams.set(BURGER_FROM_SEARCH_PARAM, from);

  return `${base}?${searchParams.toString()}`;
}

export function resolveBurgerBackNavigation(from: string | undefined): {
  href: string;
  label: string;
} {
  if (from && isSafeRelativePath(from)) {
    if (from.startsWith("/restaurants/")) {
      return { href: from, label: "Back to restaurant" };
    }

    return { href: from, label: "Back" };
  }

  return { href: "/burgers", label: "Back to burgers" };
}
