<div align="center">

# Nofinite Utils

**A secure, lightweight, and production-ready utility library for modern Node.js and web applications.**

[![npm](https://img.shields.io/npm/v/@nofinite/utils?style=flat-square&color=3b82f6)](https://www.npmjs.com/package/@nofinite/utils)
[![TypeScript](https://img.shields.io/badge/TypeScript-Yes-3b82f6?style=flat-square)](https://www.typescriptlang.org/)

</div>

---

## Overview

Nofinite Utils provides a collection of carefully designed, reusable utilities for real-world applications.  
It focuses on **security, correctness, and developer experience**, so you don’t have to rewrite critical logic again and again.

* **Secure by Default:** Modern cryptography (Argon2id, SHA-256, JWT best practices).
* **Type-Safe:** Fully written in TypeScript with strict typings.
* **Tree-Shakable:** Modular design for optimal bundle size.
* **Framework-Agnostic:** Works with Node.js, serverless, and modern runtimes.

---

## Installation

```bash
# pnpm
pnpm add @nofinite/utils

# npm
npm install @nofinite/utils

# yarn
yarn add @nofinite/utils
````

---

## What’s Included

* **OTP Utilities:** Secure OTP generation, verification, expiry, and attempt guards.
* **Crypto Helpers:** Password hashing & verification using Argon2id.
* **JWT Utilities:** Token signing and verification with safe defaults.
* **UUID Utilities:** UUID v7 generation and binary conversions.
* **Env Helpers:** Safe environment variable accessors.
* **Email Utilities:** ZeptoMail helpers with typed, env-driven configuration.

All utilities are **independent and tree-shakable**, so you only ship what you use.

---

## Documentation

For full usage examples, API references, and best practices,
[read documentation](https://opensource.nofinite.com/docs/utils).

---

## License

This project is licensed under the
Apache License, Version 2.0.

Feel free to use, modify, and share this project in your applications, products, and services.
Attribution is welcome and appreciated, but never required.