# Internationalization Runtime Compatibility & Polyfill Guide

**Package:** `@nofinite/locale`  
**Architecture:** Modern ECMAScript Standard `Intl` First  
**Target Release:** 2.1.x

---

## 1. Architectural Philosophy

`@nofinite/locale` is engineered to leverage modern browser-native standard `Intl` APIs rather than bundling megabytes of proprietary CLDR (Common Locale Data Repository) tables. This ensures an ultra-lean footprint (< 12 KiB) while benefiting from operating-system level updates to timezone, currency, and locale rules.

---

## 2. Minimum Environment Matrix

| Runtime / Platform              | Minimum Supported Version | Native `Intl` Capabilities                                              |
| :------------------------------ | :-----------------------: | :---------------------------------------------------------------------- |
| **Google Chrome / Chromium**    |            99+            | Full `Intl.DisplayNames`, `NumberFormat`, `DateTimeFormat`, `Segmenter` |
| **Apple Safari (macOS)**        |           15.4+           | Full modern Intl support                                                |
| **Apple Safari / WebKit (iOS)** |           15.4+           | Full modern Intl support                                                |
| **Mozilla Firefox**             |            96+            | Full modern Intl support                                                |
| **Microsoft Edge**              |            99+            | Full modern Intl support                                                |
| **Node.js**                     |          18.0.0+          | Full ICU data included by default                                       |
| **Android System WebView**      |            99+            | Full modern Intl support                                                |

---

## 3. Legacy WebViews & Embedded Browser Environments

For applications deploying into older embedded webviews (e.g. legacy Android hybrid apps, older smart TVs, or iOS < 15.4), `@nofinite/locale` provides deterministic fallback logic and supports standard FormatJS polyfills.

### 3.1 Graceful Built-In Fallback

If `Intl.DisplayNames` or other specific Intl constructors are undefined in the runtime:

- `getCountryName(code)` falls back to returning the uppercase ISO-3166-1 alpha-2 code or English name.
- `getLanguageName(code)` falls back to the ISO-639-1 code.
- Zero runtime crashes or unhandled exceptions occur.

### 3.2 Polyfill Integration (Recommended for Legacy WebViews)

If full localized name resolution is required on legacy devices, load FormatJS polyfills conditionally before bootstrapping your application:

```html
<!-- Conditional polyfill loading for legacy webviews -->
<script>
  if (!window.Intl || !window.Intl.DisplayNames) {
    document.write(
      '<script src="https://cdn.jsdelivr.net/npm/@formatjs/intl-displaynames/polyfill.umd.js"><\/script>'
    );
    document.write(
      '<script src="https://cdn.jsdelivr.net/npm/@formatjs/intl-displaynames/locale-data/en.js"><\/script>'
    );
  }
</script>
```

Or via npm in your application entrypoint:

```typescript
// app/polyfills.ts
import { shouldPolyfill as shouldPolyfillDisplayNames } from '@formatjs/intl-displaynames/should-polyfill';

async function setupPolyfills() {
  if (shouldPolyfillDisplayNames()) {
    await import('@formatjs/intl-displaynames/polyfill');
    await import('@formatjs/intl-displaynames/locale-data/en');
  }
}

export { setupPolyfills };
```

---

## 4. Flag Utilities Boundary

As established in the Nofinite Ecosystem Architecture:

- `@nofinite/locale` owns country codes, language mappings, locale resolution, and metadata.
- `@nofinite/nuicss` owns all visual flag CSS classes (`flag flag-us`, `flag-sm`, `flag-4x3`, `flag-1x1`).
- Displaying a flag does NOT require JavaScript runtime polyfills; flags are pure CSS/SVG assets provided by NUICSS.
