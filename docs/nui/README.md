# NUI

> Core headless, accessible, and polymorphic React component library powered by NUICSS.

---

## Overview

**NUI** (`@nofinite/nui`) is the foundational React component library of the Nofinite ecosystem. It provides fully accessible, composable UI primitives designed with:

- **Polymorphic Composition (`asChild` / `Slot`):** Render any underlying HTML element or router link without losing props or event handlers.
- **Strict Accessibility:** Full WAI-ARIA compliance, automatic focus restoration, focus trapping, roving tabindex, and screen reader announcements.
- **Strict Compound Hierarchy:** Clean declarative APIs (e.g., `<Modal><Modal.Trigger /><Modal.Content /></Modal>`).
- **Zero Style Drift:** All components strictly consume **NUICSS** superclasses and OKLCH design tokens.

---

## Quickstart

### 1. Installation

```bash
npm install @nofinite/nui @nofinite/nuicss
# or
pnpm add @nofinite/nui @nofinite/nuicss
```

### 2. Stylesheet Setup

Ensure NUICSS is imported in your application layout:

```tsx
import '@nofinite/nuicss/styles.css';
```

### 3. Usage Example

```tsx
import React, { useState } from 'react';
import { Button, Modal, Badge } from '@nofinite/nui';

export function ExampleModal() {
  const [open, setOpen] = useState(false);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <Modal.Trigger asChild>
        <Button variant="primary">
          Open Settings <Badge variant="neutral">New</Badge>
        </Button>
      </Modal.Trigger>

      <Modal.Content
        title="Project Settings"
        description="Manage your team preferences and integrations."
      >
        <p className="text-body">
          Configure workspace access and API keys below.
        </p>
        <Modal.Footer>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setOpen(false)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
```

---

## Component Catalog

### Primitives & Inputs

- `Button` — Polymorphic action buttons with primary, secondary, ghost, and destructive variants.
- `Input` / `Textarea` — Accessible inputs with integrated label and error helper text.
- `Checkbox` / `Switch` / `RadioGroup` — Form selection controls with animated indicators.
- `Badge` / `Tag` — Compact status pills with OKLCH semantic color mapping.

### Overlays & Portals

- `Modal` / `Dialog` — Accessible modal dialogs with glassmorphic `backdrop-blur-sm` overlays.
- `Sheet` — Slide-out side drawer panels (left, right, top, bottom).
- `DropdownMenu` — Roving-tabindex context and action menus with submenus and dividers.
- `Tooltip` / `Popover` — Floating positioning with auto-flip and collision detection.

### Data & Content

- `Table` — Semantic tables wrapped in responsive `.table-container`.
- `CodeBlock` — Syntax-highlighted code viewer supporting 16 programming languages with copy-to-clipboard.
- `Accordion` — Collapsible multi-section content accordions.
- `Tabs` — Accessible tabbed content switchers.
