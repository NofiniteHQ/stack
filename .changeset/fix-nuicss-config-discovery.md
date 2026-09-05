---
"@nofinite/nuicss": patch
---

### 🛠️ PostCSS HMR & Native Config Discovery

- **Native Config Resolution**: Automatically discover `nuicss.config.{ts,js,mjs,cjs}` using `@unocss/config` without requiring manual path configuration.
- **Enhanced PostCSS HMR**: Fixed Hot Module Replacement (HMR) reloads in the PostCSS plugin by tracking config file dependencies.
- **Theme & Reset Refinements**: Cleaned up default CSS reset styles and optimized theme token resolution.
