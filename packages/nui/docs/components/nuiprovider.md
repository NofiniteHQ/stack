# Nuiprovider (nuiprovider)

## Import
```tsx
import { useTheme, NUIProvider } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `NUIProvider` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `defaultTheme` | `ThemeMode` | `system` | The default theme if nothing is in local storage. Defaults to 'system'. |
| `storageKey` | `string` | `nui-theme` | The local storage key used to persist the theme preference. Defaults to 'nui-theme'. |


