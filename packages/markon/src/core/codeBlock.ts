/**
 * @nofinite/markon - Enhanced Code Block Extension
 * Framework-agnostic TipTap CodeBlock with syntax language selection dropdown,
 * copy-to-clipboard button with visual feedback, and lowlight syntax highlighting.
 * 100% styled with @nofinite/nuicss design tokens.
 */

import CodeBlockLowlight, {
  type CodeBlockLowlightOptions,
} from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';

export const lowlight = createLowlight(common);

export interface LanguageOption {
  value: string;
  label: string;
  group?: 'Web' | 'Backend & Systems' | 'Data & Config';
}

export const LANGUAGE_ALIASES: Record<string, string> = {
  ts: 'typescript',
  js: 'javascript',
  py: 'python',
  sh: 'bash',
  zsh: 'bash',
  shell: 'bash',
  yml: 'yaml',
  md: 'markdown',
  htm: 'html',
  'c++': 'cpp',
  cs: 'csharp',
  text: 'plaintext',
  txt: 'plaintext',
};

export function normalizeLanguage(lang: string | undefined | null): string {
  if (!lang) return 'plaintext';
  const clean = lang.trim().toLowerCase();
  return LANGUAGE_ALIASES[clean] || clean;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  // Web Development
  { label: 'TypeScript', value: 'typescript', group: 'Web' },
  { label: 'JavaScript', value: 'javascript', group: 'Web' },
  { label: 'HTML', value: 'html', group: 'Web' },
  { label: 'CSS', value: 'css', group: 'Web' },

  // Backend & Systems
  { label: 'Python', value: 'python', group: 'Backend & Systems' },
  { label: 'Go', value: 'go', group: 'Backend & Systems' },
  { label: 'Rust', value: 'rust', group: 'Backend & Systems' },
  { label: 'Java', value: 'java', group: 'Backend & Systems' },
  { label: 'C++', value: 'cpp', group: 'Backend & Systems' },
  { label: 'C#', value: 'csharp', group: 'Backend & Systems' },

  // Data, Shell & Config
  { label: 'SQL', value: 'sql', group: 'Data & Config' },
  { label: 'Bash', value: 'bash', group: 'Data & Config' },
  { label: 'JSON', value: 'json', group: 'Data & Config' },
  { label: 'YAML', value: 'yaml', group: 'Data & Config' },
  { label: 'Markdown', value: 'markdown', group: 'Data & Config' },
  { label: 'Plain Text', value: 'plaintext', group: 'Data & Config' },
];

export const MarkonCodeBlock =
  CodeBlockLowlight.extend<CodeBlockLowlightOptions>({
    addKeyboardShortcuts() {
      return {
        Tab: () => {
          if (!this.editor.isActive('codeBlock')) return false;

          const { state, dispatch } = this.editor.view;
          const { $from, $to, empty } = state.selection;
          if ($from.parent.type.name !== 'codeBlock') return false;

          if (empty) {
            this.editor.commands.insertContent('  ');
            return true;
          }

          // Multiline indentation
          const blockStart = $from.start();
          const text = $from.parent.textContent;
          const selStart = $from.parentOffset;
          const selEnd = $to.parentOffset;

          const firstLineStart = text.lastIndexOf('\n', selStart - 1) + 1;
          const lines = text.slice(firstLineStart, selEnd).split('\n');
          const indented = lines.map((line) => '  ' + line).join('\n');

          const tr = state.tr.replaceWith(
            blockStart + firstLineStart,
            blockStart + selEnd,
            state.schema.text(indented)
          );
          dispatch(tr);
          return true;
        },
        'Shift-Tab': () => {
          if (!this.editor.isActive('codeBlock')) return false;

          const { state, dispatch } = this.editor.view;
          const { $from, $to, empty } = state.selection;
          if ($from.parent.type.name !== 'codeBlock') return false;

          const blockStart = $from.start();
          const text = $from.parent.textContent;

          if (empty) {
            const pos = $from.parentOffset;
            if (pos > 0) {
              const sliceBefore = text.slice(Math.max(0, pos - 2), pos);
              if (sliceBefore.endsWith('  ')) {
                const tr = state.tr.delete(
                  blockStart + pos - 2,
                  blockStart + pos
                );
                dispatch(tr);
                return true;
              } else if (sliceBefore.endsWith(' ')) {
                const tr = state.tr.delete(
                  blockStart + pos - 1,
                  blockStart + pos
                );
                dispatch(tr);
                return true;
              }
            }
            return true;
          }

          const selStart = $from.parentOffset;
          const selEnd = $to.parentOffset;
          const firstLineStart = text.lastIndexOf('\n', selStart - 1) + 1;
          const lines = text.slice(firstLineStart, selEnd).split('\n');
          const unindented = lines
            .map((line) =>
              line.startsWith('  ')
                ? line.slice(2)
                : line.startsWith(' ')
                ? line.slice(1)
                : line
            )
            .join('\n');

          if (unindented.length > 0) {
            const tr = state.tr.replaceWith(
              blockStart + firstLineStart,
              blockStart + selEnd,
              state.schema.text(unindented)
            );
            dispatch(tr);
          } else {
            const tr = state.tr.delete(
              blockStart + firstLineStart,
              blockStart + selEnd
            );
            dispatch(tr);
          }
          return true;
        },
      };
    },

    addNodeView() {
      return ({ node, getPos, editor }) => {
        let currentNode = node;
        let copyTimeout: ReturnType<typeof setTimeout> | null = null;
        const container = document.createElement('div');
        container.className =
          'markon-code-block relative rounded-xl border border-default bg-subtle my-3 overflow-hidden font-mono text-xs shadow-sm';

        // Header Bar
        const header = document.createElement('div');
        header.className =
          'flex items-center justify-between px-3 py-1.5 border-b border-default/40 bg-surface/50 select-none';

        // Language Select
        const select = document.createElement('select');
        select.className =
          'select select-sm text-xs bg-transparent border-none py-0.5 pl-1 pr-6 cursor-pointer text-muted hover:text-default font-mono focus:ring-0';
        select.setAttribute('aria-label', 'Code Language');

        const currentLang = normalizeLanguage(node.attrs.language);

        const groups: Record<string, HTMLOptGroupElement> = {
          Web: document.createElement('optgroup'),
          'Backend & Systems': document.createElement('optgroup'),
          'Data & Config': document.createElement('optgroup'),
        };
        groups['Web'].label = 'Web Development';
        groups['Backend & Systems'].label = 'Backend & Systems';
        groups['Data & Config'].label = 'Data & Config';

        SUPPORTED_LANGUAGES.forEach((lang) => {
          const option = document.createElement('option');
          option.value = lang.value;
          option.textContent = lang.label;
          if (currentLang === lang.value) {
            option.selected = true;
          }
          if (lang.group && groups[lang.group]) {
            groups[lang.group].appendChild(option);
          } else {
            select.appendChild(option);
          }
        });

        Object.values(groups).forEach((grp) => {
          if (grp.children.length > 0) {
            select.appendChild(grp);
          }
        });

        if (editor.isEditable) {
          select.addEventListener('change', () => {
            if (typeof getPos === 'function') {
              const pos = getPos();
              if (typeof pos === 'number') {
                editor.view.dispatch(
                  editor.view.state.tr.setNodeMarkup(pos, undefined, {
                    ...currentNode.attrs,
                    language: select.value,
                  })
                );
              }
            }
          });
        } else {
          select.disabled = true;
        }
        header.appendChild(select);

        // Pre & Code contentDOM
        const pre = document.createElement('pre');
        pre.className =
          'p-3 overflow-x-auto text-default m-0 leading-relaxed font-mono';
        const code = document.createElement('code');
        code.className = `hljs language-${currentLang}`;
        pre.appendChild(code);

        // Copy Button
        const copyBtn = document.createElement('button');
        copyBtn.type = 'button';
        copyBtn.className =
          'markon-code-copy-btn btn btn-ghost btn-xs flex items-center gap-1.5 text-muted hover:text-default cursor-pointer transition-colors';
        copyBtn.title = 'Copy code to clipboard';
        copyBtn.innerHTML = `
        <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
        </svg>
        <span>Copy</span>
      `;

        copyBtn.addEventListener('mousedown', (e) => e.preventDefault());
        copyBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const codeText = code.textContent ?? currentNode.textContent ?? '';
          if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(codeText).then(() => {
              copyBtn.innerHTML = `
              <svg class="w-3.5 h-3.5 text-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span class="text-primary font-medium">Copied!</span>
            `;
              if (copyTimeout) clearTimeout(copyTimeout);
              copyTimeout = setTimeout(() => {
                copyBtn.innerHTML = `
                <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                </svg>
                <span>Copy</span>
              `;
              }, 1800);
            });
          }
        });
        header.appendChild(copyBtn);
        container.appendChild(header);
        container.appendChild(pre);

        return {
          dom: container,
          contentDOM: code,
          update: (updatedNode) => {
            if (updatedNode.type.name !== 'codeBlock') return false;
            currentNode = updatedNode;
            const updatedLang = normalizeLanguage(updatedNode.attrs.language);
            if (select.value !== updatedLang) {
              select.value = updatedLang;
            }
            code.className = `hljs language-${updatedLang}`;
            return true;
          },
          destroy: () => {
            if (copyTimeout) {
              clearTimeout(copyTimeout);
              copyTimeout = null;
            }
          },
        };
      };
    },
  });
