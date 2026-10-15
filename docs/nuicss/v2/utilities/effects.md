---
sidebar_position: 6
title: Effects & Filters
---

# Effects & Filters

NUI CSS offers advanced effects to build modern, premium interfaces, including shadows, opacity, and blurs.

## Box Shadow

Control the box shadow of an element.

- `shadow-sm`: A subtle, small shadow.
- `shadow`: The default shadow size.
- `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl`
- `shadow-inner`: An inset shadow.
- `shadow-none`: Removes any shadow.

### Colored Shadows

Use the arbitrary shadow utility to apply colored shadows, or configure them directly in your `nuicss.config.ts`.

`shadow-[0_10px_15px_-3px_rgba(var(--nui-primary),0.3)]`

## Focus Rings

Focus rings are critical for accessibility and premium input interactions. NUI CSS fully replicates Tailwind's ring system.

- `ring`: Default 3px solid ring.
- `ring-0`, `ring-1`, `ring-2`, `ring-4`, `ring-8`: Custom ring widths.
- `ring-primary`, `ring-success`, `ring-[#000133]`: Colored rings.
- `ring-offset-2`, `ring-offset-4`: Adds a solid shadow gap between the element and the ring.
- `ring-offset-white`, `ring-offset-[#111111]`: Sets the offset color (usually matches the background).
- `ring-inset`: Forces the ring to render inside the element.

**Example Usage (Interactive Input):**

```html
<input
  class="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#111111]"
/>
```

## Opacity

Control the opacity of an element.

- `opacity-0`
- `opacity-5`, `opacity-10`, `opacity-20`, `opacity-25`, `opacity-30`
- `opacity-40`, `opacity-50`, `opacity-60`, `opacity-70`, `opacity-75`
- `opacity-80`, `opacity-90`, `opacity-95`, `opacity-100`

## Backdrop Blur (Glassmorphism)

NUI CSS provides built-in utilities for creating glassmorphism effects using the CSS `backdrop-filter` property.

To use it, simply apply a `backdrop-blur-*` utility to a semi-transparent container.

- `backdrop-blur-sm`: Small blur (4px)
- `backdrop-blur`: Standard blur (8px)
- `backdrop-blur-md`: Medium blur (12px)
- `backdrop-blur-lg`: Large blur (16px)
- `backdrop-blur-xl`: Extra large blur (24px)
- `backdrop-blur-2xl`: 2x large blur (40px)
- `backdrop-blur-3xl`: 3x large blur (64px)
- `backdrop-blur-none`: Removes backdrop blur

### Glassmorphism Example

```html
<div
  class="bg-surface/50 backdrop-blur-xl border border-default/30 shadow-2xl rounded-2xl p-6"
>
  <!-- Content -->
</div>
```

## Transforms

Control scaling and translating of elements.

- `scale-50`, `scale-75`, `scale-90`, `scale-95`, `scale-100`, `scale-105`, `scale-110`, `scale-150`
- Arbitrary scaling: `scale-[1.02]`, `scale-x-[0.98]`, `scale-y-[1.1]`
- Translation: `translate-x-full`, `translate-y-1/2`, `-translate-x-4`
- Arbitrary translation: `translate-x-[200px]`, `-translate-y-[5%]`

## Transitions & Animations

### Transitions

- `transition-all`
- `transition-colors`
- `transition-opacity`
- `transition-transform`
- `transition-shadow`

Combine with durations like `duration-150`, `duration-300`, `duration-500` and timing functions like `ease-in`, `ease-out`, `ease-in-out`.

### Keyframe Animations

NUI CSS provides built-in interactive animations with embedded `@keyframes`.

- `animate-spin`
- `animate-ping`
- `animate-pulse`
- `animate-bounce`
- `animate-fade-in`
- `animate-fade-out`
