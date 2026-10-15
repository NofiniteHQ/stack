# VS Code & Cursor IDE Setup

NUICSS provides first-class, **pure native IntelliSense** for VS Code, Cursor, and Windsurf directly through the built-in Language Server Protocol (LSP).

No third-party marketplace extensions are required. Once configured, your editor automatically provides instant class autocompletion, rich Markdown hover previews, and design token suggestions across HTML, JSX, TSX, Vue, and Svelte files.

---

## 1. Quick Setup (Automated CLI)

The easiest way to enable IntelliSense in any project is using the NUICSS CLI:

```bash
npx @nofinite/nuicss init
```

This one command automatically:

- Creates `nuicss.config.ts` if it doesn't already exist.
- Configures `.vscode/settings.json` with the native HTML and CSS custom data sets.

---

## 2. Manual Configuration

If you prefer to configure your editor manually, add the following to your project's `.vscode/settings.json`:

```json
{
  "html.customData": [
    "./node_modules/@nofinite/nuicss/dist/nuicss.html-data.json"
  ],
  "css.customData": [
    "./node_modules/@nofinite/nuicss/dist/nuicss.css-data.json"
  ]
}
```

> [!TIP]
> Both VS Code and Cursor read these files automatically. If you don't see autocomplete immediately after adding these settings, press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS) and run **Developer: Reload Window**.

---

## 3. Features & Capabilities

### Instant Class Autocompletion

When typing `class="..."` or `className="..."` in HTML, JSX, TSX, Vue, or Svelte files, the editor dropdown displays all 50+ NUICSS superclasses:

- `btn`, `btn-primary`, `btn-secondary`, `btn-outline`, `btn-ghost`, `btn-danger`
- `card`, `card-responsive`, `metric-card`, `table-container`
- `input`, `textarea`, `select`, `switch`, `checkbox`
- `sparkline-container`, `sparkline-bar`, `progress-ring`, `metric-badge`
- Micro-interactions: `press-scale`, `hover-lift`, `glow-brand`, `skeleton-shimmer`

### Rich Hover Previews & Examples

Hovering over any NUICSS class name in your code displays:

- The component category (primitives, forms, overlays, widgets, charts).
- A concise description of its behavior and accessibility bindings.
- A drop-in HTML/JSX code example.
- The underlying atomic CSS utilities and OKLCH color rules.

### Design Token Autocomplete

In CSS, SCSS, or inline `style` attributes, typing `var(--` displays all NUICSS design tokens with their default values:

- Semantic backgrounds (`--bg-surface`, `--bg-subtle`, `--bg-page`)
- OKLCH action palettes (`--color-primary`, `--color-primary-hover`, `--color-danger`)
- Border radius tokens (`--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-full`)
- Spring easing functions (`--ease-spring`, `--ease-bounce`, `--ease-smooth`)

---

## 4. Why Native Custom Data?

| Feature                     | NUICSS Native Custom Data                  | Traditional Extensions                  |
| :-------------------------- | :----------------------------------------- | :-------------------------------------- |
| **Marketplace Download**    | âŒ None (zero extension required)          | âš ï¸ Required from VS Code Marketplace |
| **Editor Support**          | âœ… VS Code, Cursor, Windsurf, VSCodium    | âš ï¸ Often delayed or broken in forks  |
| **Performance**             | âš¡ Instant (handled by native editor LSP) | âš ï¸ Background node process overhead  |
| **Package Synchronization** | âœ… Instant on `npm update`                | âš ï¸ Wait for extension updates        |
