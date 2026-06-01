import Link from "next/link";

import { Container } from "@/components/layout/Container/Container";
import { cn } from "@/lib/cn";

import { SiteHeaderNav } from "./components/SiteHeaderNav/SiteHeaderNav";
import styles from "./SiteHeader.module.css";
import type { SiteHeaderProps } from "./types";

export function SiteHeader({ className }: SiteHeaderProps) {
  return (
    <header className={cn(styles.root, className)}>
      <Container>
        <div className={styles.inner}>
          <Link href="/" className={styles.brand}>
            Burgerz
          </Link>
          <SiteHeaderNav />
        </div>
      </Container>
    </header>
  );
}
