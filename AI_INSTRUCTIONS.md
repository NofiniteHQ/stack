# AI Agent Guidelines for Nofinite Stack

Welcome, fellow AI! If you are modifying this codebase, please read and adhere strictly to the following architectural quirks and repository rules to avoid breaking the CI/CD pipelines or Next.js builds.

## 1. Release & Versioning Pipeline (CRITICAL)

This monorepo has a split release pipeline. You must version packages according to how their GitHub Actions are configured.

### `@nofinite/nui` and `@nofinite/nuicss` (Changesets)
- **Rule:** NEVER manually bump the `version` field in `package.json`.
- **Why:** These packages are managed by `changesets/action@v2`. Manually bumping the version breaks the release PR generation and causes state mismatches.
- **How to update:** To trigger a version bump, you MUST create a markdown file in the `.changeset/` directory (or run `pnpm changeset`). The GitHub Action bot will handle bumping the `package.json` automatically during the PR phase.

### `@nofinite/cli` (Standard NPM Publish)
- **Rule:** YOU MUST manually bump the `version` field in `packages/cli/package.json`.
- **Why:** The CLI is managed by `ci-cli.yml`, which triggers a direct `npm publish` on push to `main`. It does NOT use changesets. 

---

## 2. Next.js & Nuicss Integration

Nuicss is a custom UnoCSS-powered design system wrapper. When integrating it into Next.js (especially Turbopack), follow these strict rules:

### CSS Imports
- **Rule:** Always import the base Nuicss stylesheet directly into `layout.tsx` using the **literal physical path**:
  ```tsx
  import '@nofinite/nuicss/dist/index.css';
  ```
- **Why:** Next.js Turbopack has a known limitation where it ignores `package.json` `"exports"` maps for non-Javascript files (like `.css`). If you use the alias `import '@nofinite/nuicss/styles.css'`, Turbopack will fail to find it, drop the import entirely, and the entire app will lose its styles.
- **Rule:** Do NOT use `@import '@nofinite/nuicss/...';` inside `globals.css` unless `postcss-import` is installed and explicitly configured, as Turbopack will not resolve the `node_modules` path natively.

### The `@nuicss;` Directive
- Place `@nuicss;` in the `globals.css` file. The `@nofinite/nuicss/postcss` plugin will parse this and inject the JIT utility classes.

---

## 3. NUI Component Architecture

When modifying or creating new React components in `packages/nui`:

### Semantic Tokens
- **Rule:** NEVER use hardcoded Tailwind hex colors (e.g., `bg-[#0a0a0b]`) or standard Tailwind colors (e.g., `bg-blue-500`).
- **Rule:** ALWAYS use the Nuicss semantic design tokens:
  - Backgrounds: `bg-page`, `bg-surface`, `bg-subtle`, `bg-muted`
  - Text: `text-default`, `text-subtle`, `text-muted`, `text-inverse`
  - Borders: `border-default`, `border-subtle`, `border-strong`
  - States: `hover:bg-subtle`, `disabled:bg-subtle`, `disabled:opacity-50`

### Polymorphic `asChild` (Radix UI Slot)
- **Rule:** If a component accepts `asChild` (polymorphism), you must prevent invalid DOM attributes (like `disabled`) from bleeding onto the child element.
- **Why:** If the user passes `<Button asChild disabled><Link>...</Link></Button>`, the `disabled` attribute will bleed onto the `<a>` tag, which causes React hydration warnings and accessibility errors because `<a>` does not support `disabled`.
- **Fix:** Conditionally apply the attribute: `disabled={asChild ? undefined : isDisabled}` and use `aria-disabled` and `e.preventDefault()` inside the `onClick` handler.
