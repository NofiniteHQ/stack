# Nofinite Ecosystem Public Documentation (`docs/`)

Welcome to the centralized public and developer-facing documentation for all packages in the **Nofinite Stack Monorepo**.

---

## 📦 Package Documentation Index

This directory houses the canonical Markdown source documentation for the entire Nofinite ecosystem. It is consumed by external documentation sites and [`oss-docs`](https://github.com/NofiniteHQ/oss-docs):

| Package            | Brand Name          | Directory              | Description                                                   |
| :----------------- | :------------------ | :--------------------- | :------------------------------------------------------------ |
| `@nofinite/nuicss` | **NUICSS**          | [`nuicss/`](./nuicss/) | Design tokens, OKLCH scales, reset, and semantic superclasses |
| `@nofinite/nui`    | **NUI**             | [`nui/`](./nui/)       | Accessible React UI component library (68+ primitives)        |
| `@nofinite/kanban` | **Nofinite Kanban** | [`kanban/`](./kanban/) | Drag-and-drop Kanban board primitives and components          |
| `@nofinite/markon` | **Nofinite Markon** | [`markon/`](./markon/) | Markdown editor and rich text parsing engine                  |
| `@nofinite/charts` | **Nofinite Charts** | [`charts/`](./charts/) | High-performance SVG/Canvas charting suite                    |
| `@nofinite/media`  | **Nofinite Media**  | [`media/`](./media/)   | Modern audio/video player UI bridge                           |
| `@nofinite/locale` | **Nofinite Locale** | [`locale/`](./locale/) | Internationalization, country metadata, and phone codes       |
| `@nofinite/utils`  | **Nofinite Utils**  | [`utils/`](./utils/)   | Shared cryptographic, string, and system utilities            |

---

## 🏛️ Ecosystem Architecture & Audits

- [`architecture/`](./architecture/) — Cross-package architectural contracts and component designs.
- [`audit/`](./audit/) — Ecosystem-wide accessibility and performance audit reports.

---

## 🔒 Internal Engineering & AI Agent Hub

For private engineering reports, compiler AST optimizations, competitive benchmarks, and decision records, see the sibling directory:

- [`../ai-docs/README.md`](../ai-docs/README.md)
