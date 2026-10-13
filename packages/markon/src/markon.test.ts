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
  MarkonRenderer,
  renderMarkon,
  extractTOC,
  calculateReadingTime,
  MarkonColorPicker,
  HIGHLIGHT_PRESETS,
  TEXT_COLOR_PRESETS,
  hslToHex,
  CALLOUT_ICONS,
  CALLOUT_THEMES,
  formatDisplayUrl,
  renderLinkPopoverHtml,
  UploadPlaceholder,
  MarkonDragHandle,
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

      // Static toolbar no longer contains cluttered table tools text buttons
      expect(container.querySelector('.editor-table-tools')).toBeNull();

      // Test table row and column commands via execCommand
      editor.execCommand('addRowAfter');
      editor.execCommand('addColumnAfter');
      expect(editor.tiptap.isActive('table')).toBe(true);
      expect(editor.getHTML()).toContain('<table');

      // Test delete table
      editor.execCommand('deleteTable');
      expect(editor.tiptap.isActive('table')).toBe(false);
      expect(editor.getHTML()).not.toContain('<table');

      editor.destroy();
    });

    it('renders contextual table bubble menu with all row, column, header, and cell operations', () => {
      const editor = new MarkonEditor({
        element: container,
        initialValue:
          '<table><tbody><tr><td><p>Cell 1</p></td><td><p>Cell 2</p></td></tr></tbody></table>',
      });

      // Focus editor inside table cell
      editor.tiptap.commands.focus();
      editor.tiptap.commands.setTextSelection(3);

      // In JSDOM, mock hasFocus
      vi.spyOn(editor.tiptap.view, 'hasFocus').mockReturnValue(true);

      // Dispatch view update
      editor.tiptap.view.dispatch(editor.tiptap.state.tr);

      const bubbleMenu = document.querySelector('.markon-bubble-menu');
      expect(bubbleMenu).toBeTruthy();

      // Check all 11 operations exist
      const rowAbove = bubbleMenu?.querySelector(
        '[data-table-cmd="addRowBefore"]'
      );
      const rowBelow = bubbleMenu?.querySelector(
        '[data-table-cmd="addRowAfter"]'
      );
      const delRow = bubbleMenu?.querySelector('[data-table-cmd="deleteRow"]');
      const colLeft = bubbleMenu?.querySelector(
        '[data-table-cmd="addColumnBefore"]'
      );
      const colRight = bubbleMenu?.querySelector(
        '[data-table-cmd="addColumnAfter"]'
      );
      const delCol = bubbleMenu?.querySelector(
        '[data-table-cmd="deleteColumn"]'
      );
      const toggleHeaderRow = bubbleMenu?.querySelector(
        '[data-table-cmd="toggleHeaderRow"]'
      );
      const toggleHeaderCol = bubbleMenu?.querySelector(
        '[data-table-cmd="toggleHeaderColumn"]'
      );
      const merge = bubbleMenu?.querySelector('[data-table-cmd="mergeCells"]');
      const split = bubbleMenu?.querySelector('[data-table-cmd="splitCell"]');
      const delTable = bubbleMenu?.querySelector(
        '[data-table-cmd="deleteTable"]'
      );

      expect(rowAbove).toBeTruthy();
      expect(rowBelow).toBeTruthy();
      expect(delRow).toBeTruthy();
      expect(colLeft).toBeTruthy();
      expect(colRight).toBeTruthy();
      expect(delCol).toBeTruthy();
      expect(toggleHeaderRow).toBeTruthy();
      expect(toggleHeaderCol).toBeTruthy();
      expect(merge).toBeTruthy();
      expect(split).toBeTruthy();
      expect(delTable).toBeTruthy();

      // Single cell without multi-selection cannot merge
      expect(merge?.hasAttribute('disabled')).toBe(true);

      // Click add row below via mousedown
      rowBelow?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      expect(editor.getHTML()).toContain('<tr>');

      // Click delete table
      delTable?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      expect(editor.tiptap.isActive('table')).toBe(false);
      expect(editor.getHTML()).not.toContain('<table');

      editor.destroy();
    });

    it('handles Tab and Shift-Tab indentation inside code blocks', () => {
      const editor = new MarkonEditor({
        element: container,
        initialValue: '<pre><code>const x = 10;</code></pre>',
      });

      // Place cursor at the start of code block content
      editor.tiptap.commands.focus();
      editor.tiptap.commands.setTextSelection(1);
      expect(editor.tiptap.isActive('codeBlock')).toBe(true);

      // Trigger Tab keyboard shortcut via ProseMirror handleKeyDown
      const tabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
        cancelable: true,
      });
      const handledTab = editor.tiptap.view.someProp('handleKeyDown', (fn) =>
        fn(editor.tiptap.view, tabEvent)
      );
      expect(handledTab).toBe(true);
      expect(editor.getText()).toContain('  const x = 10;');

      // Trigger Shift-Tab keyboard shortcut to unindent
      const shiftTabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      });
      const handledShiftTab = editor.tiptap.view.someProp(
        'handleKeyDown',
        (fn) => fn(editor.tiptap.view, shiftTabEvent)
      );
      expect(handledShiftTab).toBe(true);
      expect(editor.getText()).toContain('const x = 10;');

      editor.destroy();
    });

    it('renders interactive link popover with open, copy, edit, and unlink actions', () => {
      const editor = new MarkonEditor({
        element: container,
        initialValue:
          '<p>Visit <a href="https://nofinite.com">Nofinite</a> platform.</p>',
      });

      // Focus caret inside the link text (collapsed selection)
      editor.tiptap.commands.focus();
      editor.tiptap.commands.setTextSelection(9);
      expect(editor.tiptap.isActive('link')).toBe(true);
      expect(editor.tiptap.state.selection.empty).toBe(true);

      // Mock hasFocus in JSDOM
      vi.spyOn(editor.tiptap.view, 'hasFocus').mockReturnValue(true);
      editor.tiptap.view.dispatch(editor.tiptap.state.tr);

      const bubbleMenu = document.querySelector('.markon-bubble-menu');
      expect(bubbleMenu).toBeTruthy();

      // Check link popover elements
      const linkAnchor = bubbleMenu?.querySelector('a.link');
      expect(linkAnchor).toBeTruthy();
      expect(linkAnchor?.getAttribute('href')).toBe('https://nofinite.com');
      expect(linkAnchor?.getAttribute('target')).toBe('_blank');

      const copyBtn = bubbleMenu?.querySelector('[data-link-action="copy"]');
      const editBtn = bubbleMenu?.querySelector('[data-link-action="edit"]');
      const unlinkBtn = bubbleMenu?.querySelector(
        '[data-link-action="unlink"]'
      );

      expect(copyBtn).toBeTruthy();
      expect(editBtn).toBeTruthy();
      expect(unlinkBtn).toBeTruthy();

      // Click unlink button
      unlinkBtn?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      expect(editor.tiptap.isActive('link')).toBe(false);
      expect(editor.getHTML()).not.toContain('<a href=');

      editor.destroy();
    });

    it('formats display URLs and renders standalone link popover markup correctly', () => {
      expect(formatDisplayUrl('https://nofinite.com/docs/')).toBe(
        'nofinite.com/docs'
      );
      expect(formatDisplayUrl('http://github.com/')).toBe('github.com');
      expect(formatDisplayUrl('')).toBe('');

      const html = renderLinkPopoverHtml('https://example.com/test');
      expect(html).toContain('href="https://example.com/test"');
      expect(html).toContain('target="_blank"');
      expect(html).toContain('data-link-action="copy"');
      expect(html).toContain('data-link-action="edit"');
      expect(html).toContain('data-link-action="unlink"');
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

    it('handles highlight, subscript, and superscript round-trip lossless conversion', () => {
      const md =
        'This has ==highlighted text==, chemical H~2~O, mathematical E=mc^2^, and ~~deleted text~~.';
      const html = markdownToHtml(md);
      expect(html).toContain('<mark>highlighted text</mark>');
      expect(html).toContain('<sub>2</sub>');
      expect(html).toContain('<sup>2</sup>');
      expect(html).toContain('<s>deleted text</s>');

      const backToMd = htmlToMarkdown(html);
      expect(backToMd).toContain('==highlighted text==');
      expect(backToMd).toContain('~2~');
      expect(backToMd).toContain('^2^');
      expect(backToMd).toContain('~~deleted text~~');
    });

    it('preserves rich inline formatting inside markdown table cells', () => {
      const html = `
        <table>
          <thead>
            <tr><th>**Bold Header**</th><th>*Italic Header*</th></tr>
          </thead>
          <tbody>
            <tr><td>==Highlighted Cell==</td><td>Cell with ~sub~ and ^sup^</td></tr>
          </tbody>
        </table>
      `;
      const md = htmlToMarkdown(html);
      expect(md).toContain('| **Bold Header** | *Italic Header* |');
      expect(md).toContain('==Highlighted Cell==');
      expect(md).toContain('~sub~');
      expect(md).toContain('^sup^');

      const convertedHtml = markdownToHtml(md);
      expect(convertedHtml).toContain('<mark>Highlighted Cell</mark>');
      expect(convertedHtml).toContain('<sub>sub</sub>');
      expect(convertedHtml).toContain('<sup>sup</sup>');
    });

    it('converts multi-paragraph GitHub callouts to semantic HTML and back to markdown', () => {
      const md = '> [!NOTE]\n> First alert line.\n>\n> Second paragraph line.';
      const html = markdownToHtml(md);
      expect(html).toContain('data-callout=""');
      expect(html).toContain('data-callout-type="info"');
      expect(html).toContain('<p>First alert line.</p>');
      expect(html).toContain('<p>Second paragraph line.</p>');

      const backToMd = htmlToMarkdown(html);
      expect(backToMd).toContain('> [!NOTE]');
      expect(backToMd).toContain('First alert line.');
      expect(backToMd).toContain('Second paragraph line.');
    });

    it('handles single-line and multi-line LaTeX math blocks cleanly', () => {
      // Single-line math
      const singleLine = '$$a^2 + b^2 = c^2$$';
      const singleHtml = markdownToHtml(singleLine);
      expect(singleHtml).toContain('data-math-block=""');
      expect(singleHtml).toContain('data-equation="a^2 + b^2 = c^2"');

      // Multi-line math
      const multiLine = '$$\n\\int_{0}^{\\infty} e^{-x^2} dx\n$$';
      const multiHtml = markdownToHtml(multiLine);
      expect(multiHtml).toContain('data-math-block=""');
      expect(multiHtml).toContain(
        'data-equation="\\int_{0}^{\\infty} e^{-x^2} dx"'
      );

      const backToMd = htmlToMarkdown(multiHtml);
      expect(backToMd).toContain('$$\n\\int_{0}^{\\infty} e^{-x^2} dx\n$$');
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

    it('synchronizes details nodeview open state to TipTap node attributes on toggle event', () => {
      const editor = new MarkonEditor({
        element: container,
        initialValue: '',
      });

      editor.execCommand('insertDetails');
      const detailsEl = container.querySelector<HTMLDetailsElement>(
        'details.markon-details'
      );
      expect(detailsEl).toBeTruthy();
      expect(detailsEl?.open).toBe(true);

      // Simulate native details toggle to closed
      if (detailsEl) {
        detailsEl.open = false;
        detailsEl.dispatchEvent(new Event('toggle'));
      }

      const json = editor.tiptap.getJSON();
      const detailsNode = json.content?.find((n) => n.type === 'details');
      expect(detailsNode?.attrs?.open).toBe(false);

      editor.destroy();
    });

    it('ensures table menu attaches dropdown-menu superclass and cleans up safely', () => {
      const editor = new MarkonEditor({
        element: container,
        initialValue: '<p>Table menu test</p>',
      });

      const tableTrigger = container.querySelector<HTMLButtonElement>(
        '.editor-table-trigger'
      );
      expect(tableTrigger).toBeTruthy();

      tableTrigger?.click();
      const menu = document.querySelector<HTMLElement>('.markon-table-menu');
      expect(menu).toBeTruthy();
      expect(menu?.classList.contains('dropdown-menu')).toBe(true);
      expect(menu?.getAttribute('data-state')).toBe('open');

      // Close menu
      tableTrigger?.click();
      expect(document.querySelector('.markon-table-menu')).toBeNull();

      editor.destroy();
    });

    it('inserts and manages callout with NUICSS alert superclasses and updates type', () => {
      const editor = new MarkonEditor({
        element: container,
        initialValue: '',
      });

      editor.execCommand('insertCallout', { type: 'warning' });
      const calloutEl = container.querySelector<HTMLElement>('.markon-callout');
      expect(calloutEl).toBeTruthy();
      expect(calloutEl?.classList.contains('alert')).toBe(true);
      expect(calloutEl?.classList.contains('alert-warning')).toBe(true);
      expect(calloutEl?.getAttribute('data-callout-type')).toBe('warning');

      // Update callout type to danger
      editor.tiptap.commands.setCalloutType('danger');
      expect(calloutEl?.classList.contains('alert-danger')).toBe(true);
      expect(calloutEl?.classList.contains('alert-warning')).toBe(false);
      expect(calloutEl?.getAttribute('data-callout-type')).toBe('danger');

      editor.destroy();
    });

    it('converts GitHub alert markdown syntax to and from callout HTML', () => {
      const markdown = '> [!WARNING]\n> This is a critical security advisory.';
      const html = markdownToHtml(markdown);
      expect(html).toContain('markon-callout');
      expect(html).toContain('alert-warning');
      expect(html).toContain('data-callout-type="warning"');
      expect(html).toContain('This is a critical security advisory.');

      const convertedMd = htmlToMarkdown(html);
      expect(convertedMd).toContain('> [!WARNING]');
      expect(convertedMd).toContain('This is a critical security advisory.');
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

    it('renders publication-grade document and hydrates interactivity via <MarkonRender />', async () => {
      const { createRoot } = await import('react-dom/client');
      const React = await import('react');
      const { MarkonRender: ReactMarkonRender } = await import('./react');

      const testDiv = document.createElement('div');
      document.body.appendChild(testDiv);
      const root = createRoot(testDiv);

      let renderedResult: any = null;

      const doc = {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Section Alpha' }],
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Testing the React publication renderer wrapper.',
              },
            ],
          },
          {
            type: 'codeBlock',
            attrs: { language: 'typescript' },
            content: [{ type: 'text', text: 'const answer = 42;' }],
          },
        ],
      };

      await new Promise<void>((resolve) => {
        root.render(
          React.createElement(ReactMarkonRender, {
            content: doc,
            layout: 'article',
            metadata: {
              title: 'React Publication Article',
              author: 'Elena Vance',
              publishedAt: '2026-10-01',
              tags: ['React', 'Publication'],
            },
            onRendered: (res) => {
              renderedResult = res;
            },
          })
        );
        setTimeout(resolve, 250);
      });

      // Verify DOM content
      expect(testDiv.innerHTML).toContain('React Publication Article');
      expect(testDiv.innerHTML).toContain('Elena Vance');
      expect(testDiv.innerHTML).toContain('Section Alpha');
      expect(testDiv.innerHTML).toContain('markon-toc-aside');
      expect(testDiv.innerHTML).toContain('markon-code-block');

      // Verify onRendered callback
      expect(renderedResult).not.toBeNull();
      expect(renderedResult.toc.length).toBe(1);
      expect(renderedResult.toc[0].text).toBe('Section Alpha');
      expect(renderedResult.readingTimeMinutes).toBeGreaterThanOrEqual(1);

      root.unmount();
      document.body.removeChild(testDiv);
    });
  });

  describe('Universal MarkonRenderer Core', () => {
    it('renders TipTap JSONContent into semantic HTML with syntax highlighting and NUICSS tokens', () => {
      const jsonDoc = {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'Architecture Overview' }],
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Welcome to ' },
              {
                type: 'text',
                text: 'Markon 2.0',
                marks: [{ type: 'bold' }],
              },
              { type: 'text', text: ', the next-gen editor engine.' },
            ],
          },
          {
            type: 'codeBlock',
            attrs: { language: 'typescript' },
            content: [{ type: 'text', text: 'const answer: number = 42;' }],
          },
          {
            type: 'callout',
            attrs: { type: 'warning' },
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'Strict upstream fix rule: Zero downstream monkey-patching.',
                  },
                ],
              },
            ],
          },
          {
            type: 'mathBlock',
            attrs: { equation: 'E = mc^2' },
          },
          {
            type: 'table',
            content: [
              {
                type: 'tableRow',
                content: [
                  {
                    type: 'tableHeader',
                    content: [
                      {
                        type: 'paragraph',
                        content: [{ type: 'text', text: 'Package' }],
                      },
                    ],
                  },
                  {
                    type: 'tableHeader',
                    content: [
                      {
                        type: 'paragraph',
                        content: [{ type: 'text', text: 'Role' }],
                      },
                    ],
                  },
                ],
              },
              {
                type: 'tableRow',
                content: [
                  {
                    type: 'tableCell',
                    content: [
                      {
                        type: 'paragraph',
                        content: [{ type: 'text', text: '@nofinite/nuicss' }],
                      },
                    ],
                  },
                  {
                    type: 'tableCell',
                    content: [
                      {
                        type: 'paragraph',
                        content: [
                          { type: 'text', text: 'Single source of truth' },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const result = renderMarkon({
        content: jsonDoc,
        layout: 'minimal',
      });

      expect(result.html).toContain('id="architecture-overview"');
      expect(result.html).toContain('Architecture Overview');
      expect(result.html).toContain('<strong>Markon 2.0</strong>');
      // Lowlight highlighted code block
      expect(result.html).toContain('markon-code-block');
      expect(result.html).toContain('data-code="const answer: number = 42;"');
      expect(result.html).toContain('hljs-keyword');
      // Callout alert
      expect(result.html).toContain('markon-callout alert alert-warning');
      expect(result.html).toContain(
        'Strict upstream fix rule: Zero downstream monkey-patching.'
      );
      // Pre-rendered Katex formula
      expect(result.html).toContain('markon-math-block');
      expect(result.html).toContain('katex');
      // Table container
      expect(result.html).toContain('table-container');
      expect(result.html).toContain('@nofinite/nuicss');

      // TOC extraction
      expect(result.toc.length).toBe(1);
      expect(result.toc[0]).toEqual({
        id: 'architecture-overview',
        text: 'Architecture Overview',
        level: 1,
      });
    });

    it('renders publication-grade Article layout with hero cover, author byline, reading time, and sticky TOC', () => {
      const doc = {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'Design Tokens in Practice' }],
          },
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'OKLCH Colors' }],
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Perceptually uniform color palettes guarantee consistent contrast across light and dark modes.',
              },
            ],
          },
        ],
      };

      const result = renderMarkon({
        content: doc,
        layout: 'article',
        metadata: {
          title: 'Mastering Modern Design Tokens',
          subtitle: 'A deep dive into OKLCH and semantic color engineering',
          category: 'ENGINEERING',
          cover: {
            src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
            alt: 'Abstract 3D Fluid Design',
            caption: 'Design system tokens rendered in real-time',
          },
          author: {
            name: 'Alex Rivera',
            title: 'Staff UI Architect',
            url: 'https://github.com/alexrivera',
          },
          publishedAt: '2026-10-01',
          tags: ['Design Systems', 'OKLCH', 'Architecture'],
        },
      });

      // Article layout markers
      expect(result.html).toContain('markon-article');
      expect(result.html).toContain('Mastering Modern Design Tokens');
      expect(result.html).toContain(
        'A deep dive into OKLCH and semantic color'
      );
      expect(result.html).toContain('ENGINEERING');
      expect(result.html).toContain('Alex Rivera');
      expect(result.html).toContain('Staff UI Architect');
      expect(result.html).toContain('https://github.com/alexrivera');
      expect(result.html).toContain('markon-hero-cover');
      expect(result.html).toContain(
        'Design system tokens rendered in real-time'
      );
      // Sticky TOC
      expect(result.html).toContain('markon-toc-aside');
      expect(result.html).toContain('href="#design-tokens-in-practice"');
      expect(result.html).toContain('href="#oklch-colors"');
      // Tags
      expect(result.html).toContain('markon-tags');
      expect(result.html).toContain('Design Systems');
      expect(result.html).toContain('OKLCH');
      // Reading time
      expect(result.readingTimeMinutes).toBeGreaterThanOrEqual(1);
    });

    it('renders Document and Newsroom layouts correctly', () => {
      const doc = {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'API Reference' }],
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Detailed documentation.' }],
          },
        ],
      };

      // Document layout
      const docResult = renderMarkon({
        content: doc,
        layout: 'document',
        metadata: {
          title: 'Markon Core API',
          category: 'SDK Reference',
          publishedAt: '2026-10-01',
        },
      });
      expect(docResult.html).toContain('markon-document');
      expect(docResult.html).toContain('SDK Reference');
      expect(docResult.html).toContain('Markon Core API');
      expect(docResult.html).toContain('markon-doc-header');

      // Newsroom layout
      const newsResult = renderMarkon({
        content: doc,
        layout: 'newsroom',
        metadata: {
          title: 'Nofinite Launches Markon 2.0',
          author: 'Press Office',
          publishedAt: '2026-10-01',
          badge: 'PRESS RELEASE',
        },
      });
      expect(newsResult.html).toContain('markon-newsroom');
      expect(newsResult.html).toContain('PRESS RELEASE');
      expect(newsResult.html).toContain('Nofinite Launches Markon 2.0');
      expect(newsResult.html).toContain('By Press Office');
    });

    it('extracts Table of Contents accurately from JSON, HTML, and Markdown', () => {
      // From JSON
      const jsonDoc = {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'Intro' }],
          },
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Getting Started' }],
          },
        ],
      };
      const jsonToc = extractTOC(jsonDoc);
      expect(jsonToc).toEqual([
        { id: 'intro', text: 'Intro', level: 1 },
        { id: 'getting-started', text: 'Getting Started', level: 2 },
      ]);

      // From HTML
      const html = '<h1>Intro</h1><p>text</p><h2>Getting Started</h2>';
      const htmlToc = extractTOC(html);
      expect(htmlToc).toEqual([
        { id: 'intro', text: 'Intro', level: 1 },
        { id: 'getting-started', text: 'Getting Started', level: 2 },
      ]);

      // From Markdown
      const md = '# Intro\n\nSome text\n\n## Getting Started';
      const mdToc = extractTOC(md);
      expect(mdToc).toEqual([
        { id: 'intro', text: 'Intro', level: 1 },
        { id: 'getting-started', text: 'Getting Started', level: 2 },
      ]);
    });

    it('calculates reading time and word counts', () => {
      const text = 'word '.repeat(450);
      const res = calculateReadingTime(text);
      expect(res.words).toBe(450);
      expect(res.minutes).toBe(3); // 450 / 200 = 2.25 => 3 min
    });

    it('attaches copy button listener and smooth scroll in MarkonRenderer.mount', async () => {
      const container = document.createElement('div');
      container.innerHTML = `
        <div class="markon-render">
          <a href="#section-1" class="markon-toc-link">Section 1</a>
          <button type="button" class="markon-code-copy-btn" data-code="console.log('hi');">Copy</button>
          <h2 id="section-1">Section 1</h2>
        </div>
      `;
      document.body.appendChild(container);

      // Mock navigator.clipboard
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock,
        },
      });

      const cleanup = MarkonRenderer.mount(container);

      // Trigger copy button click
      const copyBtn = container.querySelector(
        '.markon-code-copy-btn'
      ) as HTMLButtonElement;
      copyBtn.click();

      // Wait a tick for async clipboard
      await new Promise<void>((resolve) => setTimeout(resolve, 50));
      expect(writeTextMock).toHaveBeenCalledWith("console.log('hi');");
      expect(copyBtn.innerHTML).toContain('Copied!');

      cleanup();
      document.body.removeChild(container);
    });
  });

  describe('MarkonColorPicker & Color Palettes', () => {
    it('defines 12 distinct highlight presets with OKLCH pastel tokens', () => {
      expect(HIGHLIGHT_PRESETS.length).toBe(12);
      const labels = HIGHLIGHT_PRESETS.map((p) => p.label);
      expect(labels).toContain('Yellow');
      expect(labels).toContain('Amber');
      expect(labels).toContain('Coral');
      expect(labels).toContain('Rose');
      expect(labels).toContain('Lavender');
      expect(labels).toContain('Sky');
      expect(labels).toContain('Teal');
      expect(labels).toContain('Emerald');
    });

    it('defines 12 distinct text color presets', () => {
      expect(TEXT_COLOR_PRESETS.length).toBe(12);
      const labels = TEXT_COLOR_PRESETS.map((p) => p.label);
      expect(labels).toContain('Default');
      expect(labels).toContain('Muted');
      expect(labels).toContain('Brand');
      expect(labels).toContain('Blue');
      expect(labels).toContain('Green');
    });

    it('mounts MarkonColorPicker popover and handles selection, hex input, and clear', () => {
      const trigger = document.createElement('button');
      document.body.appendChild(trigger);

      const onSelect = vi.fn();
      const onClear = vi.fn();

      const picker = new MarkonColorPicker({
        mode: 'highlight',
        trigger,
        onSelect,
        onClear,
      });

      picker.open();
      expect(picker.isOpen).toBe(true);
      expect(trigger.getAttribute('aria-expanded')).toBe('true');

      const menu = document.querySelector('.markon-color-picker');
      expect(menu).not.toBeNull();
      expect(menu?.getAttribute('role')).toBe('dialog');

      // Click a swatch
      const swatches = menu?.querySelectorAll('button[title]');
      expect(swatches?.length).toBe(12);
      const firstSwatch = swatches?.[0] as HTMLButtonElement;
      firstSwatch.click();

      expect(onSelect).toHaveBeenCalledWith(HIGHLIGHT_PRESETS[0].color);
      expect(picker.isOpen).toBe(false);

      // Re-open and test clear button
      picker.open();
      const reopenedMenu = document.querySelector('.markon-color-picker');
      const clearBtn = reopenedMenu?.lastElementChild as HTMLButtonElement;
      expect(clearBtn?.textContent).toContain('Remove Highlight');
      clearBtn?.click();

      expect(onClear).toHaveBeenCalled();
      expect(picker.isOpen).toBe(false);

      picker.destroy();
      document.body.removeChild(trigger);
    });
  });

  describe('Phase 5: Optimistic Uploads, History Sync & Touch Block Actions', () => {
    let container: HTMLElement;

    beforeEach(() => {
      container = document.createElement('div');
      document.body.appendChild(container);
    });

    afterEach(() => {
      document.body.removeChild(container);
    });

    it('dynamically synchronizes Undo and Redo button disabled states', () => {
      const editor = new MarkonEditor({
        element: container,
        initialValue: '<p>Initial text</p>',
      });

      const undoBtn = container.querySelector<HTMLButtonElement>(
        'button[data-command="undo"]'
      );
      const redoBtn = container.querySelector<HTMLButtonElement>(
        'button[data-command="redo"]'
      );

      expect(undoBtn).not.toBeNull();
      expect(redoBtn).not.toBeNull();

      // Initially with no mutations, both undo and redo should be disabled
      expect(undoBtn?.disabled).toBe(true);
      expect(undoBtn?.getAttribute('aria-disabled')).toBe('true');
      expect(undoBtn?.classList.contains('opacity-40')).toBe(true);

      expect(redoBtn?.disabled).toBe(true);
      expect(redoBtn?.getAttribute('aria-disabled')).toBe('true');

      // Make a change: add new paragraph
      editor.tiptap.chain().focus().insertContent('<p>Second line</p>').run();
      editor.updateToolbarState();

      // Undo should now be enabled
      expect(undoBtn?.disabled).toBe(false);
      expect(undoBtn?.getAttribute('aria-disabled')).toBeNull();
      expect(undoBtn?.classList.contains('opacity-40')).toBe(false);

      // Execute undo command
      editor.execCommand('undo');
      editor.updateToolbarState();

      // Redo should now be enabled
      expect(redoBtn?.disabled).toBe(false);
      expect(redoBtn?.getAttribute('aria-disabled')).toBeNull();
      expect(redoBtn?.classList.contains('opacity-40')).toBe(false);

      editor.destroy();
    });

    it('optimistically inserts upload placeholder and replaces with image on upload success', async () => {
      let uploadResolve: (res: any) => void;
      const onUploadFile = vi.fn().mockImplementation(() => {
        return new Promise((resolve) => {
          uploadResolve = resolve;
        });
      });

      const editor = new MarkonEditor({
        element: container,
        initialValue: '<p>Some text</p>',
        onUploadFile,
      });

      const file = new File(['dummy-image-bytes'], 'photo.png', {
        type: 'image/png',
      });

      const uploadPromise = editor.handleUploadedFile(file);

      // Verify that upload placeholder node is immediately inserted in the doc
      const htmlBefore = editor.getHTML();
      expect(htmlBefore).toContain('data-upload-placeholder');
      expect(htmlBefore).toContain('photo.png');

      // Verify that markdown serialization ignores the temporary placeholder
      const mdBefore = editor.getMarkdown();
      expect(mdBefore).not.toContain('photo.png');

      // Now resolve the upload
      uploadResolve!({
        url: 'https://cdn.example.com/photo.png',
        name: 'photo.png',
      });
      await uploadPromise;

      // Verify atomic replacement with image node
      const htmlAfter = editor.getHTML();
      expect(htmlAfter).not.toContain('data-upload-placeholder');
      expect(htmlAfter).toContain('https://cdn.example.com/photo.png');

      editor.destroy();
    });

    it('renders error state on upload failure with dismiss capability', async () => {
      const onUploadFile = vi
        .fn()
        .mockRejectedValue(new Error('Network error 500'));

      const editor = new MarkonEditor({
        element: container,
        initialValue: '<p>Content</p>',
        onUploadFile,
      });

      const file = new File(['test-bytes'], 'document.pdf', {
        type: 'application/pdf',
      });

      await editor.handleUploadedFile(file);

      // Placeholder node should remain in error state
      const html = editor.getHTML();
      expect(html).toContain('data-upload-placeholder');
      expect(html).toContain('data-status="error"');
      expect(html).toContain('data-error-message="Network error 500"');

      editor.destroy();
    });

    it('mounts drag handle and opens contextual block actions menu on click', () => {
      const editor = new MarkonEditor({
        element: container,
        initialValue: '<h1>First Header</h1><p>Second Paragraph</p>',
      });

      const dragHandle = (editor as any).dragHandle as MarkonDragHandle;
      expect(dragHandle).toBeDefined();

      const handleEl = container.querySelector<HTMLElement>(
        '.markon-drag-handle'
      );
      expect(handleEl).not.toBeNull();

      const pEl = container.querySelector<HTMLElement>('.editor-content p');
      expect(pEl).not.toBeNull();

      // Trigger hover / touch on paragraph
      (dragHandle as any).currentBlock = pEl;
      (dragHandle as any).showHandleForBlock(pEl!);

      expect(handleEl?.style.display).toBe('flex');
      expect(handleEl?.style.opacity).toBe('1');

      // Click the handle to open block action menu
      handleEl?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      const menu = document.querySelector<HTMLElement>(
        '.markon-block-actions-menu'
      );
      expect(menu).not.toBeNull();
      expect(menu?.style.display).toBe('flex');

      // Menu contains block action buttons
      const moveUpBtn = menu?.querySelector('button[data-action="move-up"]');
      const moveDownBtn = menu?.querySelector(
        'button[data-action="move-down"]'
      );
      const dupBtn = menu?.querySelector('button[data-action="duplicate"]');
      const deleteBtn = menu?.querySelector('button[data-action="delete"]');

      expect(moveUpBtn).not.toBeNull();
      expect(moveDownBtn).not.toBeNull();
      expect(dupBtn).not.toBeNull();
      expect(deleteBtn).not.toBeNull();

      // Test duplicate block action
      dupBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      // Paragraph count should increase to 2
      const pCount = container.querySelectorAll('.editor-content p').length;
      expect(pCount).toBe(2);

      editor.destroy();
    });
  });

  describe('Phase 6: Design Token Purity, OKLCH Color Systems & Comprehensive Engine Audit', () => {
    let container: HTMLElement;

    beforeEach(() => {
      container = document.createElement('div');
      document.body.appendChild(container);
    });

    afterEach(() => {
      if (container && container.parentNode) {
        document.body.removeChild(container);
      }
    });

    it('accurately converts HSL values to standard hex strings using hslToHex', () => {
      expect(hslToHex(0, 100, 50)).toBe('#ff0000');
      expect(hslToHex(120, 100, 50)).toBe('#00ff00');
      expect(hslToHex(240, 100, 50)).toBe('#0000ff');
      expect(hslToHex(0, 0, 0)).toBe('#000000');
      expect(hslToHex(0, 0, 100)).toBe('#ffffff');
    });

    it('enforces design token purity across highlight and text color preset registries', () => {
      // Highlight presets must use semantic tokens or oklab/oklch color-mix
      HIGHLIGHT_PRESETS.forEach((preset) => {
        expect(
          preset.color.startsWith('var(--') ||
            preset.color.startsWith('color-mix(')
        ).toBe(true);
        expect(
          preset.previewBg?.startsWith('var(--') ||
            preset.previewBg?.startsWith('color-mix(')
        ).toBe(true);
      });

      // Text color presets must use semantic tokens, color-mix, or inherit
      TEXT_COLOR_PRESETS.forEach((preset) => {
        expect(
          preset.color === 'inherit' ||
            preset.color.startsWith('var(--') ||
            preset.color.startsWith('color-mix(')
        ).toBe(true);
      });
    });

    it('enforces OKLAB color-mix standards across callout themes', () => {
      const types = ['info', 'success', 'warning', 'danger'] as const;
      types.forEach((type) => {
        const theme = CALLOUT_THEMES[type];
        expect(theme).toBeDefined();
        expect(theme.border).toContain('color-mix(in oklab');
        expect(theme.bg).toContain('color-mix(in oklab');
        expect(theme.iconColor).toBe(`var(--color-${type})`);
        expect(CALLOUT_ICONS[type]).toContain('<svg');
      });
    });

    it('supports live Callout type switching and DOM attribute synchronization', () => {
      const editor = new MarkonEditor({
        element: container,
        initialValue: '',
      });

      editor.execCommand('insertCallout', { type: 'warning' });
      let html = editor.getHTML();
      expect(html).toContain('data-callout-type="warning"');
      expect(html).toContain('alert-warning');

      // Switch callout type to danger
      editor.tiptap.commands.setCalloutType('danger');
      html = editor.getHTML();
      expect(html).toContain('data-callout-type="danger"');
      expect(html).toContain('alert-danger');

      editor.destroy();
    });

    it('reorders and deletes blocks via MarkonDragHandle action APIs', () => {
      const editor = new MarkonEditor({
        element: container,
        initialValue: '<p>First Item</p><p>Second Item</p><p>Third Item</p>',
      });

      const dragHandle = (editor as any).dragHandle as MarkonDragHandle;
      expect(dragHandle).toBeDefined();

      const paragraphsEl =
        container.querySelectorAll<HTMLElement>('.editor-content p');
      expect(paragraphsEl.length).toBe(3);

      const p2 = paragraphsEl[1];
      (dragHandle as any).currentBlock = p2;
      (dragHandle as any).showHandleForBlock(p2);

      // Move Second Item UP (before First Item)
      dragHandle.moveBlock('up');
      let paragraphs = Array.from(
        container.querySelectorAll('.editor-content p')
      ).map((p) => p.textContent);
      expect(paragraphs[0]).toBe('Second Item');
      expect(paragraphs[1]).toBe('First Item');
      expect(paragraphs[2]).toBe('Third Item');

      // Move it back DOWN
      const pSecond =
        container.querySelectorAll<HTMLElement>('.editor-content p')[0];
      (dragHandle as any).currentBlock = pSecond;
      dragHandle.moveBlock('down');
      paragraphs = Array.from(
        container.querySelectorAll('.editor-content p')
      ).map((p) => p.textContent);
      expect(paragraphs[0]).toBe('First Item');
      expect(paragraphs[1]).toBe('Second Item');
      expect(paragraphs[2]).toBe('Third Item');

      // Delete block
      (dragHandle as any).currentBlock =
        container.querySelectorAll('.editor-content p')[1];
      dragHandle.deleteBlock();
      paragraphs = Array.from(
        container.querySelectorAll('.editor-content p')
      ).map((p) => p.textContent);
      expect(paragraphs.length).toBe(2);
      expect(paragraphs).not.toContain('Second Item');

      editor.destroy();
    });

    it('validates custom hex inputs and emits oklch color values on apply', () => {
      const trigger = document.createElement('button');
      document.body.appendChild(trigger);

      let selectedColor = '';
      let cleared = false;

      const picker = new MarkonColorPicker({
        mode: 'highlight',
        trigger,
        onSelect: (color) => {
          selectedColor = color;
        },
        onClear: () => {
          cleared = true;
        },
      });

      picker.open();
      expect(picker.isOpen).toBe(true);

      const menu = document.querySelector<HTMLElement>('.markon-color-picker');
      expect(menu).not.toBeNull();

      // Test custom hex input
      const hexInput = menu?.querySelector<HTMLInputElement>('input.input-xs');
      expect(hexInput).not.toBeNull();

      // Enter valid hex
      hexInput!.value = '#10b981';
      hexInput!.dispatchEvent(new Event('input', { bubbles: true }));

      const applyBtn =
        menu?.querySelector<HTMLButtonElement>('button.btn-primary');
      expect(applyBtn).not.toBeNull();

      applyBtn!.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      // Highlight mode should produce color-mix with oklch
      expect(selectedColor).toBe(
        'color-mix(in oklch, #10b981 24%, transparent)'
      );
      expect(picker.isOpen).toBe(false);

      // Re-open and test clear
      picker.open();
      const clearBtn = document.querySelector<HTMLButtonElement>(
        '.markon-color-picker button.btn-ghost'
      );
      expect(clearBtn).not.toBeNull();
      clearBtn!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(cleared).toBe(true);
      expect(picker.isOpen).toBe(false);

      picker.destroy();
      trigger.remove();
    });
  });
});
