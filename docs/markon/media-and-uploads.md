# Media and File Uploads

**Nofinite Markon** provides a comprehensive media subsystem covering interactive image resizing, alignment controls, video embeds, downloadable file attachments, and asynchronous upload placeholders.

All media widgets are styled with **NUICSS** superclasses and respect responsive container constraints.

---

## Interactive Images

The `MarkonImage` extension equips standard images with interactive layout controls directly in the editing canvas.

### Key Capabilities

- **Interactive Corner Handles:** Drag corners to smoothly resize images to any custom width.
- **Width Presets:** 1-click presets for `25%`, `50%`, `75%`, and `100%` width.
- **Alignment Controls:** Align images `Left` (prose wrap), `Center` (default block), or `Right`.
- **Captions & Alt Text:** Edit accessible alt text and editorial captions.
- **Border & Shadow Styling:** Styled with `rounded-xl`, subtle border tokens, and responsive max-width guards.

### Inserting Images

1. **Toolbar Button:** Click the Image icon to open the URL prompt or file chooser.
2. **Slash Command:** Type `/image` to trigger the insert dialog.
3. **Drag-and-Drop:** Drag image files directly from your desktop onto the editor canvas.

---

## Video Embeds

The `MarkonVideo` extension enables responsive video playback for external platforms and direct video assets:

- **Supported Sources:**
  - YouTube (`youtube.com/watch?v=...`, `youtu.be/...`)
  - Vimeo (`vimeo.com/...`)
  - Direct video files (`.mp4`, `.webm`, `.ogg`)
- **Responsive 16:9 Aspect Ratio:** Wrapped inside an aspect ratio container to prevent layout shifting during page load.

### Inserting Videos

1. Type `/video` in the editor.
2. In the floating modal, paste the video URL.
3. Press **Embed Video**.

```html
<div
  class="markon-video-container aspect-video rounded-xl overflow-hidden my-4 border border-default shadow-sm"
>
  <iframe
    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
    class="w-full h-full"
    allowfullscreen
  />
</div>
```

---

## Downloadable File Attachments

For documents, zip archives, spreadsheets, and binaries, Markon renders a dedicated file card widget:

- **File Metadata:** Displays file name, extension badge (e.g., `PDF`, `ZIP`, `CSV`), and formatted size (e.g., `4.2 MB`).
- **Download Action:** Clicking the card triggers a clean file download.

### HTML Representation

```html
<div
  class="markon-file-attachment flex items-center gap-3 p-3.5 rounded-xl border border-default bg-surface hover:bg-surface-hover cursor-pointer my-3"
>
  <div
    class="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase"
  >
    PDF
  </div>
  <div class="flex-1 min-w-0">
    <div class="font-medium text-sm text-default truncate">
      Architecture-Whitepaper-v2.pdf
    </div>
    <div class="text-xs text-muted">2.4 MB</div>
  </div>
  <svg
    class="w-4 h-4 text-muted shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
</div>
```

---

## Asynchronous Upload Handlers

Connect your cloud storage bucket (AWS S3, Cloudflare R2, Supabase Storage) by implementing the `onImageUpload` and `onFileUpload` handlers:

```tsx
import React from 'react';
import { MarkonEditor } from '@nofinite/markon/react';
import '@nofinite/nuicss/styles.css';

export function MediaUploadingEditor() {
  const handleImageUpload = async (
    file: File
  ): Promise<{ src: string; alt?: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Image upload failed');
    }

    const data = await response.json();
    return {
      src: data.url,
      alt: file.name,
    };
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload/file', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    return {
      url: data.url,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
    };
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-surface border border-default rounded-2xl">
      <MarkonEditor
        onImageUpload={handleImageUpload}
        onFileUpload={handleFileUpload}
        placeholder="Drag and drop images or type '/' for media embeds..."
      />
    </div>
  );
}
```

---

## Upload Placeholders & Progress Indicators

While a file is transferring over the network, Markon displays an animated upload placeholder card:

- Displays an animated shimmer bar and progress percentage.
- Prevents accidental document submission while uploads are pending.
- Automatically swaps out the placeholder for the final image or file node upon server response.
- Gracefully displays a retry badge if the network request fails.
