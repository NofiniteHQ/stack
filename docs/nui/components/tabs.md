# Tabs

A composable, accessible tabs component implementing **compound component architecture**, controlled/uncontrolled state, roving tabindex keyboard navigation, ARIA-linked triggers and panels, and responsive overflow handling.

---

## Usage

### Basic usage

```tsx
import { Tabs } from '@nofinite/nui';

<Tabs defaultValue="account">
  <Tabs.List>
    <Tabs.Trigger value="account">Account</Tabs.Trigger>
    <Tabs.Trigger value="password">Password</Tabs.Trigger>
  </Tabs.List>

  <Tabs.Content value="account">Account content</Tabs.Content>
  <Tabs.Content value="password">Password content</Tabs.Content>
</Tabs>;
```

### Controlled usage

```tsx
const [tab, setTab] = useState('account');

<Tabs value={tab} onChange={setTab}>
  <Tabs.List>
    <Tabs.Trigger value="account">Account</Tabs.Trigger>
    <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
  </Tabs.List>

  <Tabs.Content value="account">Account</Tabs.Content>
  <Tabs.Content value="billing">Billing</Tabs.Content>
</Tabs>;
```

### Disabled tab

```tsx
<Tabs defaultValue="a">
  <Tabs.List>
    <Tabs.Trigger value="a">A</Tabs.Trigger>
    <Tabs.Trigger value="b" disabled>
      B
    </Tabs.Trigger>
  </Tabs.List>

  <Tabs.Content value="a">Content A</Tabs.Content>
</Tabs>
```

### Scrollable mobile tabs

```tsx
<Tabs defaultValue="tab1">
  <Tabs.List>
    {items.map((i) => (
      <Tabs.Trigger key={i} value={i}>
        {i}
      </Tabs.Trigger>
    ))}
  </Tabs.List>
</Tabs>
```

---

## Props

### Tabs Root

| Prop         | Type                 | Default | Description             |
| ------------ | -------------------- | ------- | ----------------------- |
| value        | string               | —       | Controlled selected tab |
| defaultValue | string               | ""      | Initial selected tab    |
| onChange     | (value:string)=>void | —       | Value change handler    |
| children     | ReactNode            | —       | Compound children       |
| className    | string               | —       | Styling override        |

---

### Tabs List

| Prop      | Type      | Default | Description      |
| --------- | --------- | ------- | ---------------- |
| children  | ReactNode | —       | Tab triggers     |
| className | string    | —       | Styling override |

---

### Tabs Trigger

| Prop      | Type    | Default | Description          |
| --------- | ------- | ------- | -------------------- |
| value     | string  | —       | Associated tab value |
| disabled  | boolean | false   | Disables trigger     |
| className | string  | —       | Styling override     |

---

### Tabs Content

| Prop      | Type   | Default | Description      |
| --------- | ------ | ------- | ---------------- |
| value     | string | —       | Panel value      |
| className | string | —       | Styling override |

---

## Variants

### Control variants

```tsx
<Tabs defaultValue="a" />
<Tabs value="a" onChange={()=>{}} />
```

### Trigger variants

```tsx
<Tabs.Trigger value="a" />
<Tabs.Trigger value="b" disabled />
```

### Layout variants

```tsx
<Tabs.List />
<Tabs.List className="scrollable" />
```

### Content rendering variants

```tsx
<Tabs.Content value="a" />
<Tabs.Content value="b" />
```

**Available variants**

- Controlled tabs
- Uncontrolled tabs
- Disabled trigger tabs
- Scrollable mobile tabs
- Auto-select on focus tabs
- Animated content tabs
- Compound composition tabs

**Guidelines**

- Prefer controlled mode for router-driven tabs
- Use disabled triggers for unavailable sections
- Keep tab count reasonable on mobile
- Provide semantic labels for accessibility
- Avoid heavy mounting cost inside tab content

---

## States

- Default
- Hover trigger
- Selected trigger
- Disabled trigger
- Focus-visible trigger
- Content mounted
- Content transitioning

---

## Keyboard Interaction

- ArrowRight → next tab
- ArrowLeft → previous tab
- Home → first tab
- End → last tab
- Tab → moves into panel
- Focus automatically activates tab (roving tabindex)

---

## Accessibility

- Compound ARIA tab pattern
- `role="tablist"`, `role="tab"`, `role="tabpanel"`
- `aria-selected` reflects state
- `aria-controls` links trigger → panel
- `aria-labelledby` links panel → trigger
- Stable ID prefix ensures SR compatibility
- Only active tab is tabbable
- Disabled tabs excluded from roving navigation

---

## Design Tokens

| Token                | Usage            |
| -------------------- | ---------------- |
| --nui-border-default | Tab list divider |
| --nui-border-hover   | Hover indicator  |
| --nui-color-primary  | Active indicator |
| --nui-fg-default     | Text             |
| --nui-fg-subtle      | Inactive text    |
| --nui-brand-200      | Focus ring       |
| --nui-space-\*       | Spacing scale    |
| --nui-radius-sm      | Focus rounding   |
| --nui-font-sans      | Typography       |

---

## Best Practices

### Do

- Use controlled tabs for URL-sync navigation
- Keep tab labels concise
- Mount heavy content lazily if expensive
- Provide disabled state when needed
- Use unique tab values

### Don’t

- Duplicate tab values
- Use index as value
- Nest interactive elements inside triggers
- Hide essential actions inside non-selected panels
- Mount large data grids inside all panels simultaneously
