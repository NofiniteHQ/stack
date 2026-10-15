# Callouts and Collapsible Sections

**Nofinite Markon** provides first-class support for callout advisory boxes and Notion-style collapsible accordions.

Both components are styled using **NUICSS** semantic color tokens and designed to highlight critical instructions, warnings, or deep-dive technical appendices without disrupting reading flow.

---

## Callout Advisory Boxes

Callouts wrap paragraphs, code snippets, or lists inside a prominent container with a semantic SVG icon and soft background tint.

### The 4 Semantic Variants

| Variant       | Theme Color                    | Icon                      | Recommended Use Case                                                     |
| :------------ | :----------------------------- | :------------------------ | :----------------------------------------------------------------------- |
| **`info`**    | `var(--color-info)` (Blue)     | Circle with `i`           | Informational notes, tips, contextual background, and helpful hints      |
| **`success`** | `var(--color-success)` (Green) | Shield with Checkmark     | Best practices, successful validations, and verified architectural steps |
| **`warning`** | `var(--color-warning)` (Amber) | Triangle with Exclamation | Deprecation notices, operational caveats, and non-destructive gotchas    |
| **`danger`**  | `var(--color-danger)` (Red)    | Hexagon with Stop         | Security vulnerabilities, data loss risks, and destructive commands      |

---

### Inserting Callouts

1. **Slash Commands:** Type `/info`, `/success`, `/warning`, or `/danger` to insert the specific variant.
2. **Contextual Menu:** In the editor, clicking the callout icon opens a floating popover that allows authors to switch between the 4 variants with 1 click.
3. **Editor Command API:**

   ```ts
   // Insert an info callout at the current cursor location
   editor.commands.insertCallout({ type: 'info' });

   // Change the variant of the currently focused callout
   editor.commands.setCalloutType('danger');
   ```

---

### React Example

```tsx
import React, { useState } from 'react';
import { MarkonEditor } from '@nofinite/markon/react';
import '@nofinite/nuicss/styles.css';

const guideContent = `
<h2>Production Deployment Protocol</h2>

<div class="markon-callout" data-callout-type="info">
  <p><strong>Note:</strong> Automated deployments occur every Tuesday at 02:00 UTC during the low-traffic maintenance window.</p>
</div>

<div class="markon-callout" data-callout-type="warning">
  <p><strong>Warning:</strong> Ensure database connection pools have a minimum timeout of 10s before rolling restart.</p>
</div>

<div class="markon-callout" data-callout-type="danger">
  <p><strong>Danger:</strong> Running <code>DROP TABLE CASCADE</code> without a verified PITR snapshot will result in permanent data loss.</p>
</div>
`;

export function CalloutDemoEditor() {
  const [content, setContent] = useState(guideContent);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-surface border border-default rounded-2xl shadow-sm">
      <MarkonEditor content={content} onChange={setContent} />
    </div>
  );
}
```

---

## Collapsible Sections (Accordions)

Collapsible sections enable authors to tuck away extensive logs, code samples, or reference documentation behind an expandable toggle.

### Key Capabilities

- **Native `<details>` & `<summary>` Semantics:** Complies with web accessibility standards, operable via keyboard (<kbd>Space</kbd> or <kbd>Enter</kbd>).
- **Animated Toggle Chevron:** Built-in rotating indicator matching **NUICSS** interactive cues.
- **Arbitrary Child Blocks:** The collapsible body supports paragraphs, tables, images, and syntax-highlighted code blocks.

### Inserting Collapsible Sections

1. **Slash Command:** Type `/toggle` or `/collapsible`.
2. **Command API:**
   ```ts
   editor.commands.insertDetails();
   ```

### HTML Markup Representation

```html
<details class="markon-details">
  <summary class="markon-summary">View Database Migration SQL</summary>
  <div data-details-content class="markon-details-content">
    <pre><code class="language-sql">ALTER TABLE users ADD COLUMN mfa_enabled BOOLEAN DEFAULT FALSE;</code></pre>
  </div>
</details>
```

---

## Styling & Token Architecture

All borders, backgrounds, and icon strokes consume OKLCH color tokens defined by `@nofinite/nuicss`:

```css
/* Base Callout Container */
.markon-callout {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  padding: 1rem 1.25rem;
  border-radius: var(--radius-lg);
  margin: 1.25rem 0;
  transition: border-color 150ms ease, background-color 150ms ease;
}

/* Callout Variant Theming */
.markon-callout[data-callout-type='info'] {
  border: 1px solid color-mix(in oklab, var(--color-info) 30%, transparent);
  background-color: color-mix(in oklab, var(--color-info) 8%, transparent);
  color: var(--fg-default);
}

.markon-callout[data-callout-type='warning'] {
  border: 1px solid color-mix(in oklab, var(--color-warning) 30%, transparent);
  background-color: color-mix(in oklab, var(--color-warning) 8%, transparent);
  color: var(--fg-default);
}

.markon-callout[data-callout-type='danger'] {
  border: 1px solid color-mix(in oklab, var(--color-danger) 30%, transparent);
  background-color: color-mix(in oklab, var(--color-danger) 8%, transparent);
  color: var(--fg-default);
}

.markon-callout[data-callout-type='success'] {
  border: 1px solid color-mix(in oklab, var(--color-success) 30%, transparent);
  background-color: color-mix(in oklab, var(--color-success) 8%, transparent);
  color: var(--fg-default);
}

/* Collapsible Section */
.markon-details {
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding: 0.75rem 1rem;
  margin: 1rem 0;
  background-color: var(--bg-surface);
}

.markon-summary {
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  color: var(--fg-default);
  user-select: none;
}
```
