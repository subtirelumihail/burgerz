import Link from "next/link";

import { BurgerPageContent } from "@/components/BurgerPage/BurgerPageContent";
import {
  BURGER_FROM_SEARCH_PARAM,
  resolveBurgerBackNavigation,
} from "@/lib/burger-navigation";

import styles from "./page.module.css";

interface BurgerPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [BURGER_FROM_SEARCH_PARAM]?: string }>;
}

export default async function BurgerPage({
  params,
  searchParams,
}: BurgerPageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const back = resolveBurgerBackNavigation(
    resolvedSearchParams[BURGER_FROM_SEARCH_PARAM],
  );

  return (
    <div className={styles.root}>
      <Link href={back.href} className={styles.back}>
        {back.label}
      </Link>
      <BurgerPageContent burgerId={id} />
    </div>
  );
}
