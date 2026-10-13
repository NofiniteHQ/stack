---
sidebar_position: 1
title: Introduction
---

# Introduction to NUI CSS v2.0

NUI CSS v2.0 is a next-generation, on-demand utility CSS framework designed for modern web applications.

Unlike v1.0 which shipped a static CSS bundle, v2.0 introduces a **blazing fast Just-in-Time (JIT) compiler**. It dynamically generates styles based purely on the classes you actually use in your codebase, resulting in the smallest possible CSS footprint.

## Why upgrade to v2.0?

The v2.0 release brings incredible power while retaining the minimalist, aesthetic design language NUI is known for:

- **JIT Compilation** — Styles are generated on-the-fly via a Vite plugin, PostCSS plugin, or even directly in the browser via CDN.
- **Arbitrary Values** — Need a specific width? Just use `w-[343px]` or `bg-[#ff0055]`. The parser handles it instantly.
- **Semantic Components** — Built-in premium components like `.btn-primary` that automatically expand into base utilities.
- **Zero Overhead** — Since only the CSS you use is generated, your production bundle is measured in bytes, not megabytes.
- **Micro-interactions** — Deep support for pseudo-variants like `hover:`, `focus:`, `dark:`, and advanced grouping with `group-hover` and `peer-focus`.

---

## Design Philosophy

NUI CSS v2.0 is built on the same core principles, supercharged for modern workflows:

1. **Aesthetic First:** NUI CSS uses premium color palettes, glassmorphism defaults, and perfect spacing scales.
2. **Predictable:** We avoid the overcrowding of utility names; classes follow logical CSS property names.
3. **Strictly Typed:** Our configuration files (`nuicss.config.ts`) provide complete TypeScript intellisense.

---

## What this library is

- A dynamic, JIT-based utility CSS framework
- An aesthetic foundation for premium interfaces
- A lightweight, highly performant engine with zero runtime overhead in production

---

## Framework Compatibility

NUI CSS v2.0 ships with robust integrations for:

- **Vite:** First-class plugin support
- **PostCSS:** Integration for Webpack, Next.js, and other bundlers
- **HTML / Vanilla:** A zero-build Browser CDN script for rapid prototyping

---

## Next Steps

Head over to the **[Installation](./installation.md)** guide to get started with the new v2.0 engine!
