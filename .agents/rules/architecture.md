# Architecture Rules

## Purpose

Preserve architectural consistency and avoid unnecessary complexity.

---

## 1. Understand Before Changing

Before changing architecture:

- Inspect the current architecture.
- Identify dependencies between affected modules.
- Search for existing patterns.
- Understand data flow and control flow.
- Identify public interfaces and consumers.

Do not redesign a system based only on filenames or assumptions.

---

## 2. Prefer Existing Patterns

Follow established repository conventions for:

- Folder structure
- Module boundaries
- Naming
- Dependency direction
- APIs
- State management
- Error handling
- Data access
- Configuration
- Testing

A new pattern requires justification.

---

## 3. Avoid Overengineering

Do not introduce:

- Unnecessary abstractions
- Unnecessary services
- Unnecessary layers
- Premature microservices
- Speculative extensibility
- Complex design patterns without a real requirement

Prefer the simplest architecture that satisfies the actual requirement.

---

## 4. Boundaries

Respect existing boundaries between:

- Applications
- Libraries
- Domains
- Infrastructure
- Presentation
- Data access
- External integrations

Do not bypass architectural boundaries merely because doing so is faster.

---

## 5. Public Interfaces

Treat these as potentially public:

- APIs
- Library exports
- Components
- SDK interfaces
- Database schemas
- Configuration formats

Before changing them, inspect consumers and compatibility requirements.

---

## 6. Architectural Changes

Any major architectural change requires:

- Explicit implementation plan
- Alternatives considered
- Trade-offs
- Migration considerations
- Compatibility analysis
- Verification strategy
- Explicit user approval

Never silently perform architectural redesign during feature implementation.

## Stack Build-System Constraints

- Avoid importing raw CSS into TypeScript modules that are evaluated directly by Node.js tooling such as Nx project graph processing, Vitest, Jest, UnoCSS, or Jiti.
- When configuration requires a NUICSS preset, prefer the appropriate source submodule rather than an entrypoint that causes Node tooling to traverse CSS.
- Preserve `@nofinite/nuicss` as an external dependency in the NUI build when required to prevent Rollup from traversing package source unexpectedly.
- Preserve the established `preserveModules` packaging architecture unless an approved architectural change explicitly changes it.

## Stack Design-System Architecture

`@nofinite/nuicss` is the source of truth for Stack design tokens, semantic colors, and semantic CSS superclasses.

When an appropriate NUICSS token or superclass already exists:

- Do not introduce duplicate design tokens.
- Do not hardcode equivalent colors.
- Do not recreate existing semantic component classes.
- Do not replace established semantic classes with unnecessarily large utility-class combinations.

NUI components and other packages should consume the established NUICSS design system rather than recreating visual primitives locally.

## Upstream Library Fixes

When a styling or component problem originates in `@nofinite/nui` or `@nofinite/nuicss`, fix the problem at the owning library.

Do not introduce downstream CSS overrides, utility patches, or consumer-specific workarounds merely to hide an upstream defect.

Verify the upstream fix by rebuilding and testing the affected package and its relevant consumer.

## Public Package Isolation

Public packages MUST NOT reference internal-only packages.

Public packages and their distributed artifacts must remain self-contained according to the established package architecture.

## NUI Component Architecture

When modifying NUI components, preserve the established component model:

- `Slot` / `asChild` polymorphic composition where applicable.
- Compound component patterns for complex components.
- Existing ref composition behavior.
- Existing accessibility utilities and focus-management architecture.
- Existing React Server Component/client-boundary behavior.
- Existing tree-shaking and preserved-module packaging behavior.

Do not replace established architectural patterns with a new component model without explicit architectural approval.

## Accessibility Architecture

NUI components use internal accessibility utilities for:

- focus trapping
- focus restoration
- roving tabindex
- DOM isolation
- `inert` management
- scroll locking
- portal rendering

When modifying interactive components, preserve these existing accessibility and interaction contracts.

## State Styling

Prefer native semantic and WAI-ARIA state attributes for visual state styling where the component architecture supports them.

Examples include:

- `aria-invalid`
- `aria-selected`
- `aria-expanded`
- `aria-checked`

Avoid duplicating the same state through unnecessary custom JavaScript-driven CSS classes.

---

## Ecosystem Agent Standards & Observed Patterns

All engineering agents working in this ecosystem must adhere to these governing standards:

### 1. Root-Cause Upstream Fix Rule (Zero Downstream Monkey-Patching)

- When a styling or component defect appears in downstream applications or documentation (`nuix`, `oss-docs`), **never** add quick-fix CSS classes or manual style monkey-patches in `globals.css` or component files.
- All fixes must be implemented upstream in `@nofinite/nuicss` or `@nofinite/nui`, verified, built, and cleanly consumed downstream.

### 2. The "Green Test" Fallacy & Compulsory Visual Validation

- Unit tests (`vitest`, `jest`) only verify DOM nodes, props, and boolean state; they **never** prove visual aesthetics, spatial harmony, contrast ratios, border rendering, or backdrop filters.
- Any UI, styling, or component change requires visual verification (browser inspection or Playwright screenshot in `/temp/`) before declaring completion.

### 3. Native IDE Tooling Over Fragile Extensions

- Leverage standard VS Code & Cursor Custom Data specifications (`html.customData` and `css.customData`) generated automatically from the single source of truth tokens rather than forcing users to install third-party IDE extensions.

### 4. CLI & Product Boundary Architecture

- **`nuicss` CLI (`packages/nuicss-cli`)**: The public, standalone Go-native binary for zero-Node CSS compilation (`nuicss -i input.css -o output.css -w -m`), Tailwind-to-NUICSS codemods (`nuicss migrate`), IDE setup (`nuicss init`), and cross-ecosystem UI scaffolding (`nuicss add <component>`).
- **`nofinite` CLI (`packages/cli`)**: The developer platform and cloud services CLI dedicated to developer authentication, SSO, API access, cloud deployments, and internal development tools. Do not mix platform SSO concerns into the standalone CSS compiler.
