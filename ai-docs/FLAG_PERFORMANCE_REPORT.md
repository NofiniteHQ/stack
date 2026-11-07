# NUICSS Country Flag System — Performance & Budget Report

**Programme:** Nofinite Engineering Quality Programme  
**Target Package:** `@nofinite/nuicss`  
**Governing Standard:** NEAS 1.0 Performance Budgets  
**Date:** November 8, 2026

---

## 1. Metric Overview & Performance Invariants

The primary architectural goal of the NUICSS Flag System was to deliver comprehensive visual country flags without degrading the performance of applications that do not use flags, and with minimum overhead for applications that do.

| Performance Dimension                 | Target Standard            | Measured Metric                                      | Status      |
| :------------------------------------ | :------------------------- | :--------------------------------------------------- | :---------- |
| **Core Stylesheet Impact**            | 0 KB increase              | **0 KB increase** (Flags are in an optional subpath) | ✅ **PASS** |
| **Optional Flag Stylesheet (Raw)**    | $\le 150\text{ KB}$        | **109.61 KB** (`dist/flags.min.css`)                 | ✅ **PASS** |
| **Optional Flag Stylesheet (Gzip)**   | $\le 20\text{ KB}$         | **15.06 KB** (15,426 bytes)                          | ✅ **PASS** |
| **Total Distributed Vector Assets**   | $\le 5.0\text{ MB}$        | **3.82 MB** across 542 SVGs                          | ✅ **PASS** |
| **Initial Download for Unused Flags** | 0 KB                       | **0 KB** (Browsers download SVGs on demand)          | ✅ **PASS** |
| **Per-Flag Network Cost**             | $\le 10\text{ KB}$ average | **~7.2 KB** average (as low as 178 B for tricolors)  | ✅ **PASS** |
| **Build Time Impact**                 | $\le 2.0\text{ seconds}$   | **~0.45 seconds** generation time                    | ✅ **PASS** |
| **Runtime Dependencies Added**        | 0 dependencies             | **0 new dependencies**                               | ✅ **PASS** |

---

## 2. On-Demand vs. Inline Base64 Trade-off Analysis

| Architecture                           | Total CSS Payload | Initial Network Transfer (Page with 1 Flag) | Cache Efficiency                                                      |
| :------------------------------------- | :---------------- | :------------------------------------------ | :-------------------------------------------------------------------- |
| **Inline Base64 Data URIs (Rejected)** | 2,240 KB (2.2 MB) | **2,240 KB (Blocks FCP)**                   | Low: 1 change busts entire 2.2 MB stylesheet.                         |
| **NUICSS On-Demand SVGs (Adopted)**    | 109 KB (15 KB gz) | **~17 KB** (15 KB CSS + 1.8 KB SVG)         | **High:** Individual SVGs cached permanently; unused flags cost 0 KB. |

---

## 3. Build & CDN Metrics

- **Generation Script (`generate-flags-css.js`):** Runs in under 50ms, deterministically mapping 271 flag designs.
- **LightningCSS Minification:** Compresses raw 134.45 KB CSS down to 109.61 KB (18.5% reduction) in 32ms.
- **NPM Package Output:** Compressed tarball size is **1.8 MB**, well within modern npm distribution standards for complete vector libraries.
