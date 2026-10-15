# Layout primitives

A low-level layout system providing constraint-based width management, flexbox composition, and responsive grid orchestration.
Implements attribute-driven styling, CSS variable gap control, and compositional wrappers for common layout patterns.

---

## Usage

### Container

```tsx id="lay1">
import { Container } from '@nofinite/nui';
<Container size="lg">Content</Container>;
```

---

### Flex

```tsx id="lay2">
import { Flex } from '@nofinite/nui';
<Flex justify="between" align="center" gap={12}>
  <div>A</div>
  <div>B</div>
</Flex>;
```

---

### Stack (vertical sugar)

```tsx id="lay3">
import { Stack } from '@nofinite/nui';
<Stack gap={16}>
  <div>Item</div>
  <div>Item</div>
</Stack>;
```

---

### HStack (horizontal sugar)

```tsx id="lay4">
<HStack gap={8}>
  <Avatar />
  <span>Name</span>
</HStack>
```

---

### Grid responsive auto-fit

```tsx id="lay5">
<Grid gap={24} minColWidth="280px">
  <Card />
  <Card />
</Grid>
```

---

### Grid fixed columns

```tsx id="lay6">
<Grid columns={3} gap={16}>
  <Card />
  <Card />
  <Card />
</Grid>
```

---

## Props

### Container

| Prop        | Type                                     | Default | Description          |
| ----------- | ---------------------------------------- | ------- | -------------------- |
| `size`      | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `lg`    | Max width constraint |
| `className` | `string`                                 | —       | Override             |
| `children`  | `ReactNode`                              | —       | Content              |

Extends `React.HTMLAttributes<HTMLDivElement>`.

---

### Flex

| Prop        | Type                                                                | Default | Description              |
| ----------- | ------------------------------------------------------------------- | ------- | ------------------------ |
| `direction` | `'row' \| 'column' \| 'row-reverse'  \| 'column-reverse'`           | row     | Flex direction           |
| `align`     | `'start' \| 'center' \| 'end'   \| 'stretch' \| 'baseline' `        | stretch | Cross-axis alignment     |
| `justify`   | `'start' \| 'center' \| 'end' \| 'between' \| 'around' \| 'evenly'` | start   | Main-axis alignment      |
| `wrap`      | `'wrap' \| 'nowrap' \| 'wrap-reverse'`                              | nowrap  | Wrapping behavior        |
| `gap`       | `number     \| string `                                             | 0       | Spacing between children |

Extends `React.HTMLAttributes<HTMLDivElement>`.

---

### Grid

| Prop          | Type                                  | Default      | Description                 |
| ------------- | ------------------------------------- | ------------ | --------------------------- |
| `columns`     | `number \| 'auto-fit' \| 'auto-fill'` | `'auto-fit'` | Column strategy             |
| `gap`         | `number \| string`                    | `16`         | Grid spacing                |
| `minColWidth` | `string`                              | `250px`      | Min width for auto-fit/fill |

Extends `React.HTMLAttributes<HTMLDivElement>`.

---

## Variants

```tsx
<Container size="sm" />
<Container size="xl" />
<Flex direction="column" />
<Flex justify="between" />
<Grid columns={3} />
<Grid columns="auto-fit" />
<Grid columns="auto-fill" />
```

**Available variants:**

- container-sm
- container-md
- container-lg
- container-xl
- container-full
- flex-row
- flex-column
- flex-wrap
- flex-between
- grid-fixed
- grid-auto-fit
- grid-auto-fill

**Guidelines:**

- Use container only for page-level width constraints
- Prefer Stack/HStack for semantic layout clarity
- Use grid auto-fit for responsive card systems

---

## Sizes

### Container

| Size | Max width |
| ---- | --------- |
| sm   | 640px     |
| md   | 768px     |
| lg   | 1024px    |
| xl   | 1280px    |
| full | 100%      |

---

## Shapes / Modes

**Flex states**

- Direction variants
- Alignment variants
- Justification variants
- Wrap variants
- Dynamic gap

**Grid states**

- Fixed columns
- Auto-fit responsive
- Auto-fill responsive
- Variable gap
- Dynamic min column width

**Container states**

- Constrained
- Full width

---

## Design tokens / theming

Key tokens:

- `--nui-space-*`
- `--nui-flex-gap`
- `--nui-grid-gap`
- `--nui-grid-min-width`
- `--nui-grid-cols-fixed`

Container horizontal padding uses spacing token fallback.

---

## Accessibility

Implemented:

- Pure structural layout primitives
- No semantic role overrides
- Maintains DOM reading order
- Stack/HStack improve readability through composition
- Grid maintains source-order navigation

Limitations:

- No landmark roles
- No spatial navigation hints
- Visual grouping not announced to assistive tech

---

## Animation model

- No intrinsic animation
- Gap and direction changes reflow naturally
- Motion delegated to consumer layer

---

## Architectural notes

Key behaviors:

- Attribute-driven CSS mapping (low runtime cost)
- CSS variable gap allows dynamic spacing without class explosion
- Stack/HStack are syntactic composition wrappers
- Grid responsive behavior using `minmax`
- Container provides centralized layout constraint primitive
- ForwardRef enables integration with measurement libraries

Potential caveats:

- CSS variable gap prevents static extraction in some atomic CSS systems
- Auto-fit grid may create uneven column counts with extreme widths

---

## Best practices

### Do

- Prefer Stack/HStack over manual flex direction for readability
- Use auto-fit grid for responsive cards
- Keep container usage at layout boundaries
- Standardize gap tokens for visual rhythm
- Combine grid + flex for complex layouts

### Don’t

- Nest containers excessively
- Mix grid and flex alignment semantics incorrectly
- Use fixed column grid for highly dynamic content
- Depend on layout primitives for spacing-only concerns
