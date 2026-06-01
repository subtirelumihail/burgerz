# React Component Composition

**Applies when editing:** `**/*.{tsx,jsx,css}`

Components should do one thing well. When complexity grows, split — don't grow a single file.

## When to Split

Extract a subcomponent or hook when a component has any of these:

- More than ~80 lines of JSX or logic
- Multiple distinct UI sections (header, body, footer, sidebar)
- Nested conditionals or repeated markup blocks
- Logic mixed with presentation (data fetching, formatting, event handlers)
- Layout or interaction that diverges significantly by viewport (extract a responsive subcomponent or hook instead of inline breakpoint branches in JSX)

## How to Split

- **UI sections** → subcomponents in a `components/` folder inside the parent component folder (see [Folder Structure](#folder-structure))
- **Reusable logic** → custom hook (`useOrderSummary`, not inline `useEffect` + state)
- **Static content** → constants outside the component
- **Types** → colocated `types.ts` in the same component folder (required)

```tsx
// ❌ BAD — one component doing everything
function OrderPage() {
  const [order, setOrder] = useState(null);
  // 40 lines of fetch/format logic...
  return <div>{/* 100+ lines: header, items list, totals, actions */}</div>;
}

// ✅ GOOD — orchestrator + focused pieces
function OrderPage() {
  const order = useOrder();
  return (
    <main>
      <OrderHeader order={order} />
      <OrderItems items={order.items} />
      <OrderSummary total={order.total} />
      <OrderActions orderId={order.id} />
    </main>
  );
}
```

## Folder Structure

Every component lives in its own folder. Folder name matches the component name in **PascalCase**. Component files also use **PascalCase** (first letter uppercase).

```
components/
  Button/
    Button.tsx
    Button.module.css
    Button.unit.test.tsx
    types.ts
  Menu/
    Menu.tsx
    Menu.module.css
    Menu.unit.test.tsx
    types.ts
    components/
      MenuItem/
        MenuItem.tsx
        MenuItem.module.css
        MenuItem.unit.test.tsx
        types.ts
```

Rules:

- One folder per component — never a loose `button.tsx` at the root of `components/`
- **`types.ts` required** in every component folder (including subcomponents) — all props, local state, and UI-only interfaces live here
- **`ComponentName.module.css` required** in every component folder — all component styles live here, not in JSX
- Component files import types from `./types`; do not define interfaces inline in `.tsx`
- Colocate tests, styles, and helpers in the same folder (`Button.unit.test.tsx`, `Button.module.css`, etc.)
- Subcomponents go in `components/<SubComponentName>/` inside the parent folder, each with its own folder, `types.ts`, and PascalCase files
- Import subcomponents from their folder: `./components/MenuItem/MenuItem`
- Hooks used only by one component can live in the same folder (`useMenu.ts`); shared hooks go in `hooks/`
- Domain/API entities used by hooks or services → `types/` at project root (see [Global Types](./global-types.md)), not duplicated in component `types.ts`

## Component `types.ts`

```typescript
// components/Menu/types.ts
import type { MenuItem } from "@/types/menu";

export interface MenuProps {
  items: MenuItem[];
  onSelect: (id: string) => void;
}

export interface MenuItemRowProps {
  item: MenuItem;
  isActive: boolean;
}
```

- Export only types for that component tree; keep private helpers unexported if unused elsewhere
- Import shared entities from `@/types/*`; re-export only when a parent passes them through unchanged

## File Structure

Within a component `.tsx` file, order exports top-to-bottom:

1. Exported component
2. Private subcomponents (only when kept in the same file — prefer a subfolder instead)
3. Helpers
4. Static content / constants

Types live in `types.ts`, not in the component file.

## Styling (CSS Modules + Tailwind `@apply`)

Do **not** put Tailwind utility classes directly on JSX elements. Keep presentation in a colocated CSS module and use Tailwind only via `@apply` inside that file.

**Default: Tailwind first.** Every style property should use `@apply` with Tailwind utilities (including design tokens from `@theme` in `app/globals.css`). Raw CSS is allowed only when Tailwind cannot express the rule cleanly.

Use raw CSS only for:

- `font-family: inherit` on form controls
- Values with no theme utility yet (e.g. `clamp()`, `ch` widths) — prefer adding a `@theme` token first
- Pseudo-elements or attribute selectors where the selector itself must stay in CSS (still `@apply` the declarations inside the block)
- Keyframes, complex selectors, or one-off arbitrary values that would be harder to read as utilities

Do **not** write plain CSS for layout, spacing, colors, typography, borders, or transitions when an equivalent `@apply` utility exists.

- File name: `ComponentName.module.css` (matches the component file name)
- Import: `import styles from "./ComponentName.module.css"`
- Add `@reference "../../../app/globals.css";` at the top of every module so `@apply` can resolve theme utilities (adjust path depth for nested subcomponents)
- Use semantic class names in CSS (`.root`, `.title`, `.actions`) — not utility names like `.flex` or `.textBlue500`
- Group related utilities on separate `@apply` lines; put responsive variants on their own lines

```tsx
// ❌ BAD — Tailwind utilities in JSX
function Button({ label }: ButtonProps) {
  return (
    <button className="flex font-bold text-blue-500 md:grid lg:block sm:inline">
      {label}
    </button>
  );
}

// ✅ GOOD — styles in the module, semantic classes in JSX
import styles from "./Button.module.css";

function Button({ label }: ButtonProps) {
  return <button className={styles.root}>{label}</button>;
}
```

```css
/* components/Button/Button.module.css */
.root {
  @apply inline-flex items-center justify-center gap-2;
  @apply rounded-md bg-accent px-xl py-md text-accent-foreground;
  @apply transition-[background-color] duration-[180ms] ease-out-expo;
  @apply sm:inline md:grid lg:block;
}

.title {
  @apply text-lg font-semibold;
}

/* Exception: inherit parent font on inputs */
.input {
  @apply w-full rounded-md border border-border px-lg py-md;
  font-family: inherit;
}
```

Rules:

- One `ComponentName.module.css` per component — subcomponents get their own module in their folder
- Prefer `styles.className` over string concatenation; use `clsx` / `cn` only when composing module classes with conditional or external classes
- **Prefer `@apply` for all styling** — reach for raw CSS only in the exceptions listed above
- Shared design tokens belong in `@theme` inside `app/globals.css` — not duplicated as raw `var(--…)` across modules when a utility can cover them
- Page components in `app/` follow the same pattern when they need local styles (`page.module.css` or a colocated component folder)

## Responsive Design

Every component must work from **320px** through desktop. Design **mobile-first**: base styles target the smallest viewport; add `sm:`, `md:`, `lg:` (or raw `@media`) only when layout or typography must change at larger widths.

Responsive rules live in **`ComponentName.module.css`** — same as all other styles. Do not branch on viewport in JSX unless the markup structure itself must change (e.g. drawer vs inline nav).

### Layout

- Prefer **fluid** layouts: `flex`, `grid`, `w-full`, `min-w-0`, `max-w-*` — avoid fixed pixel widths that overflow narrow screens
- Stack vertically by default; switch to rows or multi-column at breakpoints when space allows
- Use shared tokens from `app/globals.css`: `--container-max`, `--container-padding` (via `Container` or equivalent `@apply max-w-[var(--container-max)] px-[var(--container-padding)]`)
- Prefer **`clamp()`** or theme spacing for fluid gaps and type when a single breakpoint jump is not enough — add a `@theme` token before inventing one-off raw values
- For components reused inside sidebars, cards, or split panes, consider **`@container`** queries so the component adapts to its parent width, not only the viewport

```css
/* components/OrderSummary/OrderSummary.module.css */
.root {
  @apply flex flex-col gap-lg;
}

.actions {
  @apply flex flex-col gap-md;
  @apply sm:flex-row sm:items-center sm:justify-end;
}

.total {
  @apply text-xl font-semibold;
  @apply md:text-2xl;
}
```

### Touch and interaction

- Interactive targets (buttons, links, icon buttons, checkboxes): **minimum 44×44px** tap area — use padding/min-size in the module, not tiny hit boxes
- Do not rely on **hover-only** affordances; `:hover` may enhance but must not be the only way to discover or use a control
- Leave enough spacing between adjacent tap targets on small screens

### Content and media

- Text must remain readable without horizontal scroll; use wrapping, truncation with accessible labels, or layout reflow — never clip essential copy
- **`next/image`**: always pass appropriate `sizes` (and width/height or `fill`) so images scale and do not layout-shift
- Do not **`display: none`** (or equivalent) to hide **core** functionality on mobile — adapt layout or move it behind disclosure, not remove it

### When markup must change by viewport

If mobile and desktop need different DOM (e.g. table → card list), split into focused subcomponents (`OrderTable`, `OrderCards`) and let the parent choose — or use a small hook (`useMediaQuery`) in the orchestrator. Keep breakpoint constants in one place (`hooks/` or `lib/breakpoints.ts`), not magic numbers scattered across files.

```tsx
// ❌ BAD — responsive Tailwind in JSX + duplicated sections
function Menu({ items }: MenuProps) {
  return (
    <>
      <nav className="hidden md:flex">{/* desktop */}</nav>
      <nav className="flex md:hidden">{/* mobile — drift risk */}</nav>
    </>
  );
}

// ✅ GOOD — one module owns breakpoints; split only when structure differs
function Menu({ items }: MenuProps) {
  return (
    <nav className={styles.root}>
      {items.map((item) => (
        <MenuItem key={item.id} item={item} />
      ))}
    </nav>
  );
}
```

### Checklist (before shipping a component)

- [ ] Verified at **320px**, **768px**, and **1280px** (or real devices)
- [ ] No horizontal overflow or overlapping controls at any tested width
- [ ] Portrait and landscape on mobile/tablet where layout is non-trivial
- [ ] Touch targets and focus states work without hover
- [ ] Responsive variants are in the CSS module on their own `@apply` lines, not inline in JSX

## Rules of Thumb

- One component = one reason to change = one folder + one `types.ts` + one `ComponentName.module.css`
- Prefer named exports; default export only for pages
- Pass only the props a subcomponent needs — avoid passing entire objects when 2 fields suffice
- Don't extract prematurely: a 20-line component with clear intent is fine as-is (still include `types.ts`, even if minimal)
- **Responsive by default** — mobile-first CSS module, fluid layout, 44px touch targets; viewport logic in JSX only when the DOM structure must change

## Related

- [Global Types](./global-types.md) — domain types vs component `types.ts`
- [React Accessibility](./react-accessibility.md) — a11y for interactive components
- [Unit Testing](./unit-testing.md) — colocated component tests
