# Fileuploader (fileuploader)

## Import
```tsx
import { FileUploader } from '@nofinite/nui';
```

## Architecture & Styling Rules
- **Semantic Tokens ONLY:** Use `bg-surface`, `text-default`, `border-subtle`, `bg-primary-subtle`, `text-danger`, etc. DO NOT USE raw tailwind colors (no `bg-blue-500`, no `text-gray-900`).
- **Accessibility:** Must adhere to strict WAI-ARIA standards. Ensure proper `role` and `aria-*` attributes.

## API / Props
### `FileUploader` Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `value` | `File[]` | `-` | Controlled state for the selected files |
| `defaultValue` | `File[]` | `-` | Uncontrolled initial state for the selected files |
| `onChange` | `(files: File[]) => void` | `-` | Callback fired when the list of selected files changes |
| `multiple` | `boolean` | `false` | Whether to allow multiple files to be selected. Defaults to false. |
| `accept` | `string` | `-` | A comma-separated list of allowed file extensions or MIME types (e.g., '.jpg, .png, application/pdf') |
| `maxSize` | `number` | `-` | Maximum allowed file size in bytes |
| `className` | `string` | `-` | Custom class name applied to the root container |
| `placeholder` | `ReactNode` | `-` | Custom text or element displayed inside the dropzone (Primary Title) |
| `description` | `ReactNode` | `-` | Secondary text or description below the placeholder |
| `disabled` | `boolean` | `false` | Disables the dropzone and prevents file selection |


