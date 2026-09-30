import { type AnyExtension, mergeAttributes, Node } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CharacterCount from '@tiptap/extension-character-count';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import FontFamily from '@tiptap/extension-font-family';
import { FontSize } from './fontSize';
import Image from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import katex from 'katex';
import { openMarkonModal } from './dialog';

export const lowlight = createLowlight(common);

export const MathBlock = Node.create({
  name: 'mathBlock',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      equation: {
        default: 'E = mc^2',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-math-block]',
        getAttrs: (element) => {
          if (typeof element === 'string') return {};
          return {
            equation:
              element.getAttribute('data-equation') ||
              element.textContent ||
              'E = mc^2',
          };
        },
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(
        {
          'data-math-block': '',
          'data-equation': node.attrs.equation,
          class:
            'markon-math-block my-3 p-3 rounded-lg border border-default bg-subtle/50 text-center select-none cursor-pointer hover:border-primary/50 transition-colors',
        },
        HTMLAttributes
      ),
      node.attrs.equation,
    ];
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const dom = document.createElement('div');
      dom.className =
        'markon-math-block my-3 p-3 rounded-lg border border-default bg-subtle/50 text-center select-none cursor-pointer hover:border-primary/50 transition-colors';
      dom.setAttribute('data-math-block', '');
      dom.setAttribute('data-equation', node.attrs.equation);
      dom.setAttribute('title', 'Click to edit formula');

      const render = (eq: string) => {
        try {
          dom.innerHTML = katex.renderToString(eq, {
            throwOnError: false,
            displayMode: true,
          });
        } catch {
          dom.textContent = eq;
        }
      };

      render(node.attrs.equation);

      if (editor.isEditable) {
        dom.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const current = node.attrs.equation;
          openMarkonModal({
            title: 'Edit Math Formula (LaTeX)',
            label: 'LaTeX Equation',
            initialValue: current,
            placeholder: 'e.g. \\int_{0}^{\\infty} x^2 dx',
            confirmText: 'Update Formula',
            onConfirm: (next) => {
              if (
                typeof next === 'string' &&
                next !== current &&
                typeof getPos === 'function'
              ) {
                const pos = getPos();
                if (typeof pos === 'number') {
                  editor.view.dispatch(
                    editor.view.state.tr.setNodeMarkup(pos, undefined, {
                      equation: next,
                    })
                  );
                }
              }
              editor.commands.focus();
            },
            onCancel: () => {
              editor.commands.focus();
            },
          });
        });
      }

      return {
        dom,
        update: (updatedNode) => {
          if (updatedNode.type.name !== 'mathBlock') return false;
          render(updatedNode.attrs.equation);
          return true;
        },
      };
    };
  },
});

export function getMarkonExtensions(placeholder?: string): AnyExtension[] {
  return [
    StarterKit.configure({
      heading: { levels: [1, 2, 3] },
      codeBlock: false,
      link: false,
      underline: false,
    }),
    Placeholder.configure({
      placeholder:
        placeholder || 'Write something amazing… (type / for commands)',
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: { class: 'link' },
    }),
    Underline,
    TextStyle,
    Color,
    FontSize,
    FontFamily,
    Highlight.configure({ multicolor: true }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    TaskList.configure({
      HTMLAttributes: { class: 'task-list list-none p-0 my-2 space-y-1' },
    }),
    TaskItem.configure({
      nested: true,
      HTMLAttributes: { class: 'task-item flex items-center gap-2' },
    }),
    CharacterCount,
    Table.configure({
      resizable: true,
      HTMLAttributes: {
        class:
          'table border border-default w-full my-3 rounded-lg overflow-hidden text-sm',
      },
    }),
    TableRow,
    TableHeader.configure({
      HTMLAttributes: {
        class: 'border border-default p-2 text-left bg-subtle font-semibold',
      },
    }),
    TableCell.configure({
      HTMLAttributes: { class: 'border border-default p-2' },
    }),
    CodeBlockLowlight.configure({
      lowlight,
      HTMLAttributes: {
        class:
          'rounded-lg p-3 my-2 font-mono text-xs overflow-x-auto bg-subtle border border-default text-default',
      },
    }),
    MathBlock,
    Subscript,
    Superscript,
    Image.configure({
      inline: true,
      HTMLAttributes: { class: 'rounded-lg max-w-full my-2' },
    }),
  ];
}
