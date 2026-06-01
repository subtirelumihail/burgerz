import Image from "next/image";
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
            <Image
              src="/logo-burgerz.png"
              alt=""
              width={40}
              height={36}
              className={styles.logo}
              priority
            />
            Burgerz
          </Link>
          <SiteHeaderNav />
        </div>
      </Container>
    </header>
  );
}
