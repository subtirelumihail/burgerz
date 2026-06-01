import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { List } from "./List";

describe("List", () => {
  it("renders list items", () => {
    render(
      <List
        items={[{ id: "1", title: "Classic Burger" }]}
        keyExtractor={(item) => item.id}
        renderItem={(item) => <p>{item.title}</p>}
        ariaLabel="Burgers"
      />,
    );

    expect(screen.getByRole("list", { name: "Burgers" })).toBeInTheDocument();
    expect(screen.getByText("Classic Burger")).toBeInTheDocument();
  });

  it("renders empty message when there are no items", () => {
    render(
      <List
        items={[]}
        keyExtractor={(item: { id: string }) => item.id}
        renderItem={() => null}
        emptyMessage="Nothing here"
      />,
    );

    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });
});
