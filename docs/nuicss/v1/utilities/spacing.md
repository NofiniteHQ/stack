---
title: Spacing
sidebar_position: 3
---

# Spacing Utilities

Spacing utilities control **padding, margin, and layout gaps**.

They are built on top of the **NUI spacing scale**, which uses CSS variables.

This ensures consistent spacing across layouts while allowing runtime theme customization.

---

# Spacing Scale

NUI CSS uses a predictable spacing scale.

| Token | Default Value |
| ----- | ------------- |
| 0     | 0px           |
| 0-5   | 0.125rem      |
| 1     | 0.25rem       |
| 1-5   | 0.375rem      |
| 2     | 0.5rem        |
| 2-5   | 0.625rem      |
| 3     | 0.75rem       |
| 4     | 1rem          |
| 5     | 1.25rem       |
| 6     | 1.5rem        |
| 8     | 2rem          |
| 10    | 2.5rem        |
| 12    | 3rem          |
| 14    | 3.5rem        |
| 16    | 4rem          |
| 20    | 5rem          |
| 24    | 6rem          |
| 32    | 8rem          |

These values are configurable through CSS variables.

---

# Padding

Padding utilities add spacing **inside elements**.

---

## All Sides

| Class | Example           |
| ----- | ----------------- |
| p-0   | padding: 0        |
| p-0-5 | padding: 0.125rem |
| p-1   | padding: 0.25rem  |
| p-1-5 | padding: 0.375rem |
| p-2   | padding: 0.5rem   |
| p-2-5 | padding: 0.625rem |
| p-3   | padding: 0.75rem  |
| p-4   | padding: 1rem     |
| p-5   | padding: 1.25rem  |
| p-6   | padding: 1.5rem   |
| p-8   | padding: 2rem     |
| p-10  | padding: 2.5rem   |
| p-12  | padding: 3rem     |
| p-14  | padding: 3.5rem   |
| p-16  | padding: 4rem     |
| p-20  | padding: 5rem     |
| p-24  | padding: 6rem     |
| p-32  | padding: 8rem     |

### Example

```html
<div class="p-4">Content</div>
```

---

# Padding X Axis

Horizontal padding.

| Class  |
| ------ |
| px-0   |
| px-0-5 |
| px-1   |
| px-1-5 |
| px-2   |
| px-2-5 |
| px-3   |
| px-4   |
| px-5   |
| px-6   |
| px-8   |
| px-10  |
| px-12  |
| px-14  |
| px-16  |
| px-20  |
| px-24  |
| px-32  |

Example:

```html
<div class="px-4"></div>
```

---

# Padding Y Axis

Vertical padding.

| Class  |
| ------ |
| py-0   |
| py-0-5 |
| py-1   |
| py-1-5 |
| py-2   |
| py-2-5 |
| py-3   |
| py-4   |
| py-5   |
| py-6   |
| py-8   |
| py-10  |
| py-12  |
| py-14  |
| py-16  |
| py-20  |
| py-24  |
| py-32  |

Example:

```html
<div class="py-6"></div>
```

---

# Individual Padding Sides

## Top

| Class  |
| ------ |
| pt-0   |
| pt-0-5 |
| pt-1   |
| pt-1-5 |
| pt-2   |
| pt-2-5 |
| pt-3   |
| pt-4   |
| pt-5   |
| pt-6   |
| pt-8   |
| pt-10  |
| pt-12  |
| pt-14  |
| pt-16  |
| pt-20  |
| pt-24  |
| pt-32  |

Example:

```html
<div class="pt-4"></div>
```

---

## Right

| Class  |
| ------ |
| pr-0   |
| pr-0-5 |
| pr-1   |
| pr-1-5 |
| pr-2   |
| pr-2-5 |
| pr-3   |
| pr-4   |
| pr-5   |
| pr-6   |
| pr-8   |
| pr-10  |
| pr-12  |
| pr-14  |
| pr-16  |
| pr-20  |
| pr-24  |
| pr-32  |

---

## Bottom

| Class  |
| ------ |
| pb-0   |
| pb-0-5 |
| pb-1   |
| pb-1-5 |
| pb-2   |
| pb-2-5 |
| pb-3   |
| pb-4   |
| pb-5   |
| pb-6   |
| pb-8   |
| pb-10  |
| pb-12  |
| pb-14  |
| pb-16  |
| pb-20  |
| pb-24  |
| pb-32  |

---

## Left

| Class  |
| ------ |
| pl-0   |
| pl-0-5 |
| pl-1   |
| pl-1-5 |
| pl-2   |
| pl-2-5 |
| pl-3   |
| pl-4   |
| pl-5   |
| pl-6   |
| pl-8   |
| pl-10  |
| pl-12  |
| pl-14  |
| pl-16  |
| pl-20  |
| pl-24  |
| pl-32  |

---

# Margin

Margin utilities add spacing **outside elements**.

---

## All Sides

| Class |
| ----- |
| m-0   |
| m-0-5 |
| m-1   |
| m-1-5 |
| m-2   |
| m-2-5 |
| m-3   |
| m-4   |
| m-5   |
| m-6   |
| m-8   |
| m-10  |
| m-12  |
| m-14  |
| m-16  |
| m-20  |
| m-24  |
| m-32  |

Example:

```html
<div class="m-4"></div>
```

---

# Margin Axis

## Horizontal

| Class  |
| ------ |
| mx-0   |
| mx-0-5 |
| mx-1   |
| mx-1-5 |
| mx-2   |
| mx-2-5 |
| mx-3   |
| mx-4   |
| mx-5   |
| mx-6   |
| mx-8   |
| mx-10  |
| mx-12  |
| mx-14  |
| mx-16  |
| mx-20  |
| mx-24  |
| mx-32  |

---

## Vertical

| Class  |
| ------ |
| my-0   |
| my-0-5 |
| my-1   |
| my-1-5 |
| my-2   |
| my-2-5 |
| my-3   |
| my-4   |
| my-5   |
| my-6   |
| my-8   |
| my-10  |
| my-12  |
| my-14  |
| my-16  |
| my-20  |
| my-24  |
| my-32  |

---

# Individual Margins

| Class |
| ----- |
| mt-\* |
| mr-\* |
| mb-\* |
| ml-\* |

Example:

```html
<div class="mt-4"></div>
```

---

# Gap Utilities

Gap controls spacing between flex and grid items.

| Class   |
| ------- |
| gap-0   |
| gap-0-5 |
| gap-1   |
| gap-1-5 |
| gap-2   |
| gap-2-5 |
| gap-3   |
| gap-4   |
| gap-5   |
| gap-6   |
| gap-8   |
| gap-10  |
| gap-12  |
| gap-14  |
| gap-16  |
| gap-20  |
| gap-24  |
| gap-32  |

Example:

```html
<div class="flex gap-4"></div>
```

---

# Complete Spacing Class Pattern

```
p-*
px-* py-*
pt-* pr-* pb-* pl-*

m-*
mx-* my-*
mt-* mr-* mb-* ml-*

gap-*
```

These utilities map directly to spacing CSS properties.
