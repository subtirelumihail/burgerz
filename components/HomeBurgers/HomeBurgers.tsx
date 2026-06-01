"use client";

import { BurgerSearch } from "@/components/BurgerSearch/BurgerSearch";
import { BurgersList } from "@/components/BurgersList/BurgersList";
import { Pagination } from "@/components/basic/Pagination/Pagination";
import { useBurgers } from "@/hooks/useBurgers";

import styles from "./HomeBurgers.module.css";

export function HomeBurgers() {
  const {
    burgers,
    query,
    setQuery,
    search,
    clearSearch,
    pagination,
    goToPage,
    isLoading,
    error,
  } = useBurgers();

  return (
    <>
      <BurgerSearch
        query={query}
        onQueryChange={setQuery}
        onSearch={() => {
          void search();
        }}
        onClear={() => {
          void clearSearch();
        }}
        isLoading={isLoading}
      />
      {error ? (
        <p className={styles.error} role="alert">
          {error.message}
        </p>
      ) : null}
      <BurgersList burgers={burgers} isLoading={isLoading} />
      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={goToPage}
        isLoading={isLoading}
        className={styles.pagination}
      />
    </>
  );
}
