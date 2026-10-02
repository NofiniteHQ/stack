# nuicss

> The lightning-fast standalone compiler, codemod, and linter toolkit for the NUICSS design system.

Built in Go for **zero runtime dependencies**, instant execution ($<3\text{ms}$ startup), and cross-platform native performance (Windows, Linux x64/arm64, macOS Apple Silicon/Intel).

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
- `nuicss.config.ts` configuration file.
- `.vscode/settings.json` configured non-destructively with native HTML and CSS Custom Data for instant autocomplete and token previews in VS Code & Cursor without installing marketplace extensions (creates `.bak` backup automatically).

### 2. Compile your stylesheet

```bash
# One-time build
nuicss -i input.css -o dist/output.css

# Production minified build
nuicss -i input.css -o dist/output.css --minify

# Live watch mode (<5ms incremental rebuilds)
nuicss -i input.css -o dist/output.css --watch

# UNIX pipeline streaming (stdin -> stdout)
cat input.css | nuicss -i - -o - > dist/output.css
```

### 3. Lint your codebase for design system compliance

```bash
nuicss check src/
```

Scans `.tsx`, `.jsx`, `.vue`, `.svelte`, `.html` files for hardcoded hex colors (`#ffffff`) and unmigrated Tailwind utility soup, guaranteeing adherence to NUICSS design tokens and superclasses.

---

## Commands

| Command                      | Description                                                               |
| :--------------------------- | :------------------------------------------------------------------------ |
| `nuicss -i <file> -o <file>` | Compiles `@nuicss;` directives into production-ready CSS.                 |
| `nuicss compile, build`      | Compiles CSS stylesheets with flags (`-i`, `-o`, `-w`, `-m`).             |
| `nuicss check [path]`        | Design system linter: checks for hardcoded colors and legacy clusters.    |
| `nuicss init`                | Initializes project configuration and IDE IntelliSense non-destructively. |
| `nuicss migrate [path]`      | Codemod: converts legacy Tailwind utility soup into NUICSS superclasses.  |
| `nuicss tokens`              | Inspects OKLCH color palettes and design tokens in the terminal.          |
| `nuicss list`                | Lists available components across NUI, Charts, Kanban, Markon.            |
| `nuicss version, -v`         | Prints CLI and engine version.                                            |
| `nuicss help, -h`            | Displays detailed usage and options.                                      |

---

## Options

- `-i, --input <file>`: Input CSS file path (use `-` for stdin, default: `input.css`).
- `-o, --output <file>`: Output CSS file path (use `-` for stdout, default: `dist/output.css`).
- `-w, --watch`: Watches input CSS and template files for instant rebuilds.
- `-m, --minify`: Compresses and minifies CSS for production adhering to CSS specifications.
- `--dry-run`: Previews codemod changes without modifying files (used with `nuicss migrate`).

---

## License

MIT © [NofiniteHQ](https://github.com/NofiniteHQ)
