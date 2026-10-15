---
title: Theme Tokens
sidebar_position: 4
---

# NUI Theme Tokens Reference

This document lists all available NUI design tokens with their default values. Users can override semantic tokens to customize the theme.

---

## 1. Primitive Tokens (Internal Palette)

### Neutral

| Token             | Default                                                                                                                                       |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `--nui-white`     | <span style={{ background: "#ffffff", color: "black", padding: "4px 10px", borderRadius: "6px", border: "1px solid #e5e7eb" }}>#FFFFFF</span> |
| `--nui-black`     | <span style={{ background: "#000000", color: "white", padding: "4px 10px", borderRadius: "6px" }}>#000000</span>                              |
| `--nui-slate-50`  | <span style={{ background: "#f8fafc", color: "black", padding: "4px 10px", borderRadius: "6px", border: "1px solid #e5e7eb" }}>#F8FAFC</span> |
| `--nui-slate-100` | <span style={{ background: "#f1f5f9", color: "black", padding: "4px 10px", borderRadius: "6px", border: "1px solid #e5e7eb" }}>#F1F5F9</span> |
| `--nui-slate-200` | <span style={{ background: "#e2e8f0", color: "black", padding: "4px 10px", borderRadius: "6px" }}>#E2E8F0</span>                              |
| `--nui-slate-300` | <span style={{ background: "#cbd5e1", color: "black", padding: "4px 10px", borderRadius: "6px" }}>#CBD5E1</span>                              |
| `--nui-slate-400` | <span style={{ background: "#94a3b8", color: "white", padding: "4px 10px", borderRadius: "6px" }}>#94A3B8</span>                              |
| `--nui-slate-500` | <span style={{ background: "#64748b", color: "white", padding: "4px 10px", borderRadius: "6px" }}>#64748B</span>                              |
| `--nui-slate-600` | <span style={{ background: "#475569", color: "white", padding: "4px 10px", borderRadius: "6px" }}>#475569</span>                              |
| `--nui-slate-700` | <span style={{ background: "#334155", color: "white", padding: "4px 10px", borderRadius: "6px" }}>#334155</span>                              |
| `--nui-slate-800` | <span style={{ background: "#1e293b", color: "white", padding: "4px 10px", borderRadius: "6px" }}>#1E293B</span>                              |
| `--nui-slate-900` | <span style={{ background: "#0f172a", color: "white", padding: "4px 10px", borderRadius: "6px" }}>#0F172A</span>                              |
| `--nui-slate-950` | <span style={{ background: "#020617", color: "white", padding: "4px 10px", borderRadius: "6px" }}>#020617</span>                              |

### Brand

| Token             | Default                                                                                                                                       |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `--nui-brand-50`  | <span style={{ background: "#eff6ff", color: "black", padding: "4px 10px", borderRadius: "6px", border: "1px solid #e5e7eb" }}>#EFF6FF</span> |
| `--nui-brand-100` | <span style={{ background: "#dbeafe", color: "black", padding: "4px 10px", borderRadius: "6px" }}>#DBEAFE</span>                              |
| `--nui-brand-500` | <span style={{ background: "#3b82f6", color: "white", padding: "4px 10px", borderRadius: "6px" }}>#3B82F6</span>                              |
| `--nui-brand-600` | <span style={{ background: "#2563eb", color: "white", padding: "4px 10px", borderRadius: "6px" }}>#2563EB</span>                              |
| `--nui-brand-700` | <span style={{ background: "#1d4ed8", color: "white", padding: "4px 10px", borderRadius: "6px" }}>#1D4ED8</span>                              |

### State

| Token             | Default                                                                                                          |
| ----------------- | ---------------------------------------------------------------------------------------------------------------- |
| `--nui-red-500`   | <span style={{ background: "#ef4444", color: "white", padding: "4px 10px", borderRadius: "6px" }}>#EF4444</span> |
| `--nui-red-600`   | <span style={{ background: "#dc2626", color: "white", padding: "4px 10px", borderRadius: "6px" }}>#DC2626</span> |
| `--nui-amber-500` | <span style={{ background: "#f59e0b", color: "black", padding: "4px 10px", borderRadius: "6px" }}>#F59E0B</span> |
| `--nui-green-500` | <span style={{ background: "#10b981", color: "white", padding: "4px 10px", borderRadius: "6px" }}>#10B981</span> |

---

## 2. Semantic Tokens (Customizable)

### Background

- --nui-bg-page: var(--nui-white)
- --nui-bg-surface: var(--nui-white)
- --nui-bg-subtle: var(--nui-slate-50)
- --nui-bg-muted: var(--nui-slate-100)
- --nui-bg-overlay: rgba(0, 0, 0, 0.4)
- --nui-bg-selected: color-mix(in srgb, var(--nui-color-primary) 8%, transparent)
- --nui-bg-selected-hover: color-mix(in srgb, var(--nui-color-primary) 12%, transparent)

### Foreground

- --nui-fg-default: var(--nui-slate-900)
- --nui-fg-subtle: var(--nui-slate-500)
- --nui-fg-inverse: var(--nui-white)
- --nui-fg-disabled: var(--nui-slate-400)

### Borders

- --nui-border-default: var(--nui-slate-200)
- --nui-border-hover: var(--nui-slate-300)
- --nui-border-focus: var(--nui-brand-500)

### Primary

- --nui-color-primary: var(--nui-brand-600)
- --nui-color-primary-fg: var(--nui-white)
- --nui-color-primary-hover: var(--nui-brand-700)

### Feedback

- --nui-color-danger: var(--nui-red-500)
- --nui-color-danger-fg: var(--nui-white)
- --nui-color-success: var(--nui-green-500)
- --nui-color-success-fg: var(--nui-white)
- --nui-color-warning: var(--nui-amber-500)
- --nui-color-warning-fg: var(--nui-white)

---

## 3. Layout & Typography

### Spacing

- --nui-space-1: 0.25rem
- --nui-space-2: 0.5rem
- --nui-space-3: 0.75rem
- --nui-space-4: 1rem
- --nui-space-5: 1.25rem
- --nui-space-6: 1.5rem
- --nui-space-8: 2rem
- --nui-space-12: 3rem

### Radius

- --nui-radius-sm: 0.25rem
- --nui-radius-md: 0.375rem
- --nui-radius-lg: 0.5rem
- --nui-radius-full: 9999px

### Typography

- --nui-font-sans: ui-sans-serif, system-ui, -apple-system, sans-serif
- --nui-text-xs: 0.75rem
- --nui-text-sm: 0.875rem
- --nui-text-base: 1rem
- --nui-text-lg: 1.125rem
- --nui-text-xl: 1.25rem
- --nui-weight-medium: 500
- --nui-weight-bold: 600

### Z Index

- --nui-z-base: 0
- --nui-z-docked: 10
- --nui-z-dropdown: 1000
- --nui-z-sticky: 1100
- --nui-z-modal: 1300
- --nui-z-tooltip: 1500

---

## 4. Dark Mode Overrides

- --nui-bg-page: var(--nui-slate-950)
- --nui-bg-surface: var(--nui-slate-900)
- --nui-bg-subtle: var(--nui-slate-800)
- --nui-bg-muted: var(--nui-slate-800)
- --nui-bg-overlay: rgba(0, 0, 0, 0.7)
- --nui-bg-selected: color-mix(in srgb, var(--nui-color-primary) 20%, transparent)
- --nui-bg-selected-hover: color-mix(in srgb, var(--nui-color-primary) 30%, transparent)
- --nui-fg-default: var(--nui-slate-50)
- --nui-fg-subtle: var(--nui-slate-400)
- --nui-fg-inverse: var(--nui-slate-900)
- --nui-fg-disabled: var(--nui-slate-600)
- --nui-border-default: var(--nui-slate-800)
- --nui-border-hover: var(--nui-slate-700)
- --nui-color-primary: var(--nui-brand-500)
- --nui-color-primary-hover: var(--nui-brand-600)

---

## Customization Guidance

- Override semantic tokens only
- Import overrides after NUI styles
- Support both light and dark theme overrides
