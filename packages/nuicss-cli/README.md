# nuicss

> The lightning-fast standalone compiler and CLI toolkit for the NUICSS design system.

Built in Go for **zero runtime dependencies**, instant execution ($<3\text{ms}$ startup), and cross-platform native performance (Windows, Linux, macOS).

---

## Installation

### Via NPM / NPX (Zero configuration)

Run instantly without installing anything:

```bash
npx nuicss -i input.css -o dist/output.css --watch
```

Or install globally:

```bash
npm install -g nuicss
# or
pnpm add -g nuicss
```

### Standalone Binary (For Go, Python, Rust, PHP, or Docker)

If you don't use Node.js, download the pre-compiled binary for your operating system from GitHub Releases, or compile it with:

```bash
go install github.com/nofinitehq/stack/packages/nuicss-cli/cmd/nuicss@latest
```

---

## Quick Start

### 1. Initialize your project

```bash
nuicss init
```

This generates:

- `input.css` containing the `@nuicss;` directive.
- `.vscode/settings.json` configured with native HTML and CSS Custom Data for instant autocomplete and token previews in VS Code & Cursor without installing marketplace extensions.

### 2. Compile your stylesheet

```bash
# One-time build
nuicss -i input.css -o dist/output.css

# Production minified build
nuicss -i input.css -o dist/output.css --minify

# Live watch mode (<5ms incremental rebuilds)
nuicss -i input.css -o dist/output.css --watch
```

---

## Commands

| Command                      | Description                                                                       |
| :--------------------------- | :-------------------------------------------------------------------------------- |
| `nuicss -i <file> -o <file>` | Compiles `@nuicss;` directives into production-ready CSS.                         |
| `nuicss init`                | Initializes project configuration and IDE IntelliSense.                           |
| `nuicss migrate [path]`      | Codemod: converts legacy Tailwind utility soup into NUICSS superclasses.          |
| `nuicss tokens`              | Inspects OKLCH color palettes and design tokens in the terminal.                  |
| `nuicss add <component>`     | Scaffolds ecosystem components (`dialog`, `button`, `chart`, `kanban`, `editor`). |
| `nuicss list`                | Lists all available ecosystem components.                                         |
| `nuicss version, -v`         | Prints CLI and engine version.                                                    |

---

## Options

- `-i, --input <file>`: Input CSS file path (default: `input.css`).
- `-o, --output <file>`: Output CSS file path (default: `dist/output.css`).
- `-w, --watch`: Watches input CSS and template files for instant rebuilds.
- `-m, --minify`: Compresses and minifies CSS for production.
- `--dry-run`: Previews codemod changes without modifying files (used with `nuicss migrate`).

---

## License

MIT © [NofiniteHQ](https://github.com/NofiniteHQ)
