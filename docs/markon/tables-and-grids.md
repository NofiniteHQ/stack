# Tables and Grids

**Nofinite Markon** provides an interactive table editing suite designed for structured tabular data, API parameter specifications, and financial reports.

It combines an intuitive visual dimension picker with contextual cell toolbars, cell merging, and full GitHub-Flavored Markdown table interoperability.

---

## Key Features

- **Visual Dimension Picker:** Hover-to-select grid popup supporting table sizes up to 10×10.
- **Contextual Table Toolbar:** A floating action bar that automatically appears when the text cursor enters any table cell.
- **Structural Row & Column Commands:** 1-click actions to insert rows above/below, columns left/right, and delete targeted segments.
- **Cell Merging & Splitting:** Combine adjacent rectangular cell ranges or split merged cells back into standard grid units.
- **Header Toggles:** Independently enable or disable top header rows (`<th>`) and left header columns.
- **Clean Responsive Layouts:** Automatically styled with **NUICSS** table tokens and horizontal scrolling containers.

---

## Inserting Tables

Tables can be inserted through three methods:

1. **Toolbar Picker:** Click the Table icon in the editor toolbar to open the interactive 10×10 grid picker. Drag your mouse across the grid to highlight the desired rows and columns, then click to insert.
2. **Slash Command:** Type `/table` to instantly insert a default 3×3 table with a formatted header row.
3. **Markdown Syntax:** Paste raw Markdown table text:
   ```markdown
   | Endpoint        | Method | Rate Limit | Auth Required |
   | :-------------- | :----: | :--------: | :-----------: |
   | `/api/v1/users` | `GET`  |  100/min   |      Yes      |
   | `/api/v1/auth`  | `POST` |   20/min   |      No       |
   ```

---

## Interactive Table Toolbar

When the author clicks inside any cell, a floating context toolbar appears with the following controls:

| Action               | Icon        | Description                                                        |
| :------------------- | :---------- | :----------------------------------------------------------------- |
| **Add Row Above**    | Row +       | Inserts a blank row directly above the current cell                |
| **Add Row Below**    | Row -       | Inserts a blank row directly below the current cell                |
| **Add Column Left**  | Col +       | Inserts a blank column to the left of the current cell             |
| **Add Column Right** | Col -       | Inserts a blank column to the right of the current cell            |
| **Delete Row**       | Trash row   | Removes the current row                                            |
| **Delete Column**    | Trash col   | Removes the current column                                         |
| **Merge Cells**      | Merge icon  | Merges selected adjacent cells into a single spanning cell         |
| **Split Cell**       | Split icon  | Splits a previously merged cell back into its original rows/cols   |
| **Toggle Header**    | Header pill | Toggles the top row between normal cells and header cells (`<th>`) |
| **Delete Table**     | Red trash   | Completely removes the entire table                                |

---

## Usage in React

```tsx
import React, { useState } from 'react';
import { MarkonEditor } from '@nofinite/markon/react';
import '@nofinite/nuicss/styles.css';

const initialTableContent = `
<h2>Database Sharding Strategy</h2>
<table>
  <thead>
    <tr>
      <th>Cluster ID</th>
      <th>Region</th>
      <th>Nodes</th>
      <th>Replication Factor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>us-east-1a</code></td>
      <td>N. Virginia</td>
      <td>12</td>
      <td>3x Synced</td>
    </tr>
    <tr>
      <td><code>eu-west-1a</code></td>
      <td>Ireland</td>
      <td>8</td>
      <td>3x Synced</td>
    </tr>
  </tbody>
</table>
`;

export function TechnicalSpecEditor() {
  const [content, setContent] = useState(initialTableContent);

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-surface border border-default rounded-2xl shadow-sm">
      <MarkonEditor content={content} onChange={setContent} toolbar={true} />
    </div>
  );
}
```

---

## Keyboard Navigation Inside Tables

Authors can navigate and populate table cells rapidly using standard keyboard shortcuts:

- <kbd>Tab</kbd>: Move to the next cell. If pressed in the final cell of the last row, automatically creates a new row.
- <kbd>Shift</kbd> + <kbd>Tab</kbd>: Move to the previous cell.
- <kbd>↑</kbd> and <kbd>↓</kbd>: Navigate vertically between rows.
- <kbd>Enter</kbd>: Inserts a line break inside the current cell without exiting the cell.

---

## Styling & Token Integration

Tables inherit semantic **NUICSS** superclasses for borders, zebra striping, and cell padding:

```css
.markon-render table,
.markon-editor table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  font-size: 0.875rem;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.markon-render th,
.markon-editor th {
  background-color: var(--bg-surface-active);
  color: var(--fg-default);
  font-weight: 600;
  text-align: left;
  padding: 0.75rem 1rem;
  border-bottom: 2px solid var(--border-default);
}

.markon-render td,
.markon-editor td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-muted);
  color: var(--fg-default);
}

.markon-render tr:hover td,
.markon-editor tr:hover td {
  background-color: var(--bg-surface-hover);
}
```
