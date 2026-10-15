# VirtualList

A high-performance scrollable list component that efficiently renders only visible rows. Supports dynamic row virtualization, custom item rendering, fixed row heights, and large datasets without performance degradation.

---

## Usage

### Basic usage

```tsx id="vl1"
import { VirtualList } from '@nofinite/nui';

const items = Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`);

<VirtualList
  items={items}
  height={400}
  renderItem={(item) => <div>{item}</div>}
/>;
```

### With custom row height

```tsx id="vl2"
<VirtualList
  items={items}
  height={400}
  itemHeight={60}
  renderItem={(item) => <div>{item}</div>}
/>
```

### With overscan for smoother scrolling

```tsx id="vl3"
<VirtualList
  items={items}
  height={400}
  overscan={5}
  renderItem={(item) => <div>{item}</div>}
/>
```

### Using key extractor

```tsx id="vl4"
<VirtualList
  items={items}
  height={400}
  keyExtractor={(item, index) => `key-${index}`}
  renderItem={(item) => <div>{item}</div>}
/>
```

---

## Props

| Prop           | Type                                               | Default | Description                                  |     |
| -------------- | -------------------------------------------------- | ------- | -------------------------------------------- | --- |
| `items`        | `T[]`                                              | —       | Array of data items to render                |     |
| `height`       | `number`                                           | —       | Height of the scrollable viewport in pixels  |     |
| `itemHeight`   | `number`                                           | 40      | Fixed height of each row in pixels           |     |
| `overscan`     | `number`                                           | 3       | Extra rows rendered above and below viewport |     |
| `keyExtractor` | `(item: T, index: number) => string     \| number` | —       | Returns a unique key for each item           |
| `renderItem`   | `(item: T, index: number) => ReactNode`            | —       | Function to render each row                  |     |
| `className`    | `string`                                           | —       | Additional styling for the container         |     |

---

## Variants

### Large datasets

```tsx id="vl5"
const items = Array.from({ length: 10000 }, (_, i) => `Row ${i + 1}`);

<VirtualList
  items={items}
  height={500}
  renderItem={(item) => <div>{item}</div>}
/>;
```

### Custom content per row

```tsx id="vl6"
<VirtualList
  items={items}
  height={400}
  renderItem={(item) => (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span>{item}</span>
      <button>Edit</button>
    </div>
  )}
/>
```

**Available variants**

- Fixed row height (default 40px)
- Custom row heights (via itemHeight)
- Overscan for smooth scrolling
- Key extractor for dynamic items
- Render any JSX per row

**Guidelines**

- Use for large datasets where full DOM rendering is inefficient
- Always provide `keyExtractor` when using dynamic items
- Keep `itemHeight` consistent for best performance
- Use overscan to prevent flickering when scrolling

---

## States

- Default (visible portion rendered)
- Hover (row highlight)
- Scroll (virtualization offsets applied)

---

## Keyboard Interaction

- Standard browser scrolling applies
- Focusable elements inside rows can receive keyboard events
- Container supports tab navigation if interactive elements exist inside rows

---

## Accessibility

- `role="list"` on container
- `role="listitem"` on each row
- Fully scrollable via keyboard or pointer
- Supports focusable interactive content inside rows
- Uses semantic roles for screen readers

---

## Design Tokens

| Token                | Usage                          |
| -------------------- | ------------------------------ |
| --nui-bg-surface     | Container background           |
| --nui-border-default | Row borders & container border |
| --nui-radius-md      | Container border radius        |
| --nui-font-sans      | Font family                    |
| --nui-text-sm        | Row text size                  |
| --nui-fg-default     | Row text color                 |
| --nui-bg-subtle      | Row hover background           |
| --nui-space-4        | Row horizontal padding         |

---

## Best Practices

### Do

- Use for very large lists (thousands of rows)
- Keep row heights consistent for optimal virtualization
- Provide keyExtractor for dynamic or filtered items
- Combine with interactive row content safely
- Use overscan to prevent flickering

### Don’t

- Use for very small lists where regular mapping is sufficient
- Mix variable heights unless properly calculated
- Overload rows with heavy components causing render jank
- Forget to provide unique keys for dynamic items
- Remove scrollable container or overflow properties
