# Nofinite Stack

The central repository for Nofinite's core infrastructure. This monorepo manages independent, versioned packages designed for a modular ecosystem.

---

## Packages

Each package is strictly decoupled and can be published or consumed independently.

| Package | Purpose |
| :--- | :--- |
| **NUI ([`@nofinite/nui`](./packages/nui))** | Headless React component library. |
| **NUI CSS ([`@nofinite/nuicss`](./packages/nuicss))** | A zero-config, semantic utility CSS framework. |
| **Utils ([`@nofinite/utils`](./packages/utils))** | High-performance logic & security helpers. |
| **Locale ([`@nofinite/locale`](./packages/locale))** | Lightweight library for country metadata, flags, and international dialing codes. |

---

## Engine

* **Orchestration:** [Nx](https://nx.dev) handles task pipelines and caching.
* **Package Manager:** [pnpm](https://pnpm.io) for strict workspace management.
* **Build System:** [Vite](https://vitejs.dev) for JS and CSS bundling.
* **Verification:** [Vitest](https://vitest.dev) for unit and integration testing.

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