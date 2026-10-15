---
sidebar_position: 1
title: Layout & Sizing
---

# Layout & Sizing

NUI CSS provides a comprehensive set of utilities for controlling the display, positioning, and dimensions of your elements.

## Display

Control the display box type of an element using the `display` utilities.

| Class          | CSS                      |
| -------------- | ------------------------ |
| `block`        | `display: block;`        |
| `inline-block` | `display: inline-block;` |
| `inline`       | `display: inline;`       |
| `flex`         | `display: flex;`         |
| `inline-flex`  | `display: inline-flex;`  |
| `grid`         | `display: grid;`         |
| `inline-grid`  | `display: inline-grid;`  |
| `hidden`       | `display: none;`         |

## Positioning

Use positioning utilities to control how an element is positioned in the DOM.

| Class      | CSS                   |
| ---------- | --------------------- |
| `static`   | `position: static;`   |
| `fixed`    | `position: fixed;`    |
| `absolute` | `position: absolute;` |
| `relative` | `position: relative;` |
| `sticky`   | `position: sticky;`   |

### Top / Right / Bottom / Left

Combine absolute or fixed positioning with directional utilities.

- `top-0`, `top-1/2`, `top-full`, etc.
- `right-0`, `right-4`, `right-8`, etc.
- `bottom-0`, `bottom-auto`, etc.
- `left-0`, `left-1/2`, etc.
- `inset-0`, `inset-y-0`, `inset-x-0`

_Also supports negative values like `-top-4` and arbitrary values like `top-[12px]`._

## Z-Index

Control the stack order of an element using `z-index`.

| Class     | CSS              |
| --------- | ---------------- |
| `z-0`     | `z-index: 0;`    |
| `z-10`    | `z-index: 10;`   |
| `z-20`    | `z-index: 20;`   |
| `z-30`    | `z-index: 30;`   |
| `z-40`    | `z-index: 40;`   |
| `z-50`    | `z-index: 50;`   |
| `z-auto`  | `z-index: auto;` |
| `z-[100]` | `z-index: 100;`  |

## Sizing

### Width

Set the width of an element. Uses the standard NUI CSS spacing scale.

- `w-0` to `w-96`
- `w-auto`, `w-full`, `w-screen`, `w-min`, `w-max`, `w-fit`
- Fractions: `w-1/2`, `w-1/3`, `w-2/3`, `w-1/4`, etc.

### Height

Set the height of an element.

- `h-0` to `h-96`
- `h-auto`, `h-full`, `h-screen`, `h-min`, `h-max`, `h-fit`

### Min/Max Sizing

- `min-w-0`, `min-w-full`, `min-w-min`, `min-w-max`, `min-w-fit`
- `max-w-xs`, `max-w-sm`, `max-w-md`, `max-w-lg`, `max-w-xl`, `max-w-full`, `max-w-none`
- `min-h-0`, `min-h-full`, `min-h-screen`
- `max-h-full`, `max-h-screen`
