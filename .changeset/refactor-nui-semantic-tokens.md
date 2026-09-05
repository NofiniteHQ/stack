---
"@nofinite/nui": patch
---

### ✨ Semantic Tokens & Class Merging Enhancements

- **Extended Tailwind Merge**: Extended `twMerge` in `cn()` to recognize custom NUI semantic tokens (`bg-page`, `bg-surface`, `text-default`, `border-subtle`, `ring-focus`, etc.), ensuring predictable overriding and deduplication.
- **Polymorphic asChild Fixes**: Squashed DOM attribute leakage across Radix-based components when using the polymorphic `asChild` prop.
