import Link from "next/link";

import { BurgerPageContent } from "@/components/BurgerPage/BurgerPageContent";

import styles from "./page.module.css";

interface BurgerPageProps {
  params: Promise<{ id: string }>;
}

export default async function BurgerPage({ params }: BurgerPageProps) {
  const { id } = await params;

  return (
    <div className={styles.root}>
      <Link href="/" className={styles.back}>
        Back to search
      </Link>
      <BurgerPageContent burgerId={id} />
    </div>
  );
}
