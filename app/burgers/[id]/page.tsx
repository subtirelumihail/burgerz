import Link from "next/link";
import { notFound } from "next/navigation";

import { getBurger } from "@/lib/services/burger.service";

import styles from "./page.module.css";

interface BurgerPageProps {
  params: Promise<{ id: string }>;
}

export default async function BurgerPage({ params }: BurgerPageProps) {
  const { id } = await params;
  const burger = await getBurger(id);

  if (!burger) {
    notFound();
  }

  return (
    <div className={styles.root}>
      <Link href="/" className={styles.back}>
        Back to search
      </Link>
      <h1 className={styles.title}>{burger.title}</h1>
      <Link
        href={`/restaurants/${burger.restaurant.id}`}
        className={styles.restaurant}
      >
        {burger.restaurant.name}
      </Link>
    </div>
  );
}
