---
title: Releases
sidebar_position: 999
---

# @nofinite/markon — v2.1.0

**Latest release:** `2.1.0` (Apache-2.0)

`@nofinite/markon` `2.1.0` is the universal, framework-agnostic rich text and content authoring engine powered by TipTap and ProseMirror.

---

## Summary of Capabilities (`v2.1.0`)

- **Core Content & Publication Engine (`@nofinite/markon`):** `jsonToHtml`, `renderMarkon`, `MarkonRenderer`, `extractTOC`, markdown conversion (`markdownToHtml`, `htmlToMarkdown`), callouts, syntax-highlighted code blocks (`lowlight`), and LaTeX math (`katex`).
- **React 18/19 Wrapper (`@nofinite/markon/react`):** `MarkonEditor`, `MarkonRender`, bubble/table menus, slash commands, drag handle, and `MarkonColorPicker`.
- **Dual-Environment HTML Security:** DOMPurify in browser runtimes and a zero-dependency deterministic allowlist HTML tokenizer/sanitizer (`sanitizeHtml`, `sanitizeUrl`, `escapeHtml`) for Node SSR and Edge workers.
- **NUICSS Integration:** Native consumption of `@nofinite/nuicss` semantic superclasses (`@nofinite/markon/styles.css` compatibility shim).

---

## Release Metadata

- Package: `@nofinite/markon` (`2.1.0`)
- License: Apache-2.0
- Repository: [NofiniteHQ/stack (`packages/markon`)](https://github.com/NofiniteHQ/stack/tree/main/packages/markon)
