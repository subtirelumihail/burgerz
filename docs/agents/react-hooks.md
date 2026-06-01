# React Hooks

**Applies when editing:** `hooks/use*.ts`

Client hooks fetch data, hold UI state, and expose actions. Follow these patterns for every new or changed hook.

## Async handling

Use `async`/`await` with `try`/`catch`/`finally`. Do **not** chain `.then()` / `.catch()` / `.finally()`.

Do **not** use the `void` operator to discard promises (e.g. `void load()`). Expose **synchronous** actions (`search`, `clearSearch`, `load*`) that define an inner `async function` and call it directly.

```typescript
// ❌ BAD — async callback + void at call sites
const loadBurgers = useCallback(async (q?: string) => { ... }, []);
useEffect(() => { void loadBurgers(); }, [loadBurgers]);
onSearch={() => { void search(); }}

// ✅ GOOD — sync action + inner async fetch
const loadBurgers = useCallback((q?: string) => {
  setIsLoading(true);
  setError(null);

  async function fetchBurgers() {
    try {
      const response = await getBurgers({ q });
      setBurgers(response.burgers);
      setError(null);
    } catch (err) {
      setError(toError(err));
    } finally {
      setIsLoading(false);
    }
  }

  fetchBurgers();
}, []);
```

## Single-resource hooks (`useBurger`, `useRestaurant`)

Define an inner `async function` inside `useEffect`, call it directly, and guard with `isCancelled`:

```typescript
useEffect(() => {
  let isCancelled = false;

  async function loadBurger() {
    try {
      const result = await getBurger(id);
      if (!isCancelled) {
        setBurger(result);
        setError(null);
      }
    } catch (err) {
      if (!isCancelled) setError(toError(err));
    } finally {
      if (!isCancelled) setIsLoading(false);
    }
  }

  loadBurger();

  return () => {
    isCancelled = true;
  };
}, [id]);
```

## Paginated / list hooks

| Piece       | Role                                                                                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `load*`     | Sync; sets loading/error, defines inner `async function`, calls it (search, pagination)                                                                |
| `useEffect` | Separate inner `async function` for initial load; `isCancelled` guard; do not call `load*` from the effect (avoids sync `setState` in the effect body) |

```typescript
useEffect(() => {
  let isCancelled = false;

  async function loadInitialBurgers() {
    try {
      const response = await getBurgers({
        page: 1,
        pageSize: DEFAULT_BURGERS_PAGE_SIZE,
      });
      if (isCancelled) return;
      setBurgers(response.burgers);
      setError(null);
    } catch (err) {
      if (!isCancelled) setError(toError(err));
    } finally {
      if (!isCancelled) setIsLoading(false);
    }
  }

  loadInitialBurgers();

  return () => {
    isCancelled = true;
  };
}, []);
```

## Components

Pass hook actions directly to callbacks typed as `() => void`:

```typescript
<BurgerSearch onSearch={search} onClear={clearSearch} />
```

Do not wrap them in `() => { void search(); }`.

## Structure

| Piece            | Responsibility                                                     |
| ---------------- | ------------------------------------------------------------------ |
| `toError` helper | Normalize unknown errors to `Error`                                |
| State            | Data, `isLoading`, `error`, plus UI state (`query`, `page`, etc.)  |
| `load*`          | Sync entry for user-triggered reloads                              |
| `useEffect`      | Initial load and reload when deps change; guard with `isCancelled` |
| Return object    | Stable, named fields for consumers                                 |

## Errors and loading

- Set `setError(null)` on successful fetch.
- Set `setIsLoading(true)` and `setError(null)` at the start of user-triggered reloads (`load*`).
- Always clear loading in `finally`, not only in `try`.

## Related

- [Backend services](./backend-services.md) — service functions hooks call
- [Unit testing](./unit-testing.md) — colocated `use*.unit.test.tsx`
