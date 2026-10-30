# Media and File Uploads

**Nofinite Markon** provides an integrated media subsystem covering interactive image resizing, alignment controls, video embeds, downloadable file attachments, and asynchronous upload placeholders.

All media widgets are styled with **NUICSS** superclasses and respect responsive container constraints.

```ts
// Framework-Agnostic Core
import { MarkonEditor } from '@nofinite/markon';

// React Adapter
import { MarkonEditor as ReactMarkonEditor } from '@nofinite/markon/react';
```

---

## Media Subsystem Capabilities

- **Interactive Images:** Corner drag handles for freeform scaling, width presets (`25%`, `50%`, `75%`, `100%`), alignment (`Left`, `Center`, `Right`), and accessible caption editing.
- **Video Embeds:** Responsive 16:9 embeds for YouTube, Vimeo, and direct MP4/WebM video URLs.
- **File Attachments:** Visual file cards with formatted size labels (e.g. `2.4 MB`) and download triggers for PDFs, ZIPs, and spreadsheets.

---

## 1. Framework-Agnostic Core Upload Handling

Pass `onUploadFile` directly to `MarkonEditor`:

```ts
import { MarkonEditor } from '@nofinite/markon';
import '@nofinite/nuicss/styles.css';

const container = document.querySelector('#editor')!;

const editor = new MarkonEditor({
  element: container,
  placeholder: "Drag and drop media or type '/'...",
  onUploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('media', file);

    const res = await fetch('/api/uploads', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();

    // Return the uploaded CDN URL:
    return data.url;
  },
});
```

---

## 2. React Adapter Usage

In React applications, implement `onUploadFile`:

```tsx
import React, { useState } from 'react';
import { MarkonEditor } from '@nofinite/markon/react';
import '@nofinite/nuicss/styles.css';

export function MediaUploadingEditor() {
  const [content, setContent] = useState('');

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    return data.url;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-surface border border-default rounded-2xl">
      <MarkonEditor
        content={content}
        onChange={setContent}
        onUploadFile={handleUpload}
        placeholder="Drag and drop images or type '/' for media..."
      />
    </div>
  );
}
```
