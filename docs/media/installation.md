# Installation & Setup

Add **Nofinite Media** (`@nofinite/media`) to your React application.

---

## 1. Package Installation

Install the package alongside its peer dependencies:

```bash
# pnpm
pnpm add @nofinite/media @nofinite/nuicss

# npm
npm install @nofinite/media @nofinite/nuicss

# yarn
yarn add @nofinite/media @nofinite/nuicss
```

---

## 2. Stylesheet Configuration

Import the unified NUICSS stylesheet:

```tsx
import '@nofinite/nuicss/styles.css';
```

> **Zero Downstream CSS Note:** Do **not** import `@nofinite/media/styles.css`. NUICSS provides all necessary player layouts, scrubber timelines, and control tokens automatically.

### Optional: Modular Subpath Import

If your application uses fine-grained CSS tree-shaking, you can import only the media player stylesheet:

```tsx
import '@nofinite/nuicss/media.css';
```

---

## 3. Basic Import

Import components from `@nofinite/media/react`:

```tsx
import { VideoPlayer, AudioPlayer } from '@nofinite/media/react';
```
