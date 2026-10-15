# Avatar

A flexible and accessible avatar component for representing users or entities with **images, initials, or fallback icons**. Supports multiple sizes, shapes, status indicators, loading states, and grouping.

---

## Usage

### Basic Avatar

```tsx
import { Avatar } from '@nofinite/nui';

<Avatar src="https://example.com/avatar.jpg" alt="John Doe" />;
```

### Avatar with initials fallback

```tsx
<Avatar name="John Doe" />
```

### Avatar with custom fallback icon

```tsx
<Avatar name="John Doe" fallbackIcon={<svg>...</svg>} />
```

### Avatar with status

```tsx
<Avatar name="Jane Smith" status="online" />
```

### Loading Avatar

```tsx
<Avatar loading />
```

---

## AvatarGroup

Groups multiple avatars into a compact stack. Shows an excess counter (`+n`) if more avatars exist than `max`.

```tsx
import { Avatar, AvatarGroup } from '@nofinite/nui';

<AvatarGroup max={3} size="md">
  <Avatar name="Alice" />
  <Avatar name="Bob" />
  <Avatar name="Charlie" />
  <Avatar name="Diana" /> {/* Will appear as "+1" */}
</AvatarGroup>;
```

---

## Props

### Avatar

| Prop           | Type                                        | Default  | Description                                      |
| -------------- | ------------------------------------------- | -------- | ------------------------------------------------ |
| `src`          | `string`                                    | —        | Image source URL                                 |
| `alt`          | `string`                                    | —        | Alternate text for the avatar image              |
| `name`         | `string`                                    | —        | User name, used for initials if image is missing |
| `size`         | `'sm' \| 'md' \| 'lg' \| 'xl'`              | `'md'`   | Avatar size                                      |
| `shape`        | `'circle' \| 'rounded' \| 'square'`         | `circle` | Avatar shape                                     |
| `status`       | `'online' \| 'offline' \| 'busy' \| 'away'` | —        | Optional status indicator                        |
| `loading`      | `boolean`                                   | `false`  | Shows skeleton shimmer while loading             |
| `fallbackIcon` | `React.ReactNode`                           | —        | Icon shown if image and initials are missing     |
| `className`    | `string`                                    | `""`     | Additional CSS class                             |
| `...rest`      | `React.HTMLAttributes<HTMLElement>`         | —        | Other native props                               |

### AvatarGroup

| Prop        | Type                           | Default | Description                                     |
| ----------- | ------------------------------ | ------- | ----------------------------------------------- |
| `children`  | `React.ReactNode[]`            | —       | Avatar components to group                      |
| `max`       | `number`                       | `3`     | Maximum avatars to show, overflow shown as `+n` |
| `size`      | `'sm' \| 'md' \| 'lg' \| 'xl'` | `md`    | Size of avatars inside the group                |
| `className` | `string`                       | `""`    | Additional CSS class                            |

---

## Sizes

The `size` prop controls the avatar’s width, height, and font-size for initials/fallback icons.

| Size | Dimensions |
| ---- | ---------- |
| `sm` | 32×32px    |
| `md` | 40×40px    |
| `lg` | 56×56px    |
| `xl` | 72×72px    |

---

## Shapes

The `shape` prop controls the border radius.

| Shape     | Description              |
| --------- | ------------------------ |
| `circle`  | Full round avatar        |
| `rounded` | Slightly rounded corners |
| `square`  | Sharp square corners     |

---

## Status Indicator

Add a small status dot to represent user state.

| Status    | Description        |
| --------- | ------------------ |
| `online`  | Active / available |
| `offline` | Offline / inactive |
| `busy`    | Do not disturb     |
| `away`    | Away from keyboard |

> Status appears as a small colored dot at the bottom-right of the avatar. `aria-label` is automatically applied for accessibility.

---

## Loading State

When `loading` is `true`:

- Shows a **skeleton shimmer** instead of image or initials.
- Sets `cursor: wait`.
- Hides the content to avoid flicker.
- Helpful for asynchronous avatar loading or user data fetching.

---

## Fallback Behavior

Avatar displays content in the following order:

1. Image (`src`) if available and not errored.
2. User initials (`name`) if image is missing.
3. `fallbackIcon` if initials are not available.
4. Default placeholder icon.

---

## Accessibility

- `role="img"` is applied to the root.
- `aria-label` uses `alt` → `name` → `"Avatar"` as fallback.
- Status indicator uses `role="status"` and `aria-label` for screen readers.
- Loading avatars do not announce image content.
- AvatarGroup is purely visual; individual avatars retain accessibility props.

---

## Design Tokens / Theming

You can customize Avatar appearance using CSS variables:

```css
:root {
  /* Sizes & radius */
  --nui-radius-sm: 4px;
  --nui-radius-md: 8px;
  --nui-radius-full: 9999px;

  /* Colors */
  --nui-bg-subtle: #f3f4f6;
  --nui-bg-page: #ffffff;
  --nui-bg-muted: #e5e7eb;
  --nui-fg-subtle: #6b7280;
  --nui-color-success: #22c55e;
  --nui-color-danger: #ef4444;
  --nui-amber-500: #d97706;
  --nui-slate-400: #94a3b8;

  /* Typography */
  --nui-font-sans: 'Inter', sans-serif;
  --nui-weight-medium: 500;
  --nui-weight-bold: 700;

  /* Spacing */
  --nui-space-1: 4px;
  --nui-space-2: 8px;
  --nui-space-3: 12px;
  --nui-space-4: 16px;
}
```

---

## Best Practices

### Do

- Provide `alt` text whenever possible for screen readers.
- Use initials or fallback icons if image is not available.
- Keep avatars small in groups for compact UI.

### Don’t

- Rely solely on color to indicate status.
- Place critical info inside avatars.
- Use large groups (>5) without grouping (`AvatarGroup`) and excess counters.
