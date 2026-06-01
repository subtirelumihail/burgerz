import { Container } from "@/components/layout/Container/Container";
import { cn } from "@/lib/cn";

import styles from "./SiteFooter.module.css";
import type { SiteFooterProps } from "./types";

export function SiteFooter({ className }: SiteFooterProps) {
  return (
    <footer className={cn(styles.root, className)}>
      <Container>
        <div className={styles.inner}>
          <p className={styles.text}>
            Made with <span className={styles.heart}>love</span> by Mihail
            Subtirelu
          </p>
        </div>
      </Container>
    </footer>
  );
}
