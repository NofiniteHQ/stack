# Colorpicker (colorpicker)

## Import
```tsx
import { ColorPicker } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `ColorPicker` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `value` | `string` | `#000000` | The currently selected color in hex format |
| `onChange` | `(color: string) => void` | `-` | Callback fired when a color is selected |
| `presets` | `string[]` | `[   '#000000', '#52525b', '#a1a1aa', '#ffffff',   '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1', '#a855f7', '#d946ef', '#f43f5e',   '#7f1d1d', '#7c2d12', '#78350f', '#3f6212', '#14532d', '#134e4a', '#164e63', '#1e3a8a', '#312e81', '#581c87', '#701a75' ]` | Array of hex colors to show in the preset grid |
| `showCustom` | `boolean` | `true` | Whether to show the native color picker input for custom colors |
| `disabled` | `boolean` | `false` | Disable the color picker |
| `icon` | `LucideIcon` | `-` | Custom icon to display on the trigger button. Defaults to Palette. |
| `variant` | `"default" \| "icon"` | `default` | Visual variant for the trigger button. 'default' is a form input, 'icon' is a compact toolbar button. |
| `showText` | `boolean` | `true` | Show the hex text in the default variant |
| `showSwatch` | `boolean` | `true` | Show the color swatch circle in the default variant |
| `showIcon` | `boolean` | `true` | Show the palette icon in the default variant |


