---
sidebar_position: 4
title: Typography
---

# Typography

Utilities for controlling the font size, weight, color, and text alignment.

## Font Size

Control the font size and line height using the text utilities.

- `text-xs`: `font-size: 0.75rem; line-height: 1rem;`
- `text-sm`: `font-size: 0.875rem; line-height: 1.25rem;`
- `text-base`: `font-size: 1rem; line-height: 1.5rem;`
- `text-lg`: `font-size: 1.125rem; line-height: 1.75rem;`
- `text-xl`: `font-size: 1.25rem; line-height: 1.75rem;`
- `text-2xl` to `text-9xl`
- Arbitrary sizes: `text-[14px]`, `text-[0.875rem]`

_Note: NUI CSS is intelligent. If you pass a color like `text-[#ff0000]`, it applies the color. If you pass a size like `text-[10px]`, it applies `font-size: 10px;`._

## Font Weight

Control the font weight of an element.

- `font-thin`: `font-weight: 100;`
- `font-extralight`: `font-weight: 200;`
- `font-light`: `font-weight: 300;`
- `font-normal`: `font-weight: 400;`
- `font-medium`: `font-weight: 500;`
- `font-semibold`: `font-weight: 600;`
- `font-bold`: `font-weight: 700;`
- `font-extrabold`: `font-weight: 800;`
- `font-black`: `font-weight: 900;`

## Text Color

Control the text color of an element using NUI CSS colors or arbitrary values.

- `text-primary`, `text-success`, `text-error`, `text-warning`, `text-info`
- `text-white`, `text-black`, `text-transparent`
- Theme colors: `text-default`, `text-subtle`, `text-muted`
- Arbitrary values: `text-[var(--my-color)]`, `text-[#ff0000]`

## Text Alignment

Control the text alignment of an element.

- `text-left`: `text-align: left;`
- `text-center`: `text-align: center;`
- `text-right`: `text-align: right;`
- `text-justify`: `text-align: justify;`

## Text Transform & Decoration

- `uppercase`, `lowercase`, `capitalize`, `normal-case`
- `underline`, `overline`, `line-through`, `no-underline`

## Tracking (Letter Spacing)

Control the letter spacing of an element.

- `tracking-tighter`, `tracking-tight`, `tracking-normal`, `tracking-wide`, `tracking-wider`, `tracking-widest`
- Arbitrary tracking: `tracking-[0.2em]`, `tracking-[2px]`

## Line Height (Leading)

- `leading-none`, `leading-tight`, `leading-snug`, `leading-normal`, `leading-relaxed`, `leading-loose`
- `leading-3` to `leading-10`
- Arbitrary leading: `leading-[3rem]`, `leading-[1.2]`
