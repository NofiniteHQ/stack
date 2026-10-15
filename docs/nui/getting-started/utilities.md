---
title: Utilities
sidebar_position: 5
---

# Utilities

NUI provides a small set of **low-specificity utility classes** for layout, spacing, typography, and visual styling.

Utilities are designed to:

- speed up composition
- reduce custom CSS
- preserve token-driven theming
- maintain low CSS specificity
- remain framework-agnostic

All utilities consume values from the theme token system.

---

## Usage

```tsx
<div className="nui-flex nui-items-center nui-gap-2 nui-p-4 nui-bg-surface nui-rounded-md">
  Content
</div>
```

---

## Design Principles

### Token-driven

Utilities never hardcode values.
They always reference design tokens.

Example:

```
nui-p-4 → var(--nui-space-4)
nui-bg-surface → var(--nui-bg-surface)
nui-rounded-md → var(--nui-radius-md)
```

---

### Low Specificity

Utilities use single-class selectors only.
This prevents override conflicts.

---

### Not a Tailwind Replacement

NUI utilities are intentionally minimal and focus on:

- layout composition
- spacing
- typography
- theme alignment

---

## Utility Categories

## 1. Display & Layout

| Class                 | Description                   |
| --------------------- | ----------------------------- |
| .nui-block            | display:block                 |
| .nui-inline-block     | display:inline-block          |
| .nui-hidden           | display:none                  |
| .nui-flex             | display:flex                  |
| .nui-inline-flex      | display:inline-flex           |
| .nui-grid             | display:grid                  |
| .nui-flex-row         | flex-direction:row            |
| .nui-flex-col         | flex-direction:column         |
| .nui-flex-row-reverse | flex-direction:row-reverse    |
| .nui-flex-col-reverse | flex-direction:column-reverse |
| .nui-flex-wrap        | flex-wrap:wrap                |
| .nui-flex-nowrap      | flex-wrap:nowrap              |
| .nui-items-start      | align-items:flex-start        |
| .nui-items-center     | align-items:center            |
| .nui-items-end        | align-items:flex-end          |
| .nui-items-baseline   | align-items:baseline          |
| .nui-items-stretch    | align-items:stretch           |
| .nui-justify-start    | justify-content:flex-start    |
| .nui-justify-center   | justify-content:center        |
| .nui-justify-end      | justify-content:flex-end      |
| .nui-justify-between  | justify-content:space-between |
| .nui-justify-around   | justify-content:space-around  |
| .nui-flex-1           | flex:1 1 0%                   |
| .nui-flex-auto        | flex:1 1 auto                 |
| .nui-flex-none        | flex:none                     |
| .nui-grow             | flex-grow:1                   |
| .nui-shrink-0         | flex-shrink:0                 |

---

## 2. Positioning & Z-Index

| Class                 | Description                |
| --------------------- | -------------------------- |
| .nui-relative         | position:relative          |
| .nui-absolute         | position:absolute          |
| .nui-fixed            | position:fixed             |
| .nui-inset-0          | inset:0                    |
| .nui-top-0            | top:0                      |
| .nui-right-0          | right:0                    |
| .nui-bottom-0         | bottom:0                   |
| .nui-left-0           | left:0                     |
| .nui-translate-x-half | transform:translateX(-50%) |
| .nui-translate-y-half | transform:translateY(-50%) |
| .nui-center-absolute  | absolute center            |
| .nui-z-docked         | docked z-index             |
| .nui-z-dropdown       | dropdown z-index           |
| .nui-z-modal          | modal z-index              |

---

## 3. Sizing

| Class           | Description     |
| --------------- | --------------- |
| .nui-w-full     | width:100%      |
| .nui-w-screen   | width:100vw     |
| .nui-w-auto     | width:auto      |
| .nui-w-64       | width:16rem     |
| .nui-w-80       | width:20rem     |
| .nui-h-full     | height:100%     |
| .nui-h-screen   | height:100vh    |
| .nui-h-auto     | height:auto     |
| .nui-max-w-sm   | max-width:24rem |
| .nui-max-w-md   | max-width:28rem |
| .nui-max-w-lg   | max-width:32rem |
| .nui-max-w-xl   | max-width:36rem |
| .nui-max-w-full | max-width:100%  |

---

## 4. Spacing

| Class        | Description            |
| ------------ | ---------------------- |
| .nui-p-0     | padding:0              |
| .nui-p-1     | padding:space-1        |
| .nui-p-2     | padding:space-2        |
| .nui-p-3     | padding:space-3        |
| .nui-p-4     | padding:space-4        |
| .nui-p-5     | padding:space-5        |
| .nui-p-6     | padding:space-6        |
| .nui-p-8     | padding:space-8        |
| .nui-px-2    | padding-x space-2      |
| .nui-px-4    | padding-x space-4      |
| .nui-px-6    | padding-x space-6      |
| .nui-px-8    | padding-x space-8      |
| .nui-py-2    | padding-y space-2      |
| .nui-py-4    | padding-y space-4      |
| .nui-py-6    | padding-y space-6      |
| .nui-py-8    | padding-y space-8      |
| .nui-pt-2    | padding-top space-2    |
| .nui-pt-4    | padding-top space-4    |
| .nui-pb-2    | padding-bottom space-2 |
| .nui-pb-4    | padding-bottom space-4 |
| .nui-pl-4    | padding-left space-4   |
| .nui-pr-4    | padding-right space-4  |
| .nui-m-0     | margin:0               |
| .nui-m-auto  | margin:auto            |
| .nui-mt-0    | margin-top:0           |
| .nui-mt-1    | margin-top space-1     |
| .nui-mt-2    | margin-top space-2     |
| .nui-mt-4    | margin-top space-4     |
| .nui-mt-6    | margin-top space-6     |
| .nui-mt-8    | margin-top space-8     |
| .nui-mb-1    | margin-bottom space-1  |
| .nui-mb-2    | margin-bottom space-2  |
| .nui-mb-4    | margin-bottom space-4  |
| .nui-mb-6    | margin-bottom space-6  |
| .nui-mb-8    | margin-bottom space-8  |
| .nui-ml-2    | margin-left space-2    |
| .nui-ml-4    | margin-left space-4    |
| .nui-ml-auto | margin-left:auto       |
| .nui-mr-2    | margin-right space-2   |
| .nui-mr-4    | margin-right space-4   |
| .nui-mx-auto | margin-x auto          |
| .nui-mx-2    | margin-x space-2       |
| .nui-mx-4    | margin-x space-4       |
| .nui-my-2    | margin-y space-2       |
| .nui-my-4    | margin-y space-4       |
| .nui-gap-1   | gap space-1            |
| .nui-gap-2   | gap space-2            |
| .nui-gap-3   | gap space-3            |
| .nui-gap-4   | gap space-4            |
| .nui-gap-6   | gap space-6            |
| .nui-gap-8   | gap space-8            |

---

## 5. Typography

| Class                    | Description        |
| ------------------------ | ------------------ |
| .nui-text-xs             | font-size xs       |
| .nui-text-sm             | font-size sm       |
| .nui-text-base           | font-size base     |
| .nui-text-lg             | font-size lg       |
| .nui-text-xl             | font-size xl       |
| .nui-font-normal         | font-weight 400    |
| .nui-font-medium         | font-weight medium |
| .nui-font-bold           | font-weight bold   |
| .nui-text-left           | text-align left    |
| .nui-text-center         | text-align center  |
| .nui-text-right          | text-align right   |
| .nui-uppercase           | uppercase          |
| .nui-capitalize          | capitalize         |
| .nui-truncate            | text truncate      |
| .nui-no-underline        | no underline       |
| .nui-underline           | underline          |
| .nui-line-through        | line-through       |
| .nui-italic              | italic             |
| .nui-not-italic          | normal style       |
| .nui-whitespace-nowrap   | nowrap             |
| .nui-whitespace-pre-wrap | pre-wrap           |

---

## 6. Visuals

| Class                | Description            |
| -------------------- | ---------------------- |
| .nui-bg-page         | background page        |
| .nui-bg-surface      | background surface     |
| .nui-bg-subtle       | background subtle      |
| .nui-bg-transparent  | transparent background |
| .nui-text-default    | default text color     |
| .nui-text-subtle     | subtle text color      |
| .nui-text-inverse    | inverse text           |
| .nui-text-primary    | primary text           |
| .nui-text-danger     | danger text            |
| .nui-border          | border                 |
| .nui-border-t        | border-top             |
| .nui-border-b        | border-bottom          |
| .nui-border-r        | border-right           |
| .nui-border-l        | border-left            |
| .nui-rounded-sm      | radius sm              |
| .nui-rounded-md      | radius md              |
| .nui-rounded-lg      | radius lg              |
| .nui-rounded-full    | radius full            |
| .nui-rounded-none    | radius none            |
| .nui-overflow-hidden | overflow hidden        |
| .nui-overflow-auto   | overflow auto          |
| .nui-overflow-y-auto | overflow-y auto        |

---

## 7. Interactivity

| Class                    | Description             |
| ------------------------ | ----------------------- |
| .nui-hover:bg-subtle     | hover background subtle |
| .nui-hover:text-primary  | hover text primary      |
| .nui-cursor-pointer      | pointer cursor          |
| .nui-cursor-default      | default cursor          |
| .nui-cursor-not-allowed  | disabled cursor         |
| .nui-pointer-events-none | disable pointer events  |
| .nui-pointer-events-auto | enable pointer events   |
| .nui-select-none         | disable selection       |

---

## 8. Transitions & Animations

| Class                     | Description          |
| ------------------------- | -------------------- |
| .nui-transition-all       | transition all       |
| .nui-transition-colors    | transition colors    |
| .nui-transition-opacity   | transition opacity   |
| .nui-transition-transform | transition transform |
| .nui-duration-75          | duration 75ms        |
| .nui-duration-100         | duration 100ms       |
| .nui-duration-150         | duration 150ms       |
| .nui-duration-200         | duration 200ms       |
| .nui-duration-300         | duration 300ms       |
| .nui-duration-500         | duration 500ms       |
| .nui-ease-linear          | linear easing        |
| .nui-ease-in              | ease-in              |
| .nui-ease-out             | ease-out             |
| .nui-ease-in-out          | ease-in-out          |
| .nui-animate-fade-in      | fade animation       |
| .nui-animate-slide-up     | slide-up animation   |
| .nui-animate-zoom-in      | zoom-in animation    |
| .nui-animate-spin         | spin animation       |
| .nui-animate-pulse        | pulse animation      |

---

## 9. Accessibility

| Class             | Description        |
| ----------------- | ------------------ |
| .nui-sr-only      | screen reader only |
| .nui-outline-none | remove outline     |
| .nui-focus-ring   | focus ring         |

---

## Notes

All utilities consume theme tokens and automatically adapt to theme overrides.

---

## Example: Card Composition

```tsx
<div className="nui-bg-surface nui-border nui-rounded-lg nui-p-6 nui-flex nui-flex-col nui-gap-2 nui-transition-all">
  <h3 className="nui-text-lg nui-font-bold nui-text-default">Title</h3>
  <p className="nui-text-subtle">Description</p>
</div>
```

---

## Recommended Usage Philosophy

Use utilities for:

- layout composition
- spacing
- alignment
- typography
- quick visual tweaks

Avoid utilities for:

- component logic styling
- complex interactive states
- component theming (use tokens instead)
