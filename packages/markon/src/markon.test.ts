// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  MarkonEditor,
  renderMarkonEditor,
  getCounts,
  parseVideoUrl,
  formatFileSize,
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
  });
});
