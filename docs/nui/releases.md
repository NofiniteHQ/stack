---
title: Releases
sidebar_position: 999
---

# @nofinite/nui — v3.3.0

**Latest release:** `3.3.0` (Apache-2.0)

---

## Overview

**NUI** (`@nofinite/nui`) `v3.3.0` provides accessible, composable React 18/19 UI components built strictly on top of `@nofinite/nuicss` OKLCH design tokens and semantic superclasses.

---

## Highlights in `v3.3.0`

- **Comprehensive Component Suite:** Overlays (`Modal`, `DialogProvider`, `Drawer`, `Dropdown`, `Popover`, `Tooltip`, `HoverCard`, `ContextMenu`, `FloatingArrow`), Forms (`Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`, `NumberInput`, `PasswordInput`, `PinInput`, `FileUploader`, `Dropzone`, `DatePicker`, `DateRangePicker`, `TimeRangePicker`, `ColorPicker`, `Form`), Navigation (`Tabs`, `Accordion`, `Breadcrumbs`, `Pagination`, `MegaMenu`, `Sidebar`, `Navbar`), and Data/Layout primitives (`DataGrid`, `TreeView`, `VirtualList`, `Calendar`, `Timeline`, `StatCard`, `Toast`, `EmptyState`).
- **NUICSS 3.2.0 Neutral Token Alignment:** Unified neutral-default surface/border/foreground tokens with glassmorphic `bg-overlay backdrop-blur-sm` overlays.
- **Standalone Domain Packages:** Charts (`@nofinite/charts`), Kanban (`@nofinite/kanban`), Markon (`@nofinite/markon`), Media (`@nofinite/media`), Locale (`@nofinite/locale`), and Utils (`@nofinite/utils`) distributed independently for optimal tree-shaking.
- **Accessibility & Contract Guarantees:** WCAG 2.2 AA focus management, ARIA state selectors, binary confirmation dialog `hideCloseButton` invariant, and SSR compatibility across Next.js and Vite.
