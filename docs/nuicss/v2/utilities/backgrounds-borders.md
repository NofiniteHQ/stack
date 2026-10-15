---
sidebar_position: 5
title: Backgrounds & Borders
---

# Backgrounds & Borders

Utilities for controlling element backgrounds and border styles.

## Background Color

Control the background color of an element.

- `bg-primary`, `bg-success`, `bg-error`, `bg-warning`, `bg-info`
- Theme specific backgrounds: `bg-page`, `bg-surface`, `bg-surface-raised`
- Solid colors: `bg-white`, `bg-black`, `bg-transparent`
- Arbitrary colors: `bg-[var(--custom-color)]`, `bg-[#1a1a1a]`

### Background Opacity

Add an opacity modifier to standard colors:

- `bg-primary/50` (50% opacity)
- `bg-black/10` (10% opacity)
- `bg-surface/80` (80% opacity)

## Gradients

NUI CSS provides built-in directional gradients.

1. Specify the direction: `bg-gradient-to-t`, `bg-gradient-to-r`, `bg-gradient-to-b`, `bg-gradient-to-l`, `bg-gradient-to-tr`, `bg-gradient-to-br`, `bg-gradient-to-tl`, `bg-gradient-to-bl`
2. Specify the color stops: `from-{color}`, `via-{color}`, `to-{color}`

Example: `bg-gradient-to-br from-primary to-info`

## Border Radius

Control the border radius (rounded corners) of an element.

- `rounded-none`, `rounded-sm`, `rounded`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl`
- `rounded-full` (for perfect circles/pills)
- Edge-specific: `rounded-t-lg`, `rounded-r-full`, `rounded-b-none`, `rounded-l-md`

## Border Width

Control the border width of an element.

- `border` (1px)
- `border-0`, `border-2`, `border-4`, `border-8`
- Edge-specific: `border-t-2`, `border-r-0`, `border-b`, `border-l-4`

## Border Color

Control the border color. Functions exactly like background and text colors.

- `border-primary`, `border-success`, `border-warning`, etc.
- Theme borders: `border-default`, `border-subtle`
- Opacity modifiers: `border-default/50`, `border-primary/20`
