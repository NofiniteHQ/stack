# Draft Auto-Save and Recovery

**Nofinite Markon** includes a built-in draft management engine (`MarkonDraftManager`) that guarantees authors never lose work due to unexpected browser crashes, tab closures, or network disconnects.

It features debounced background persistence, live save state indicators, and intelligent draft recovery dialogs.

```ts
// Framework-Agnostic Core
import {
  MarkonEditor,
  MarkonDraftManager,
  type AutoSaveConfig,
} from '@nofinite/markon';

// React Adapter
import { MarkonEditor as ReactMarkonEditor } from '@nofinite/markon/react';
```

---

## Key Capabilities

- **Debounced Local Persistence:** Automatically persists document revisions to `localStorage` with customizable debounce timing (default 1,000ms).
- **Reactive Save States:** Emits 4 clean status states: `'idle'`, `'saving'`, `'saved'`, and `'error'`.
- **Custom Persistence Hooks:** Connect to backend databases, REST endpoints, or GraphQL mutations via asynchronous `onSave` callbacks.
- **Conflict & Recovery Detection:** Detects whether an unsaved local draft exists and offers a 1-click restore modal.

---

## 1. Framework-Agnostic Core Usage

Configure draft management directly when instantiating `MarkonEditor`:

```ts
import { MarkonEditor } from '@nofinite/markon';
import '@nofinite/nuicss/styles.css';

const container = document.querySelector('#editor')!;

const editor = new MarkonEditor({
  element: container,
  showSaveStatus: true,
  autoSave: {
    key: 'draft_article_101',
    debounceMs: 1200,
    onSave: async (html, json) => {
      console.log('Auto-saving revision to server...');
      await fetch('/api/drafts/101', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html, json }),
      });
      console.log('Revision saved successfully.');
    },
  },
});
```

---

## 2. React Adapter Usage

In React applications, pass the `autoSave` configuration object as a component prop:

```tsx
import React, { useState } from 'react';
import { MarkonEditor } from '@nofinite/markon/react';
import '@nofinite/nuicss/styles.css';

export function ArticleComposer() {
  const [content, setContent] = useState(
    '<p>Start drafting your article...</p>'
  );
  const [statusMessage, setStatusMessage] = useState('All changes saved');

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-surface border border-default rounded-2xl shadow-sm">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-default">
        <h1 className="text-lg font-bold text-default">Article Editor</h1>
        <div className="text-xs font-medium text-muted flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-success" />
          {statusMessage}
        </div>
      </div>

      <MarkonEditor
        content={content}
        onChange={setContent}
        autoSave={{
          key: 'editor_draft_101',
          debounceMs: 1200,
          onSave: async (html, json) => {
            setStatusMessage('Saving...');
            await fetch('/api/draft', {
              method: 'POST',
              body: JSON.stringify({ html, json }),
            });
            setStatusMessage('All changes saved');
          },
        }}
      />
    </div>
  );
}
```
