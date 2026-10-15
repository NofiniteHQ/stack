# Nofinite Stack

The central repository for Nofinite's core infrastructure. This monorepo manages independent, versioned packages designed for a modular ecosystem.

---

## Packages

Each package is strictly decoupled and can be published or consumed independently.

| Package                                  | Purpose                                                            |
| :--------------------------------------- | :----------------------------------------------------------------- |
| **[NUI](./packages/nui)**                | Headless React component library.                                  |
| **[NUI CSS](./packages/nuicss)**         | A zero-config, semantic utility CSS framework.                     |
| **[Nofinite Charts](./packages/charts)** | Vector data visualization suite powered by modular D3 and NUICSS.  |
| **[Nofinite Kanban](./packages/kanban)** | High-performance task board powered by Pragmatic Drag and Drop.    |
| **[Nofinite Markon](./packages/markon)** | Rich text authoring engine powered by TipTap and ProseMirror.      |
| **[Nofinite Media](./packages/media)**   | Streaming audio and video media player suite powered by Vidstack.  |
| **[Nofinite Utils](./packages/utils)**   | High-performance logic & security helpers.                         |
| **[Nofinite Locale](./packages/locale)** | Standardized country data, flags, and international dialing codes. |

---

## Engine

- **Orchestration:** [Nx](https://nx.dev) handles task pipelines and caching.
- **Package Manager:** [pnpm](https://pnpm.io) for strict workspace management.
- **Build System:** [Vite](https://vitejs.dev) for JS and CSS bundling.
- **Verification:** [Vitest](https://vitest.dev) for unit and integration testing.

---

## Commands

### Setup

Install all workspace dependencies:

```bash
pnpm install
```

### Build

Nx optimizes builds by only processing packages that have changed since the last successful run.

```bash
# Build the entire stack
pnpm nx run-many -t build

# Build a specific package
pnpm nx build @nofinite/nui
```

### Testing

Maintain code integrity across the workspace.

```bash
# Run all unit tests
pnpm nx run-many -t test

# Run tests for a specific package
pnpm nx test @nofinite/utils
```

---

## License

All code within this repository is distributed under the [Apache License, Version 2.0](./LICENSE).

Feel free to use, modify, and share this project in your applications, products, and services. Attribution is welcome and appreciated, but never required.
