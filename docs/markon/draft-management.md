# Draft Auto-Save and Recovery

**Nofinite Markon** includes a built-in draft management engine (`MarkonDraftManager`) that guarantees authors never lose work due to unexpected browser crashes, tab closures, or network disconnects.

It features debounced background persistence, live save state indicators, and intelligent draft recovery dialogs.

---

## Key Capabilities

- **Debounced Local Persistence:** Automatically persists document revisions to `localStorage` or `IndexedDB` with customizable debounce timing (default 1,000ms).
- **Reactive Save States:** Emits 4 clean status states: `'idle'`, `'saving'`, `'saved'`, and `'error'`.
- **Custom Persistence Hooks:** Connect to backend databases, REST endpoints, or GraphQL mutations via asynchronous `onSave` callbacks.
- **Conflict & Recovery Detection:** Detects whether a local uncommitted draft is newer than the remote server copy and prompts the author with a 1-click recovery option.
- **Manual Commit Shortcuts:** Supports instantaneous manual persistence via <kbd>Cmd</kbd> + <kbd>S</kbd> / <kbd>Ctrl</kbd> + <kbd>S</kbd> and `window.beforeunload` triggers.

---

## Enabling Auto-Save in React

Pass the `autoSave` configuration object to `<MarkonEditor />`:

```tsx
import React, { useState } from 'react';
import { MarkonEditor } from '@nofinite/markon/react';
import '@nofinite/nuicss/styles.css';

export function ArticleComposer() {
  const [content, setContent] = useState(
    '<p>Start drafting your thought leadership article...</p>'
  );
  const [statusMessage, setStatusMessage] = useState('All changes saved');

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-surface border border-default rounded-2xl shadow-sm">
      {/* Save Status Header */}
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
          enabled: true,
          key: 'editor_post_draft_42',
          debounceMs: 1200,
          onSave: async (html, json) => {
            setStatusMessage('Saving...');

            // Persist to backend server
            await fetch('/api/posts/42/draft', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
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

---

## Save Status Lifecycle

```
[User Types Key] ──> [State: "saving"] ──> [Debounce Window (1000ms)]
                                                  │
            ┌─────────────────────────────────────┴─────────────────────────────────────┐
            ▼                                                                           ▼
   [Storage Success]                                                            [Storage Error]
            │                                                                           │
            ▼                                                                           ▼
    [State: "saved"]                                                            [State: "error"]
```

The `autoSave` engine provides state callbacks to display ambient feedback in your UI:

- **`saving`:** Displays a pulsing dot or spinner indicating changes are being serialized.
- **`saved`:** Reassures the author that changes are safely stored in durable storage.
- **`error`:** Alerts the author if quota limits were reached or the network request failed.

---

## Recovery Workflow for Existing Drafts

When an author opens an editor instance, you can verify if an unsaved local draft exists:

```tsx
import React, { useState, useEffect } from 'react';
import { MarkonEditor } from '@nofinite/markon/react';
import '@nofinite/nuicss/styles.css';

const DRAFT_KEY = 'user_post_draft_101';

export function DraftRecoveryEditor({
  initialServerHtml,
}: {
  initialServerHtml: string;
}) {
  const [content, setContent] = useState(initialServerHtml);
  const [hasRecoverableDraft, setHasRecoverableDraft] = useState(false);
  const [localDraftHtml, setLocalDraftHtml] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved && saved !== initialServerHtml) {
        setHasRecoverableDraft(true);
        setLocalDraftHtml(saved);
      }
    }
  }, [initialServerHtml]);

  const restoreDraft = () => {
    setContent(localDraftHtml);
    setHasRecoverableDraft(false);
  };

  const discardDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setHasRecoverableDraft(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Recovery Banner */}
      {hasRecoverableDraft && (
        <div className="flex items-center justify-between p-3.5 bg-warning/10 border border-warning/30 rounded-xl text-xs text-warning font-medium">
          <span>We recovered an unsaved local revision of this document.</span>
          <div className="flex gap-2">
            <button
              onClick={restoreDraft}
              className="px-2.5 py-1 bg-warning text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
            >
              Restore Draft
            </button>
            <button
              onClick={discardDraft}
              className="px-2.5 py-1 bg-surface text-muted border border-default rounded-lg hover:bg-surface-hover transition-colors"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      <div className="p-6 bg-surface border border-default rounded-2xl shadow-sm">
        <MarkonEditor
          content={content}
          onChange={setContent}
          autoSave={{
            enabled: true,
            key: DRAFT_KEY,
            debounceMs: 1000,
          }}
        />
      </div>
    </div>
  );
}
```

---

## Programmatic Save (`saveNow()`)

You can trigger an immediate persistence operation programmatically without waiting for the debounce timer:

```ts
// Trigger immediate save before closing a tab or navigating routes
await editor.draftManager.saveNow();
```
