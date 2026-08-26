# Combobox (combobox)

## Import
```tsx
import { Combobox } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `Combobox` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `data`* | `ComboboxOption[]` | `-` | - |
| `value` | `string` | `-` | Controlled value of the combobox |
| `defaultValue` | `string` | `-` | Initial uncontrolled value |
| `onChange` | `(value: string) => void` | `-` | Callback fired when an option is selected |
| `placeholder` | `string` | `Select...` | - |
| `disabled` | `boolean` | `false` | - |
| `emptyMessage` | `string` | `No results found` | Message displayed when filtering returns zero results |
| `filter` | `(input: string, option: ComboboxOption) => boolean` | `-` | Custom filter function. Defaults to simple substring matching on the label. |
| `leftIcon` | `ReactNode` | `-` | - |
| `rightIcon` | `ReactNode` | `-` | - |
| `renderOption` | `(option: ComboboxOption, active: boolean) => ReactNode` | `-` | Custom renderer for the entire option row |
| `renderOptionIcon` | `(option: ComboboxOption) => ReactNode` | `-` | Custom renderer strictly for the option's icon |


