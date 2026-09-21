import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MarkonEditor, renderMarkonEditor, getCounts } from './index';

describe('@nofinite/markon', () => {
  it('calculates word and character counts accurately', () => {
    const text = 'Hello world from Markon 2.0';
    const counts = getCounts(text);
    expect(counts.words).toBe(5);
    expect(counts.characters).toBe(27);
  });

  it('renders static editor HTML with all controls', () => {
    const html = renderMarkonEditor({
      placeholder: 'Test placeholder',
      initialValue: '<p>Initial test content</p>',
    });

    expect(html).toContain('markon-editor');
    expect(html).toContain('editor-toolbar');
    expect(html).toContain('data-command="bold"');
    expect(html).toContain('data-command="italic"');
    expect(html).toContain('Initial test content');
    expect(html).toContain('editor-footer');
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

    it('instantiates and manages rich text content', () => {
      const editor = new MarkonEditor({
        element: container,
        initialValue: '<p>Hello Markon</p>',
      });

      expect(editor.getText()).toContain('Hello Markon');
      expect(editor.getHTML()).toContain('<p>Hello Markon</p>');

      editor.setContent('<p>Updated Content</p>');
      expect(editor.getHTML()).toContain('<p>Updated Content</p>');

      editor.destroy();
    });
  });
});
