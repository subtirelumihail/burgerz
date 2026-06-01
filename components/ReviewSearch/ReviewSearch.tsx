"use client";

import { type FormEvent } from "react";

import { Button, Input } from "@/components/basic";

import type { ReviewSearchProps } from "./types";

import styles from "./ReviewSearch.module.css";

export function ReviewSearch({
  query,
  onQueryChange,
  onSearch,
  onClear,
  isLoading = false,
}: ReviewSearchProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch();
  }

  const hasQuery = query.length > 0;

  return (
    <section className={styles.root} aria-label="Search reviews">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <Input
            type="search"
            name="q"
            label="Search reviews"
            placeholder="Search by reviewer or review text"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            disabled={isLoading}
            className={styles.control}
          />
        </div>
        <div className={styles.actions}>
          <Button
            type="submit"
            className={styles.button}
            isLoading={isLoading}
            disabled={isLoading}
          >
            Search
          </Button>
          {hasQuery ? (
            <Button
              type="button"
              variant="secondary"
              className={styles.button}
              onClick={onClear}
              disabled={isLoading}
            >
              Clear search
            </Button>
          ) : null}
        </div>
      </form>
    </section>
  );
}
