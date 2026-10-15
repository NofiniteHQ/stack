---
sidebar_position: 1
title: Nofinite Utils
---

# Introduction

Nofinite Utils is a lightweight, framework-agnostic utility library designed
for modern TypeScript and JavaScript applications.

It provides production-ready helpers for common backend and shared logic needs
such as authentication, cryptography, environment handling, and messaging —
with a strong focus on correctness, security, and long-term maintainability.

---

## Who is this for?

Nofinite Utils is designed for:

- Backend and full-stack engineers
- Teams building Node.js, Next.js, or server-side applications
- Projects that need secure, reusable primitives (OTP, JWT, hashing, env, email)
- Organizations that value type safety and predictable behavior

---

## Design Philosophy

The library is built around a small set of core principles:

- **Security-first**: safe defaults for crypto, hashing, and tokens
- **TypeScript-first**: strict typings with zero `any` leakage
- **Minimal abstractions**: simple functions, no hidden magic
- **Composable APIs**: small utilities that work well together
- **Runtime-safe**: defensive handling of edge cases and failures

---

## What this library is

- A collection of reusable utility functions
- A shared foundation for backend and full-stack codebases
- A secure alternative to copy-pasted utility snippets

---

## What this library is not

- A framework or application layer
- A replacement for business logic
- A dependency-heavy toolbox with bloated APIs

---

## Runtime Compatibility

Nofinite Utils works in:

- Node.js (ESM-first)
- Next.js (API routes, server actions, edge-safe where applicable)
- Vite / Nx monorepos
- Any TypeScript or modern JavaScript environment

All utilities are tree-shakable and safe to use in server contexts.

---

## Production Readiness

- TypeScript-first with generated declaration files
- Tree-shakable ES modules
- Defensive error handling
- Stable APIs designed for long-term use
- Tested with Vitest

---

## Next Steps

- Continue to the **Getting Started** guide for installation and setup
- Explore individual utility documentation (OTP, JWT, Passwords, Email, Env)
- Review security and configuration best practices
