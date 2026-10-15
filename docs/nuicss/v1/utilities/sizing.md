---
title: Sizing
sidebar_position: 4
---

# Sizing Utilities

Sizing utilities control the **width and height of elements**.

They are built using the same spacing scale used throughout NUI CSS, ensuring consistent sizing across layouts.

These utilities are commonly used for layout containers, icons, images, cards, and UI components.

---

# Width Utilities

Width utilities define the horizontal size of elements.

---

## Fixed Width Scale

These utilities map to the NUI spacing scale.

| Class | Default Size |
| ----- | ------------ |
| w-0   | 0px          |
| w-0-5 | 0.125rem     |
| w-1   | 0.25rem      |
| w-1-5 | 0.375rem     |
| w-2   | 0.5rem       |
| w-2-5 | 0.625rem     |
| w-3   | 0.75rem      |
| w-4   | 1rem         |
| w-5   | 1.25rem      |
| w-6   | 1.5rem       |
| w-8   | 2rem         |
| w-10  | 2.5rem       |
| w-12  | 3rem         |
| w-14  | 3.5rem       |
| w-16  | 4rem         |
| w-20  | 5rem         |
| w-24  | 6rem         |
| w-32  | 8rem         |
| w-40  | 10rem        |
| w-48  | 12rem        |
| w-64  | 16rem        |

Example:

```html
<div class="w-32">Fixed width container</div>
```

---

# Fluid Width

Fluid width utilities expand relative to the viewport or parent container.

| Class    | CSS          |
| -------- | ------------ |
| w-auto   | width: auto  |
| w-full   | width: 100%  |
| w-screen | width: 100vw |

Example:

```html
<div class="w-full">Full width container</div>
```

---

# Height Utilities

Height utilities control the vertical size of elements.

---

## Fixed Height Scale

| Class | Default Size |
| ----- | ------------ |
| h-0   | 0px          |
| h-0-5 | 0.125rem     |
| h-1   | 0.25rem      |
| h-1-5 | 0.375rem     |
| h-2   | 0.5rem       |
| h-2-5 | 0.625rem     |
| h-3   | 0.75rem      |
| h-4   | 1rem         |
| h-5   | 1.25rem      |
| h-6   | 1.5rem       |
| h-8   | 2rem         |
| h-10  | 2.5rem       |
| h-12  | 3rem         |
| h-14  | 3.5rem       |
| h-16  | 4rem         |
| h-20  | 5rem         |
| h-24  | 6rem         |
| h-32  | 8rem         |
| h-40  | 10rem        |
| h-48  | 12rem        |
| h-64  | 16rem        |

Example:

```html
<div class="h-16">Fixed height container</div>
```

---

# Fluid Height

These utilities control dynamic height.

| Class    | CSS           |
| -------- | ------------- |
| h-auto   | height: auto  |
| h-full   | height: 100%  |
| h-screen | height: 100vh |

Example:

```html
<div class="h-screen flex items-center justify-center">Full screen section</div>
```

---

# Square Elements

Using width and height together allows easy square elements.

Example:

```html
<div class="w-12 h-12 flex items-center justify-center">Icon</div>
```

Common use cases:

- avatars
- icons
- buttons
- cards

---

# Complete Sizing Class List

Width utilities:

```
w-0
w-0-5
w-1
w-1-5
w-2
w-2-5
w-3
w-4
w-5
w-6
w-8
w-10
w-12
w-14
w-16
w-20
w-24
w-32
w-40
w-48
w-64
w-auto
w-full
w-screen
```

Height utilities:

```
h-0
h-0-5
h-1
h-1-5
h-2
h-2-5
h-3
h-4
h-5
h-6
h-8
h-10
h-12
h-14
h-16
h-20
h-24
h-32
h-40
h-48
h-64
h-auto
h-full
h-screen
```

These utilities map directly to CSS width and height properties.
