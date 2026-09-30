// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MarkonEditor, renderMarkonEditor, getCounts } from './index';

describe('@nofinite/markon', () => {
  it('calculates word and character counts accurately', () => {
    const text = 'Hello world from Markon 2.0';
    const counts = getCounts(text);
    expect(counts.words).toBe(5);
    expect(counts.characters).toBe(27);
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
    expect(html).toContain('data-command="insertTable"');
    expect(html).toContain('data-command="insertCodeBlock"');
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

    it('inserts and manages tables', () => {
      const editor = new MarkonEditor({
        element: container,
        initialValue: '<p>Before table</p>',
      });

      editor.execCommand('insertTable');
      expect(editor.tiptap.isActive('table')).toBe(true);
      expect(editor.getHTML()).toContain('<table');

      // Table tools should now be visible
      const tableTools = container.querySelector('.editor-table-tools');
      expect(tableTools?.classList.contains('hidden')).toBe(false);

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
      expect(editor.dragHandle).toBeDefined();

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
  });
});
