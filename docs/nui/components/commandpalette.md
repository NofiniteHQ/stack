# CommandPalette

A **global command launcher modal** that enables fast keyboard-driven navigation and execution of actions.
Implements **sectioned command groups, fuzzy filtering, keyboard navigation, shortcut display, controlled/uncontrolled state, and accessible dialog semantics**.

---

## Usage

### Basic Command Palette

```tsx id="w92azk"
import { CommandPalette } from '@nofinite/nui';

<CommandPalette
  sections={[
    {
      title: 'Navigation',
      items: [
        { id: 'home', label: 'Go Home', onSelect: () => router.push('/') },
        {
          id: 'profile',
          label: 'Open Profile',
          onSelect: () => router.push('/profile'),
        },
      ],
    },
  ]}
/>;
```

---

### Controlled Open State

```tsx id="2m2sjx"
const [open, setOpen] = useState(false);

<CommandPalette open={open} onOpenChange={setOpen} sections={sections} />;
```

---

### Commands with Icons & Shortcuts

```tsx id="r9h5p2"
<CommandPalette
  sections={[
    {
      title: 'Editor',
      items: [
        {
          id: 'save',
          label: 'Save File',
          shortcut: 'Ctrl S',
          icon: <SaveIcon />,
          onSelect: saveFile,
        },
      ],
    },
  ]}
/>
```

---

### Commands with Descriptions

```tsx id="q2k3yx"
<CommandPalette
  sections={[
    {
      title: 'Search',
      items: [
        {
          id: 'docs',
          label: 'Search Docs',
          description: 'Open documentation search',
          onSelect: openDocs,
        },
      ],
    },
  ]}
/>
```

---

## Props

| Prop           | Type                      | Default              | Description                       |
| -------------- | ------------------------- | -------------------- | --------------------------------- |
| `sections`     | `CommandSection[]`        | —                    | Sectioned command groups          |
| `placeholder`  | `string`                  | `"Search commands…"` | Input placeholder                 |
| `className`    | `string`                  | `""`                 | Custom class override             |
| `open`         | `boolean`                 | —                    | Controlled open state             |
| `onOpenChange` | `(open: boolean) => void` | —                    | Triggered when open state changes |

---

## CommandItem Structure

| Field         | Type         | Description                   |
| ------------- | ------------ | ----------------------------- |
| `id`          | `string`     | Unique command identifier     |
| `label`       | `string`     | Primary command label         |
| `icon`        | `ReactNode`  | Optional leading icon         |
| `shortcut`    | `string`     | Keyboard shortcut hint        |
| `description` | `string`     | Secondary explanatory text    |
| `onSelect`    | `() => void` | Handler executed on selection |

---

## Variants

```tsx id="s0ac91"
<CommandPalette sections={sections} />                 // Default palette
<CommandPalette open />                                // Controlled open palette
<CommandPalette sections={sectionsWithIcons} />        // Icon commands
<CommandPalette sections={sectionsWithDescriptions} /> // Rich command items
```

**Available variants**

- `default` — Standard command launcher
- `controlled` — External state-driven palette
- `rich-items` — Commands with icons/description
- `shortcut-enabled` — Commands showing keyboard hints

**Guidelines**

- Use `default` for basic navigation actions
- Use `controlled` when integrating with app-level UI triggers
- Use `rich-items` for complex contextual commands
- Use `shortcut-enabled` for productivity workflows

---

## States

| State      | Description                  |
| ---------- | ---------------------------- |
| `closed`   | Palette hidden               |
| `open`     | Modal visible                |
| `active`   | Keyboard-highlighted command |
| `filtered` | Search-filtered results      |
| `empty`    | No results state             |

---

## Keyboard Interaction

| Key            | Behavior                 |
| -------------- | ------------------------ |
| `Cmd/Ctrl + K` | Toggle palette           |
| `Arrow Down`   | Move selection forward   |
| `Arrow Up`     | Move selection backward  |
| `Enter`        | Execute selected command |
| `Escape`       | Close palette            |
| `Typing`       | Filter commands          |

---

## Accessibility

- Uses **dialog + listbox pattern**
- Supports full keyboard navigation
- Active item uses `aria-selected`
- Screen reader friendly structured sections
- Click outside and Escape close behavior
- Auto-focus search input on open

---

## Design Tokens

```css id="t9f2sw"
:root {
  --nui-radius-xl: 16px;
  --nui-space-2: 8px;
  --nui-space-3: 12px;
  --nui-space-4: 16px;
  --nui-space-12: 48px;

  --nui-bg-surface: #ffffff;
  --nui-bg-subtle: #f3f4f6;
  --nui-border-default: #e5e7eb;
  --nui-fg-default: #111827;
  --nui-fg-muted: #6b7280;
  --nui-color-primary: #3b82f6;
}
```

---

## Best Practices

### Do

- Use for global navigation and command execution
- Group commands into semantic sections
- Provide meaningful descriptions for discoverability
- Include shortcuts for power users
- Keep command labels concise and action-oriented

### Don’t

- Overload palette with rarely used commands
- Mix unrelated command groups in same section
- Use long descriptions that increase visual noise
- Remove keyboard navigation support
- Hide critical commands behind filtering
