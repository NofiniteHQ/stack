---
title: Prefixed Utilities
sidebar_position: 5
---

# Prefixed Utilities

NUI CSS provides a **prefixed version of all utility classes**.

This version is designed for environments where class name collisions may occur, such as component libraries, design systems, and distributed UI packages.

Instead of using standard utility classes like `flex` or `p-4`, the prefixed version adds a `nui-` prefix.

Example:

```

flex      → nui-flex
p-4       → nui-p-4
gap-4     → nui-gap-4
items-center → nui-items-center

```

The prefixed build ensures that styles remain isolated and do not conflict with other CSS frameworks.

---

# When to Use Prefixed Utilities

Use prefixed utilities when:

- Building **component libraries**
- Publishing **UI packages to npm**
- Integrating with unknown environments
- Preventing conflicts with other CSS frameworks
- Developing reusable design systems

In these cases, using prefixed utilities guarantees predictable styling.

---

# Importing the Prefixed Stylesheet

To enable prefixed utilities, import the prefixed stylesheet.

```js
import '@nofinite/nuicss/prefixed';
```

Once imported, all utilities are available with the `nui-` prefix.

---

# Example

### Standard utilities

```html
<div class="flex items-center gap-4 p-4">
  <button>Save</button>
  <button>Cancel</button>
</div>
```

### Prefixed utilities

```html
<div class="nui-flex nui-items-center nui-gap-4 nui-p-4">
  <button>Save</button>
  <button>Cancel</button>
</div>
```

Both examples produce identical layouts.

The only difference is the prefixed class naming.

---

# Example: Component Library

Prefixed utilities are especially useful when creating reusable components.

```html
<div class="nui-flex nui-items-center nui-gap-2 nui-p-3">
  <span>Profile</span>
  <button>Logout</button>
</div>
```

This prevents conflicts if the host application uses another CSS framework.

---

# Available Prefixed Classes

Every standard utility class has a prefixed equivalent.

Examples:

Layout utilities:

```
nui-block
nui-inline
nui-inline-block
nui-flex
nui-inline-flex
nui-grid
nui-hidden
```

Flex utilities:

```
nui-flex-row
nui-flex-col
nui-flex-wrap
nui-flex-nowrap
nui-items-start
nui-items-center
nui-items-end
nui-items-stretch
nui-justify-start
nui-justify-center
nui-justify-end
nui-justify-between
```

Spacing utilities:

```
nui-p-4
nui-m-4
nui-gap-4
nui-px-6
nui-py-2
nui-mt-4
```

Sizing utilities:

```
nui-w-full
nui-w-32
nui-h-16
nui-h-screen
```

These prefixed utilities correspond directly to the standard utilities.

---

# Why NUI CSS Provides Prefixed Utilities

Many CSS frameworks assume they control the global namespace.

However, when building reusable UI components, this assumption breaks.

The prefixed build solves this problem by:

- preventing style collisions
- ensuring predictable rendering
- enabling safe integration into third-party applications

This approach allows NUI CSS to support both **application development** and **component library development**.

---

# Summary

NUI CSS provides two utility modes.

| Mode               | Use Case                |
| ------------------ | ----------------------- |
| Standard utilities | Application development |
| Prefixed utilities | Component libraries     |

Standard:

```
flex p-4 gap-4
```

Prefixed:

```
nui-flex nui-p-4 nui-gap-4
```

Choose the mode that best fits your project architecture.
