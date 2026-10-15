---
title: Flexbox
sidebar_position: 2
---

# Flexbox Utilities

Flexbox utilities allow you to build flexible layouts using the CSS Flexbox system.

A flex container enables powerful alignment and distribution of space between elements.

Before using flex utilities, the container must have the `flex` or `inline-flex` class.

```html
<div class="flex">
  <div>Item</div>
  <div>Item</div>
</div>
```

---

# Flex Direction

Flex direction controls the **main axis** of a flex container.

---

## Row

Items are arranged horizontally.

### Example

```html
<div class="flex flex-row gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### Class Reference

| Class    | CSS                 |
| -------- | ------------------- |
| flex-row | flex-direction: row |

---

## Column

Items are arranged vertically.

### Example

```html
<div class="flex flex-col gap-2">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### Class Reference

| Class    | CSS                    |
| -------- | ---------------------- |
| flex-col | flex-direction: column |

---

# Flex Wrap

Flex wrapping controls whether items should wrap onto multiple lines.

---

## Wrap

Items move to the next line when there is not enough space.

### Example

```html
<div class="flex flex-wrap gap-4">
  <div>Card</div>
  <div>Card</div>
  <div>Card</div>
  <div>Card</div>
</div>
```

### Class Reference

| Class     | CSS             |
| --------- | --------------- |
| flex-wrap | flex-wrap: wrap |

---

## No Wrap

Items stay on a single line even if they overflow.

### Example

```html
<div class="flex flex-nowrap gap-4">
  <div>Item</div>
  <div>Item</div>
  <div>Item</div>
</div>
```

### Class Reference

| Class       | CSS               |
| ----------- | ----------------- |
| flex-nowrap | flex-wrap: nowrap |

---

# Align Items

Align items controls **vertical alignment** inside a flex container.

---

## Start

Items align to the start of the cross axis.

```html
<div class="flex items-start"></div>
```

| Class       | CSS                     |
| ----------- | ----------------------- |
| items-start | align-items: flex-start |

---

## Center

Items align to the center.

```html
<div class="flex items-center"></div>
```

| Class        | CSS                 |
| ------------ | ------------------- |
| items-center | align-items: center |

---

## End

Items align to the end.

```html
<div class="flex items-end"></div>
```

| Class     | CSS                   |
| --------- | --------------------- |
| items-end | align-items: flex-end |

---

## Stretch

Items stretch to fill the container height.

```html
<div class="flex items-stretch"></div>
```

| Class         | CSS                  |
| ------------- | -------------------- |
| items-stretch | align-items: stretch |

---

# Justify Content

Justify utilities control **horizontal distribution of items**.

---

## Start

Items align to the start.

```html
<div class="flex justify-start"></div>
```

| Class         | CSS                         |
| ------------- | --------------------------- |
| justify-start | justify-content: flex-start |

---

## Center

Items align to the center.

```html
<div class="flex justify-center"></div>
```

| Class          | CSS                     |
| -------------- | ----------------------- |
| justify-center | justify-content: center |

---

## End

Items align to the end.

```html
<div class="flex justify-end"></div>
```

| Class       | CSS                       |
| ----------- | ------------------------- |
| justify-end | justify-content: flex-end |

---

## Space Between

Items are evenly distributed with space between them.

```html
<div class="flex justify-between"></div>
```

| Class           | CSS                            |
| --------------- | ------------------------------ |
| justify-between | justify-content: space-between |

---

# Complete Flex Class List

NUI CSS provides the following flex utilities.

```
flex-row
flex-col

flex-wrap
flex-nowrap

items-start
items-center
items-end
items-stretch

justify-start
justify-center
justify-end
justify-between
```

These utilities map directly to CSS Flexbox properties and enable flexible layout systems.
