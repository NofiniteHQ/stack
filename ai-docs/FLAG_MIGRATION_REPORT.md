# NUICSS Country Flag System — Migration & Compatibility Report

**Programme:** Nofinite Engineering Quality Programme  
**Target Packages:** `@nofinite/nuicss`, `@nofinite/locale`  
**Governing Standard:** EOR 1.0, Zero Downstream CSS Invariant (Rule 14)  
**Date:** November 8, 2026

---

## 1. Migration Overview

In `@nofinite/locale@2.0.0`, flag styles were authored in custom SCSS within Locale, requiring consumers to import `@nofinite/locale/style` or `.nf-flag` classes. When commit `0d655bb` removed the SCSS to comply with the Zero Downstream CSS Invariant, the style shim was left without upstream styles (`LOCALE-M1-02`).

With this integration, the flag system is now canonically owned by `@nofinite/nuicss`:

- **New Recommended Import:** `@import '@nofinite/nuicss/flags.css';`
- **New Canonical Selector:** `flag-{iso}` (e.g. `flag-in`, `flag-us`, `flag-gb`)
- **Legacy Compatibility:** 100% preserved. The old `.nf-flag` and `.nf-flag-{iso}` syntax continues to work seamlessly through triple aliasing in `flags.css`.
- **Locale Shim Resolution:** `@nofinite/locale/dist/style.css` now points to `@nofinite/nuicss/flags.css`.

---

## 2. API Syntax Migration Mapping

| Use Case               | Legacy Locale API (Deprecated)                    | New Canonical NUICSS API                                       |
| :--------------------- | :------------------------------------------------ | :------------------------------------------------------------- |
| **CSS Import (JS/TS)** | `import '@nofinite/locale/style';`                | `import '@nofinite/nuicss/flags.css';`                         |
| **CSS Import (CSS)**   | `@import '@nofinite/locale/dist/style.css';`      | `@import '@nofinite/nuicss/flags.css';`                        |
| **Standard 4:3 Flag**  | `<span class="nf-flag nf-flag-in"></span>`        | `<span class="flag-in" aria-hidden="true"></span>`             |
| **Square 1:1 Flag**    | `<span class="nf-flag nf-flag-us square"></span>` | `<span class="flag-us flag-square" aria-hidden="true"></span>` |
| **Circular Avatar**    | Not supported natively                            | `<span class="flag-gb flag-circle" aria-hidden="true"></span>` |
| **React Integration**  | `<span className="nf-flag nf-flag-de" />`         | `<span className="flag-de" aria-hidden="true" />`              |

---

## 3. Audited & Updated Documentation Files

The following files across the ecosystem documentation have been identified and updated:

1. **`D:\stack\docs\locale\flags.md`:**
   - Updated import instructions to document `@nofinite/nuicss/flags.css`.
   - Updated HTML and React examples from `.nf-flag` to canonical `.flag-{iso}` while noting legacy support.
2. **`D:\stack\docs\locale\usage\flags.md`:**
   - Synchronized class reference table to document `flag-*` and `flag-square`.
3. **`D:\stack\docs\locale\installation.md`:**
   - Updated Section 2 (Flag Stylesheet) pointing to `@nofinite/nuicss/flags.css`.
4. **`D:\stack\packages\locale\README.md`:**
   - Added architectural note that flags are provided visually by `@nofinite/nuicss`.
5. **`D:\stack\docs\nuicss\components\flags.md`:**
   - Created full dedicated documentation for the NUICSS Country Flag System.
