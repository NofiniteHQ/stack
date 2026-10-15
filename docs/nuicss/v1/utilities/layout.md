---
title: Layout
sidebar_position: 1
---

# Layout Utilities

Layout utilities control how elements are displayed in the document flow.

These utilities define the **display property**, which determines how an element behaves in the layout.

NUI CSS provides utilities for common layout patterns such as block elements, inline elements, flex containers, and grid containers.

---

# Block

The `block` utility makes an element behave as a block-level element.

Block elements take up the full width of their parent container.

### Example

```html
<div class="block">Block Element</div>
```

### Class Reference

| Class | CSS            |
| ----- | -------------- |
| block | display: block |

---

# Inline

The `inline` utility makes an element behave like an inline element.

Inline elements do not start on a new line and only occupy the width of their content.

### Example

```html
<span class="inline"> Inline Element </span>
```

### Class Reference

| Class  | CSS             |
| ------ | --------------- |
| inline | display: inline |

---

# Inline Block

The `inline-block` utility allows elements to flow inline while still accepting width and height.

This is useful for layout components like buttons or cards.

### Example

```html
<div class="inline-block p-4">Inline Block</div>
```

### Class Reference

| Class        | CSS                   |
| ------------ | --------------------- |
| inline-block | display: inline-block |

---

# Flex

The `flex` utility creates a flex container.

Flexbox allows flexible layouts that can easily align and distribute space among elements.

### Example

```html
<div class="flex gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### Class Reference

| Class | CSS           |
| ----- | ------------- |
| flex  | display: flex |

---

# Inline Flex

`inline-flex` behaves like flex but keeps the container inline.

### Example

```html
<div class="inline-flex gap-2">
  <span>Item</span>
  <span>Item</span>
</div>
```

### Class Reference

| Class       | CSS                  |
| ----------- | -------------------- |
| inline-flex | display: inline-flex |

---

# Grid

The `grid` utility enables CSS Grid layout.

Grid is useful for two-dimensional layouts.

### Example

```html
<div class="grid gap-4">
  <div>Item</div>
  <div>Item</div>
  <div>Item</div>
</div>
```

### Class Reference

| Class | CSS           |
| ----- | ------------- |
| grid  | display: grid |

---

# Hidden

The `hidden` utility removes an element from the layout.

It is equivalent to `display: none`.

### Example

```html
<div class="hidden">This element is hidden</div>
```

### Class Reference

| Class  | CSS           |
| ------ | ------------- |
| hidden | display: none |

---

# Complete Layout Class List

NUI CSS layout utilities include:

```
block
inline
inline-block
flex
inline-flex
grid
hidden
```

These utilities map directly to the CSS `display` property.
