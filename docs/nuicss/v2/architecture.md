---
sidebar_position: 4
title: Architecture
---

# JIT Engine Architecture

NUI CSS v2.0 is powered by a high-performance Just-in-Time (JIT) CSS generator. Unlike frameworks that ship thousands of precompiled CSS rules, NUI CSS analyzes your code and generates exactly the CSS you need.

## The Core Generator

At the heart of v2.0 is the `generateCSS` engine. It is a completely pure, Node.js-agnostic function that takes an array of class names and returns minified CSS.

Because it has zero file-system dependencies, it can run anywhere:

- Inside Vite
- Inside Webpack (via PostCSS)
- In a Serverless Edge function
- Directly in the Browser (via CDN)

## Arbitrary Value Parsing

The generator uses Advanced Regex Pattern Matching (AST) to evaluate utility classes. It natively supports important modifiers (e.g. `!pl-10`), properly escaping them to generate robust overriding styles (like `.\!pl-10`).

When it encounters an arbitrary value like `w-[343px]`, it maps the `w-` prefix to `width` and injects `343px` dynamically. Opacity modifiers like `bg-red-500/30` are resolved using the modern CSS `color-mix()` specification for high-performance transparency mapping.

## Plugin Ecosystem

### Vite Plugin

The `NuiVitePlugin` scans all `.html`, `.tsx`, `.vue`, and `.svelte` files in your project. It leverages the Vite `buildStart` hook to synchronously extract the raw strings and run the JIT engine before the first request, completely eliminating race conditions. This guarantees that `virtual:nuicss.css` is served with 100% accurate CSS on the very first page render.

### PostCSS Plugin

The PostCSS plugin reads your source code directories (defined in `nuicss.config.ts`), runs the JIT engine, and replaces the `@nuicss utilities` directive with the generated styles. It also parses and replaces inline `@apply` directives inside your CSS!

### Browser CDN

The Browser CDN script runs a `MutationObserver` to watch your DOM. When elements are added, or classes are mutated, it parses the new classes and injects the rules directly into a `<style id="nuicss-cdn">` tag in real-time.

## Configuration Resolution

Configuration is resolved automatically via `jiti`, allowing you to write your `nuicss.config.ts` in modern TypeScript or ESModules without a compile step.
