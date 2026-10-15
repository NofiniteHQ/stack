---
title: Releases
sidebar_position: 999
---

# @nofinite/utils — Initial Release (v0.1.0)

**Release date:** 02 February 2026

---

## Overview

This is the first public release of Nofinite Utils.

Nofinite Utils is a lightweight, framework-agnostic utility library providing
**production-ready helpers** for common backend and full‑stack needs such as
authentication, security, identifiers, and environment handling.

---

## Included

- OTP generation and verification (secure, hash-based)
- Password hashing and verification (Argon2id)
- JWT helpers with configurable algorithms and expiration
- UUID v7 utilities (string + binary helpers)
- Environment helpers (`isProd`, `isDev`, safe env access)
- Email helpers (ZeptoMail integration)
- Fully typed APIs with TypeScript support

---

## Design Goals

- **Security-first** defaults
- **Minimal API surface**
- **Tree-shakable ES modules**
- **Zero framework coupling**
- **Explicit, readable utilities**

---

## Notes

- This release establishes the public API surface.
- All utilities are designed to work in Node.js environments.
- Sensible defaults are provided, but most helpers are configurable.
- APIs may evolve until a stable `v1.0.0`.

---

## Known Limitations

- Email utilities rely on external providers (e.g. ZeptoMail).
- JWT helpers currently focus on symmetric algorithms.
- UUID utilities intentionally support **only UUID v7**.
