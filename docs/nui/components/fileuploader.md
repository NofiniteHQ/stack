# FileUploader

`FileUploader` is a flexible file upload component that supports drag-and-drop, click-to-upload, keyboard interaction, file previews, and file removal. It works for both single and multiple file uploads with optional file type filtering.

---

## Usage

### Basic usage

```tsx
import { FileUploader } from '@nofinite/nui';

<FileUploader onChange={(files) => console.log(files)} />;
```

---

### Multiple files

```tsx id="fu2">
<FileUploader multiple />
```

---

### Controlled state

```tsx id="fu3">
const [files, setFiles] = useState<File[]>([]);

<FileUploader value={files} onChange={setFiles} />;
```

---

### With restrictions

```tsx id="fu4">
<FileUploader multiple accept="image/*" maxSize={2 * 1024 * 1024} />
```

---

### Disabled

```tsx id="fu5">
<FileUploader disabled />
```

---

## Props

| Prop           | Type                      | Default                                      | Description                   |
| -------------- | ------------------------- | -------------------------------------------- | ----------------------------- |
| `value`        | `File[]`                  | —                                            | Controlled files              |
| `defaultValue` | `File[]`                  | []                                           | Initial uncontrolled files    |
| `onChange`     | `(files: File[]) => void` | —                                            | Change callback               |
| `multiple`     | `boolean`                 | `false`                                      | Enable multi-file aggregation |
| `accept`       | `string`                  | —                                            | Native accept filter          |
| `maxSize`      | `number`                  | —                                            | Maximum file size in bytes    |
| `placeholder`  | `ReactNode`               | `Drag & drop files here, or click to browse` | Dropzone text                 |
| `disabled`     | `boolean`                 | `false `                                     | Disable interaction           |
| `className`    | `string`                  | —                                            | Root class override           |

---

## Subcomponents

None exposed.

---

## Variants

```tsx
<FileUploader />
<FileUploader multiple />
<FileUploader disabled />
<FileUploader accept="image/*" />
<FileUploader maxSize={2097152} />
```

**Available variants:**

- single (default)
- multiple
- disabled
- type-restricted
- size-restricted

**Guidelines:**

- Use multiple for gallery or document uploads
- Always provide accept when backend enforces MIME
- Use size restriction to avoid unnecessary network cost

---

## Sizes

Layout behavior:

| Element   | Behavior                    |
| --------- | --------------------------- |
| Dropzone  | full-width container        |
| File list | vertical stack              |
| File item | auto height with truncation |
| Icons     | fixed (16–24px)             |

Sizing is controlled via layout utilities and token spacing.

---

## Shapes / Modes

**Interaction states**

- Idle
- Drag-over
- File-selected
- File-removed
- Disabled

**Data modes**

- Controlled
- Uncontrolled
- Multi-file aggregation
- Size-filtered
- MIME-filtered (native)

---

## Design tokens / theming

Uses NUI tokens:

- `--nui-bg-surface`
- `--nui-bg-subtle`
- `--nui-bg-muted`
- `--nui-fg-default`
- `--nui-fg-subtle`
- `--nui-fg-muted`
- `--nui-border-default`
- `--nui-border-hover`
- `--nui-color-primary`
- `--nui-color-danger`
- `--nui-radius-*`
- `--nui-space-*`
- `--nui-text-sm`
- `--nui-weight-medium`
- `--nui-font-sans`

---

## Accessibility

Implemented:

- Dropzone
  - `role="button"`
  - keyboard activation (Enter/Space)
  - focus-visible outline
  - `aria-disabled`
  - drag event semantics
- Remove button
  - aria-label per file
- Hidden input remains native for browser accessibility
- Programmatic focus preserved

Limitations:

- No upload progress semantics
- No aria-live updates for file list
- No error announcement for rejected files
- Drag announcements depend on browser behavior

---

## Animation model

- File item pop-in via translateY + fade
- Duration: 200ms
- Drag-over visual highlight
- Motion disabled with `prefers-reduced-motion`

No exit animation for removal.

---

## Architectural notes

Key design decisions:

- Input proxy pattern
- Controlled/uncontrolled duality
- Immutable file list replacement
- Size validation pre-merge
- Stable file key generation using name + size + lastModified
- Drag state isolation
- Event propagation control

Potential caveat:

- File object identity used for removal (same file reselect handled via input reset)

---

## Best practices

### Do

- Validate server-side regardless of client filters
- Provide accept to guide user selection
- Use multiple for batch uploads
- Display upload progress externally if needed

### Don’t

- Depend on client MIME filtering for security
- Upload extremely large files without chunking
- Store File objects long-term in global state
- Render heavy previews synchronously
