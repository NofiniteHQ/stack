// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  MarkonEditor,
  renderMarkonEditor,
  getCounts,
  parseVideoUrl,
  formatFileSize,
  htmlToMarkdown,
  markdownToHtml,
} from './index';

describe('@nofinite/markon', () => {
  it('calculates word and character counts accurately', () => {
    const text = 'Hello world from Markon 2.0';
    const counts = getCounts(text);
    expect(counts.words).toBe(5);
    expect(counts.characters).toBe(27);
  });

  it('formats file sizes accurately', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(1048576 * 2.5)).toBe('2.5 MB');
  });

  it('parses video URLs correctly for YouTube, Vimeo, and custom streams', () => {
    const yt1 = parseVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    expect(yt1.service).toBe('youtube');
    expect(yt1.embedUrl).toContain('dQw4w9WgXcQ');

    const yt2 = parseVideoUrl('https://youtu.be/dQw4w9WgXcQ');
    expect(yt2.service).toBe('youtube');
    expect(yt2.embedUrl).toContain('dQw4w9WgXcQ');

    const vimeo = parseVideoUrl('https://vimeo.com/76979871');
    expect(vimeo.service).toBe('vimeo');
    expect(vimeo.embedUrl).toContain('76979871');

    const custom = parseVideoUrl('https://example.com/video.mp4');
    expect(custom.service).toBe('custom');
    expect(custom.embedUrl).toBe('https://example.com/video.mp4');
  });

  it('renders static editor HTML with all controls and NUICSS classes', () => {
    const html = renderMarkonEditor({
      placeholder: 'Test placeholder',
      initialValue: '<p>Initial test content</p>',
    });

    expect(html).toContain('editor markon-editor');
    expect(html).toContain('editor-toolbar');
    expect(html).toContain('editor-content');
    expect(html).toContain('editor-footer');
    expect(html).toContain('data-command="bold"');
    expect(html).toContain('data-command="italic"');
    expect(html).toContain('data-command="subscript"');
    expect(html).toContain('data-command="superscript"');
    expect(html).toContain('data-command="clearFormatting"');
    expect(html).toContain('data-command="justifyFull"');
    expect(html).toContain('editor-font-family-trigger');
    expect(html).toContain('editor-font-size-trigger');
    expect(html).toContain('editor-color-trigger');
    expect(html).toContain('editor-highlight-trigger');
    expect(html).toContain('editor-table-trigger');
    expect(html).toContain('data-command="insertTable"');
    expect(html).toContain('data-command="insertCodeBlock"');
    expect(html).toContain('data-command="insertVideo"');
    expect(html).toContain('data-command="insertDetails"');
    expect(html).toContain('data-command="insertFile"');
    expect(html).toContain('data-command="insertMath"');
  });

  describe('MarkonEditor DOM Class', () => {
    let container: HTMLElement;

    beforeEach(() => {
      container = document.createElement('div');
      document.body.appendChild(container);
    });

    afterEach(() => {
      document.body.removeChild(container);
    });

    it('instantiates and manages rich text without duplicate DOM rendering', () => {
      const editor = new MarkonEditor({
        element: container,
        initialValue: '<h2>Unique Heading</h2><p>Unique Paragraph</p>',
      });

      const contentEl = container.querySelector('.editor-content');
      expect(contentEl).not.toBeNull();

      // Ensure no duplicated content in the DOM tree
      const headingCount = container.querySelectorAll('h2').length;
      expect(headingCount).toBe(1);

      expect(editor.getText()).toContain('Unique Heading');
      expect(editor.getHTML()).toContain('<h2>Unique Heading</h2>');

      editor.setContent('<p>Updated Content</p>');
      expect(editor.getHTML()).toContain('<p>Updated Content</p>');

      editor.destroy();
    });

    it('executes formatting commands and updates toolbar state', () => {
      const editor = new MarkonEditor({
        element: container,
        initialValue: '<p>Hello world</p>',
      });

      // Select all text and apply bold
      editor.tiptap.commands.selectAll();
      editor.execCommand('bold');

      expect(editor.tiptap.isActive('bold')).toBe(true);

      const boldBtn = container.querySelector(
        '.editor-btn[data-command="bold"]'
      );
      expect(boldBtn?.classList.contains('btn-active')).toBe(true);
      expect(boldBtn?.getAttribute('aria-pressed')).toBe('true');

      editor.destroy();
    });

    it('inserts and manages tables and interactive table menu', () => {
      const editor = new MarkonEditor({
        element: container,
        initialValue: '<p>Before table</p>',
      });

      expect(editor.tableMenu).toBeDefined();

      // Open table menu
      editor.tableMenu?.open();
      const menuEl = document.querySelector('.markon-table-menu');
      expect(menuEl).toBeTruthy();

      // Trigger custom dimension insertion (4 cols x 2 rows)
      const cell = menuEl?.querySelector(
        'button[data-row="2"][data-col="4"]'
      ) as HTMLButtonElement;
      expect(cell).toBeTruthy();
      cell?.click();

      expect(editor.tiptap.isActive('table')).toBe(true);
      expect(editor.getHTML()).toContain('<table');

      // Table tools should now be visible
      const tableTools = container.querySelector('.editor-table-tools');
      expect(tableTools?.classList.contains('hidden')).toBe(false);

      editor.destroy();
    });

    it('inserts and manages video embeds', () => {
      const editor = new MarkonEditor({
        element: container,
        initialValue: '<p>Before video</p>',
      });

      editor.execCommand(
        'insertVideo',
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      );

      const html = editor.getHTML();
      expect(html).toContain('data-video-block');
      expect(html).toContain('youtube-nocookie.com/embed/dQw4w9WgXcQ');

      editor.destroy();
    });

    it('inserts and manages collapsible details sections', () => {
      const editor = new MarkonEditor({
        element: container,
        initialValue: '<p>Before details</p>',
      });

      editor.execCommand('insertDetails');

      const html = editor.getHTML();
      expect(html).toContain('<details');
      expect(html).toContain('<summary');
      expect(html).toContain('Toggle title');

      editor.destroy();
    });

    it('inserts and manages file attachments', () => {
      const editor = new MarkonEditor({
        element: container,
        initialValue: '<p>Before file</p>',
      });

      editor.tiptap.commands.insertFileAttachment({
        src: 'https://example.com/specs.pdf',
        name: 'specs.pdf',
        size: '1.2 MB',
        type: 'application/pdf',
      });

      const html = editor.getHTML();
      expect(html).toContain('data-file-attachment');
      expect(html).toContain('specs.pdf');
      expect(html).toContain('1.2 MB');
      expect(html).toContain('href="https://example.com/specs.pdf"');

      editor.destroy();
    });

    it('handles file upload hook asynchronously', async () => {
      const uploadMock = vi.fn().mockResolvedValue({
        url: 'https://cdn.example.com/uploaded.png',
        name: 'uploaded.png',
        size: 50000,
      });

      const editor = new MarkonEditor({
        element: container,
        onUploadFile: uploadMock,
      });

      const fakeFile = new File(['fake content'], 'test.png', {
        type: 'image/png',
      });

      await editor.handleUploadedFile(fakeFile);
      expect(uploadMock).toHaveBeenCalledWith(fakeFile);

      const html = editor.getHTML();
      expect(html).toContain('https://cdn.example.com/uploaded.png');

      editor.destroy();
    });

    it('inserts and manages math blocks', () => {
      const editor = new MarkonEditor({
        element: container,
        initialValue: '<p>Formula:</p>',
      });

      editor.execCommand('insertMath', 'E = mc^2');
      expect(editor.getHTML()).toContain('data-math-block');

      editor.destroy();
    });

    it('mounts custom typography menu and drag handle', () => {
      const editor = new MarkonEditor({
        element: container,
        initialValue: '<p>Paragraph 1</p>',
      });

      expect(editor.typographyMenu).toBeDefined();
      expect(editor.fontFamilyMenu).toBeDefined();
      expect(editor.fontSizeMenu).toBeDefined();
      expect(editor.textColorMenu).toBeDefined();
      expect(editor.highlightMenu).toBeDefined();
      expect(editor.tableMenu).toBeDefined();
      expect(editor.dragHandle).toBeDefined();
      expect(container.querySelector('.markon-drag-handle')).toBeTruthy();
      expect(container.querySelector('.markon-drop-indicator')).toBeTruthy();

      const trigger = container.querySelector('.editor-typography-trigger');
      expect(trigger).toBeTruthy();

      const labelEl = trigger?.querySelector('.editor-typography-label');
      expect(labelEl).toBeTruthy();
      expect(labelEl?.textContent).toBe('Paragraph');

      // Change format to Heading 1
      editor.tiptap.commands.setHeading({ level: 1 });
      editor.updateToolbarState();
      expect(labelEl?.textContent).toBe('Heading 1');
      expect(
        trigger?.querySelector('.editor-typography-icon')?.textContent
      ).toBe('H1');

      // Change format to Heading 2
      editor.tiptap.commands.setHeading({ level: 2 });
      editor.updateToolbarState();
      expect(labelEl?.textContent).toBe('Heading 2');
      expect(
        trigger?.querySelector('.editor-typography-icon')?.textContent
      ).toBe('H2');

      // Change format to Blockquote
      editor.tiptap.commands.toggleBlockquote();
      editor.updateToolbarState();
      expect(labelEl?.textContent).toBe('Quote');

      // Switch back to Paragraph
      editor.tiptap.chain().clearNodes().run();
      editor.updateToolbarState();
      expect(labelEl?.textContent).toBe('Paragraph');

      // Test subscript and clearFormatting
      editor.tiptap.commands.selectAll();
      editor.execCommand('subscript');
      expect(editor.tiptap.isActive('subscript')).toBe(true);

      editor.execCommand('clearFormatting');
      expect(editor.tiptap.isActive('subscript')).toBe(false);

      editor.destroy();
    });

    it('dynamically synchronizes readOnly without destroying the editor', () => {
      const editor = new MarkonEditor({
        element: container,
        initialValue: '<p>Editable initial</p>',
        readOnly: false,
      });

      expect(editor.tiptap.isEditable).toBe(true);
      expect(editor.dragHandle).toBeDefined();

      // Switch to readOnly
      editor.setReadOnly(true);
      expect(editor.tiptap.isEditable).toBe(false);
      expect(editor.dragHandle).toBeUndefined();

      const toolbar = container.querySelector('.editor-toolbar');
      expect(toolbar?.classList.contains('pointer-events-none')).toBe(true);

      const contentEl = container.querySelector('.editor-content');
      expect(contentEl?.getAttribute('contenteditable')).toBe('false');

      // Switch back to editable
      editor.setReadOnly(false);
      expect(editor.tiptap.isEditable).toBe(true);
      expect(editor.dragHandle).toBeDefined();
      expect(toolbar?.classList.contains('pointer-events-none')).toBe(false);
      expect(contentEl?.getAttribute('contenteditable')).toBe('true');

      editor.destroy();
    });

    it('dynamically synchronizes minHeight without remounting', () => {
      const editor = new MarkonEditor({
        element: container,
        minHeight: '200px',
      });

      const contentEl = container.querySelector<HTMLElement>('.editor-content');
      expect(contentEl?.style.minHeight).toBe('200px');

      editor.setMinHeight('450px');
      expect(contentEl?.style.minHeight).toBe('450px');

      editor.destroy();
    });

    it('preserves cursor position on controlled content sync', () => {
      const editor = new MarkonEditor({
        element: container,
        initialValue: '<p>Original text for testing cursor stability</p>',
      });

      // Place cursor at position 8
      editor.tiptap.commands.setTextSelection(8);
      expect(editor.tiptap.state.selection.from).toBe(8);

      // Update content with preserveCursor = true
      editor.setContent(
        '<p>Original text for testing cursor stability updated</p>',
        false,
        true
      );
      expect(editor.tiptap.state.selection.from).toBe(8);

      editor.destroy();
    });

    it('dispatches markon:change custom event on programmatic setContent', () => {
      const editor = new MarkonEditor({
        element: container,
        initialValue: '<p>Initial</p>',
      });

      let eventFired = false;
      let eventText = '';

      container.addEventListener('markon:change', (e: Event) => {
        eventFired = true;
        eventText = (e as CustomEvent).detail.text;
      });

      editor.setContent('<p>Programmatic update</p>');
      expect(eventFired).toBe(true);
      expect(eventText).toBe('Programmatic update');

      editor.destroy();
    });

    it('converts HTML to Markdown and Markdown to HTML accurately', () => {
      const md =
        '# Heading 1\n\n**Bold text** and *italic text*\n\n> Blockquote\n\n```typescript\nconst x = 1;\n```';
      const html = markdownToHtml(md);
      expect(html).toContain('<h1>Heading 1</h1>');
      expect(html).toContain('<strong>Bold text</strong>');
      expect(html).toContain('<em>italic text</em>');
      expect(html).toContain('<blockquote><p>Blockquote</p></blockquote>');
      expect(html).toContain('language-typescript');

      const convertedMd = htmlToMarkdown(html);
      expect(convertedMd).toContain('# Heading 1');
      expect(convertedMd).toContain('**Bold text**');
      expect(convertedMd).toContain('*italic text*');
      expect(convertedMd).toContain('> Blockquote');
      expect(convertedMd).toContain('```typescript');
    });

    it('sets and retrieves content in Markdown format', () => {
      const editor = new MarkonEditor({
        element: container,
      });

      editor.setMarkdown('## Secondary Title\n\nThis is a test paragraph.');
      expect(editor.getHTML()).toContain('<h2>Secondary Title</h2>');
      expect(editor.getHTML()).toContain('<p>This is a test paragraph.</p>');

      const md = editor.getMarkdown();
      expect(md).toContain('## Secondary Title');
      expect(md).toContain('This is a test paragraph.');

      editor.destroy();
    });

    it('manages auto-save drafts, recovery, and UI save states', async () => {
      const storageKey = 'markon_draft_test_spec';
      window.localStorage.removeItem(storageKey);

      const onSaveMock = vi.fn();

      const editor = new MarkonEditor({
        element: container,
        name: 'test_spec',
        autoSave: {
          key: storageKey,
          debounceMs: 50,
          onSave: onSaveMock,
        },
      });

      expect(editor.draftManager).toBeDefined();

      // Trigger update and immediate save
      editor.setContent('<p>Draft content to persist</p>');
      await editor.saveDraft();

      expect(onSaveMock).toHaveBeenCalled();
      expect(window.localStorage.getItem(storageKey)).toContain(
        'Draft content to persist'
      );
      expect(editor.getSavedDraft()).toContain('Draft content to persist');

      // Test save status indicator
      editor.setSaveStatus('saving');
      const dot = container.querySelector('.editor-save-indicator');
      const text = container.querySelector('.editor-save-text');
      expect(dot?.classList.contains('bg-warning')).toBe(true);
      expect(text?.textContent).toBe('Saving…');

      editor.setSaveStatus('saved', 'Saved at 12:00:00');
      expect(dot?.classList.contains('bg-primary')).toBe(true);
      expect(text?.textContent).toBe('Saved at 12:00:00');

      editor.setSaveStatus('error');
      expect(dot?.classList.contains('bg-danger')).toBe(true);
      expect(text?.textContent).toBe('Save failed');

      editor.destroy();

      // Test draft recovery on new editor initialization
      const recoveredEditor = new MarkonEditor({
        element: container,
        name: 'test_spec',
        autoSave: {
          key: storageKey,
        },
      });

      expect(recoveredEditor.getHTML()).toContain('Draft content to persist');

      recoveredEditor.clearDraft();
      expect(window.localStorage.getItem(storageKey)).toBeNull();

      recoveredEditor.destroy();
    });

    it('preserves cursor position on programmatic setContent when preserveCursor is enabled', () => {
      const editor = new MarkonEditor({
        element: container,
        initialValue: '<p>Initial test content</p>',
      });

      // Position cursor at offset 7
      editor.tiptap.commands.setTextSelection({ from: 7, to: 7 });
      expect(editor.tiptap.state.selection.from).toBe(7);

      // Perform non-destructive update with preserveCursor
      editor.setContent('<p>Initial test content updated</p>', false, true);

      // Verify cursor is still at offset 7
      expect(editor.tiptap.state.selection.from).toBe(7);

      editor.destroy();
    });

    it('ensures image nodeview updates attributes sequentially without stale closure regressions', () => {
      const editor = new MarkonEditor({
        element: container,
      });

      editor.tiptap.commands.setImage({
        src: 'https://example.com/test.jpg',
        alignment: 'center',
        width: '100%',
      } as any);

      // Verify initial attributes
      expect(editor.getHTML()).toContain('data-alignment="center"');

      // Select image node (at pos 0)
      editor.tiptap.commands.setNodeSelection(0);
      expect(editor.tiptap.isActive('image')).toBe(true);

      // Update alignment to left
      editor.tiptap.commands.updateAttributes('image', { alignment: 'left' });
      expect(editor.getHTML()).toContain('data-alignment="left"');

      // Update width to 50% - alignment must REMAIN left, not snap back to center
      editor.tiptap.commands.updateAttributes('image', { width: '50%' });
      const html = editor.getHTML();
      expect(html).toContain('data-alignment="left"');
      expect(html).toContain('width: 50%');

      editor.destroy();
    });

    it('ensures codeblock nodeview dynamically copies live code and updates language', () => {
      const editor = new MarkonEditor({
        element: container,
        initialValue: '<p>Code:</p>',
      });

      editor.tiptap.commands.setCodeBlock({ language: 'javascript' });
      expect(editor.tiptap.isActive('codeBlock')).toBe(true);

      const codeBlockEl = container.querySelector('.markon-code-block');
      expect(codeBlockEl).toBeTruthy();

      const select = codeBlockEl?.querySelector('select') as HTMLSelectElement;
      expect(select.value).toBe('javascript');

      // Update language via TipTap
      editor.tiptap.commands.updateAttributes('codeBlock', {
        language: 'typescript',
      });
      expect(select.value).toBe('typescript');

      editor.destroy();
    });

    it('ensures mathBlock updates data-equation attribute on equation edits', () => {
      const editor = new MarkonEditor({
        element: container,
      });

      editor.execCommand('insertMath', 'E = mc^2');
      expect(editor.getHTML()).toContain('data-equation="E = mc^2"');

      editor.tiptap.commands.setNodeSelection(0);
      expect(editor.tiptap.isActive('mathBlock')).toBe(true);

      editor.tiptap.commands.updateAttributes('mathBlock', {
        equation: 'a^2 + b^2 = c^2',
      });
      expect(editor.getHTML()).toContain('data-equation="a^2 + b^2 = c^2"');

      const mathEl = container.querySelector('.markon-math-block');
      expect(mathEl?.getAttribute('data-equation')).toBe('a^2 + b^2 = c^2');

      editor.destroy();
    });

    it('ensures fileAttachment nodeview updates data attributes on node changes', () => {
      const editor = new MarkonEditor({
        element: container,
      });

      editor.tiptap.commands.insertFileAttachment({
        src: 'https://example.com/file1.pdf',
        name: 'file1.pdf',
        size: '1.0 MB',
      });

      const fileEl = container.querySelector('.markon-file-attachment');
      expect(fileEl?.getAttribute('data-name')).toBe('file1.pdf');

      editor.tiptap.commands.setNodeSelection(0);
      expect(editor.tiptap.isActive('fileAttachment')).toBe(true);

      editor.tiptap.commands.updateAttributes('fileAttachment', {
        name: 'file2.pdf',
        size: '2.0 MB',
      });

      expect(fileEl?.getAttribute('data-name')).toBe('file2.pdf');
      expect(fileEl?.getAttribute('data-size')).toBe('2.0 MB');

      editor.destroy();
    });
  });

  describe('MarkonEditor React Component', () => {
    it('provides non-null live editor instance on ref.current.editor', async () => {
      const { createRoot } = await import('react-dom/client');
      const React = await import('react');
      const { MarkonEditor: ReactMarkonEditor } = await import('./react');

      const testDiv = document.createElement('div');
      document.body.appendChild(testDiv);
      const root = createRoot(testDiv);

      const ref = React.createRef<any>();

      await new Promise<void>((resolve) => {
        root.render(
          React.createElement(ReactMarkonEditor, {
            ref,
            initialValue: '<p>React Editor Test</p>',
          })
        );
        setTimeout(resolve, 100);
      });

      expect(ref.current).toBeTruthy();
      expect(ref.current.editor).not.toBeNull();
      expect(ref.current.editor.getText()).toContain('React Editor Test');

      root.unmount();
      document.body.removeChild(testDiv);
    });
  });
});
