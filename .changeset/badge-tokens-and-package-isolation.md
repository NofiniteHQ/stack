---
'@nofinite/nui': patch
'@nofinite/nuicss': patch
---

### 🎨 Design System Token Alignment & Monorepo Package Isolation

#### `@nofinite/nui`

- **Badge Canonical Superclasses**: Refactored `Badge` component to strictly use `@nofinite/nuicss` canonical superclasses (`badge-default`, `badge-primary`, `badge-success`, `badge-warning`, `badge-danger`, `badge-outline`). Removed legacy utility override clusters and hardcoded text color definitions.
- **DialogProvider Modal Architecture**: Structured dialog action buttons within the canonical `footer` prop of `<Modal>`, ensuring accessibility and responsive alignment.
- **Test Infrastructure Hardening**: Added `HTMLCanvasElement.prototype.getContext` mocking to the test environment setup, resolving happy-dom runner warnings across all 86 test suites.

#### `@nofinite/nuicss`

- **New Superclass `badge-outline`**: Added canonical `badge-outline` primitive shortcut (`bg-transparent text-default border border-default`) to complete the badge variant design tokens.
- **Strict Package Isolation**: Cleaned internal aliases and ensured public packages remain completely self-contained and isolated from internal monorepo naming conventions.
