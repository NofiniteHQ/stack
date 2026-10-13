# MegaMenu

A compositional navigation primitive implementing a trigger-controlled expandable panel for complex multi-column navigation, category exploration, and marketing content.
Built with context-driven state orchestration, outside-click dismissal, and keyboard escape handling.

---

## Usage

### Basic

```tsx id="mm1">
import { MegaMenu } from '@nofinite/nui';
<MegaMenu>
  <MegaMenu.Trigger>Products</MegaMenu.Trigger>

  <MegaMenu.Content>Content</MegaMenu.Content>
</MegaMenu>;
```

---

### Multi-column layout

```tsx id="mm2">
<MegaMenu>
  <MegaMenu.Trigger>Solutions</MegaMenu.Trigger>

  <MegaMenu.Content className="grid grid-cols-3 gap-8">
    <Category />
    <Category />
    <Category />
  </MegaMenu.Content>
</MegaMenu>
```

---

### Rich marketing panel

```tsx id="mm3">
<MegaMenu>
  <MegaMenu.Trigger>Platform</MegaMenu.Trigger>

  <MegaMenu.Content>
    <Hero />
    <FeatureGrid />
    <CTA />
  </MegaMenu.Content>
</MegaMenu>
```

---

## Props

### MegaMenu

| Prop      | Type      | Default | Description         |
| --------- | --------- | ------- | ------------------- |
| className | string    | —       | Root override       |
| children  | ReactNode | —       | Compound components |

Extends `React.HTMLAttributes<HTMLDivElement>`.

---

### MegaMenu.Trigger

| Prop      | Type              | Default | Description          |
| --------- | ----------------- | ------- | -------------------- |
| className | string            | —       | Trigger override     |
| onClick   | MouseEventHandler | —       | Custom click handler |
| children  | ReactNode         | —       | Label / content      |

Extends `React.ButtonHTMLAttributes<HTMLButtonElement>`.

---

### MegaMenu.Content

| Prop      | Type      | Default | Description    |
| --------- | --------- | ------- | -------------- |
| className | string    | —       | Panel override |
| children  | ReactNode | —       | Panel content  |

Extends `React.HTMLAttributes<HTMLDivElement>`.

---

## Variants

MegaMenu supports interaction-based variants.

```tsx
<MegaMenu />
<MegaMenu.Trigger />
<MegaMenu.Content />
```

**Available variants:**

- closed
- open
- trigger-active
- content-visible

**Guidelines:**

- Use MegaMenu for high-density navigation only
- Avoid using for simple dropdown patterns

---

## Sizes

No intrinsic size variants.  
Sizing is consumer-driven via custom class overrides.

Default behavior:

- Trigger: intrinsic content width
- Content: `min-width: 480px`
- Panel supports responsive overrides

---

## Shapes / Modes

**Behavioral modes**

- Closed (default)
- Open (context-driven)

**Interaction modes**

- Toggle click
- Outside click dismissal
- Escape key dismissal
- Trigger focus restoration

**Layout modes**

- Single column
- Multi-column grid
- Marketing hero panel
- Mixed content navigation

---

## Design tokens / theming

Primary tokens:

- `--nui-space-*`
- `--nui-bg-surface`
- `--nui-border-default`
- `--nui-radius-lg`
- `--nui-z-dropdown`
- `--nui-color-primary`
- `--nui-fg-default`

Shadow and spacing tokens define panel elevation and density.

---

## Accessibility

Implemented:

- `aria-expanded` on trigger
- `aria-controls` linkage
- Unique ID generation
- Escape key close + focus restore
- Focus-visible outline
- Outside click dismissal

Limitations:

- No roving tabindex menu navigation
- No arrow-key navigation
- No typeahead navigation
- Role `menu` without menuitem semantics
- No focus trap

---

## Animation

Entrance animation:

- Scale + translate + fade
- Transform origin anchored to trigger
- Motion respects `prefers-reduced-motion`

Chevron rotation indicates state transition.

---

## Architectural notes

Key behaviors:

- Context-driven open state
- Compound component pattern
- Ref synchronization between root and trigger
- Document-level listeners for dismissal
- Lazy mount of content (performance)
- ID-based accessibility linkage
- CSS animation entrance for GPU-accelerated motion

Tradeoffs:

- No portal rendering → constrained by stacking context
- Menu positioning not collision-aware
- Outside click detection relies on DOM containment

---

## Best practices

### Do

- Use for complex product navigation
- Compose with Grid/Flex for panel structure
- Provide large touch targets inside panel
- Keep trigger labels concise
- Implement responsive content layout

### Don’t

- Use as replacement for simple dropdown
- Overload with excessive nested menus
- Place inside overflow-hidden containers
- Depend on default width for mobile layouts
- Mix unrelated navigation categories
