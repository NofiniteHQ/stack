# Codeblock (codeblock)

## Import
```tsx
import { CodeBlock } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `CodeBlock` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `language`* | `string` | `-` | - |
| `onLanguageChange` | `(lang: string) => void` | `-` | - |
| `code`* | `string` | `-` | - |
| `className` | `string` | `-` | - |
| `readOnlyLanguage` | `boolean` | `false` | - |


