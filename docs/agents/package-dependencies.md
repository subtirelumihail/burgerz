# Package Dependencies

**Always apply** when adding or upgrading npm packages.

When adding or upgrading npm packages, follow both rules below.

## 1. Pin exact versions

Use fixed versions in `package.json` — no `^`, `~`, or `*`.

```json
// ❌ BAD
"lodash": "^4.17.21"
"msw": "~2.14.0"

// ✅ GOOD
"lodash": "4.17.21"
"msw": "2.14.6"
```

Install with an exact save:

```bash
npm install --save-exact <package>@<version>
npm install --save-dev --save-exact <package>@<version>
```

After adding a package, confirm `package-lock.json` resolves to that exact version.

## 2. Latest release must be at least 2 weeks old

Before adding a package, check when the target version was published. Do not add packages whose **latest** version on npm is newer than 2 weeks — pick an older stable version instead.

```bash
npm view <package> time --json
# or
npm view <package>@<version> time
```

```bash
# ❌ BAD — latest published 3 days ago
npm install --save-exact some-lib@2.0.0

# ✅ GOOD — latest published 3 weeks ago; pin that version
npm install --save-exact some-lib@1.8.4
```

If every recent version is too new, wait or choose a different library.

## Checklist

- [ ] Version pinned exactly in `package.json` (no range prefix)
- [ ] Chosen version published ≥ 2 weeks ago
- [ ] `package-lock.json` updated and committed with the change
