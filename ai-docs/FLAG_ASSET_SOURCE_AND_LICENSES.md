# Flag Asset Source, Provenance & Licensing Documentation

**Programme:** Nofinite Engineering Quality Programme  
**Target Package:** `@nofinite/nuicss`  
**License:** Apache-2.0 (with Third-Party MIT Attribution)  
**Date:** November 8, 2026

---

## 1. Upstream Provenance

The 542 SVG vector flag assets bundled into `@nofinite/nuicss` (`dist/flags/4x3/` and `dist/flags/1x1/`) originate from the open-source **`lipis/flag-icons`** repository:

- **Upstream Repository:** [https://github.com/lipis/flag-icons](https://github.com/lipis/flag-icons)
- **Primary Maintainer:** Panayiotis Lipiridis and open-source contributors
- **Release Line:** v7.6.0
- **Upstream License:** MIT License

---

## 2. Apache 2.0 & MIT License Compatibility

The Nofinite ecosystem is distributed under the Apache License 2.0. Under Section 4 of Apache 2.0, third-party MIT-licensed vector assets may be redistributed within an Apache 2.0 work provided the original copyright notice and permission notice are preserved.

The required attribution is formally established in:

- **`packages/nuicss/THIRD_PARTY_LICENSES.md`**
- **Generated CSS Header in `dist/flags.css`**
- **Public Documentation in `docs/nuicss/components/flags.md`**

### Full Preserved MIT License Text:

```
The MIT License (MIT)

Copyright (c) 2013-present Panayiotis Lipiridis and contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 3. Asset Curation and Cleanliness Audit

Every SVG in `src/flags/` has been verified against security and quality standards:

1. **XML & DOCTYPE Hygiene:** 100% of SVGs are free of `<?xml ... ?>` declarations, `<!DOCTYPE ...>`, XML comments, and `<metadata>` blocks.
2. **Zero Executable Script Content (XSS Prevention):** No `<script>` tags, no `onload`/`onerror` handlers, no `<foreignObject>` elements.
3. **Deterministic ViewBox Geometry:**
   - 4:3 Aspect Ratio: 100% of the 271 assets have `viewBox="0 0 640 480"`.
   - 1:1 Aspect Ratio: 100% of the 271 assets have `viewBox="0 0 512 512"`.
4. **Dimensions:** Raw `width` and `height` attributes are normalized to prevent layout shifts.

---

## 4. Maintenance and Upstream Sync Protocol

When updating flag assets from upstream `lipis/flag-icons`:

1. Bump upstream release tag.
2. Run `node packages/nuicss/scripts/generate-flags-css.js` to re-synchronize CSS class maps.
3. Execute `node D:/stack/temp/test_flags_system.js` to guarantee 100% parity with `@nofinite/locale/src/data/countries.ts`.
4. Run `pnpm --filter @nofinite/nuicss build` to re-compile `dist/flags.css` and `dist/flags.min.css`.
