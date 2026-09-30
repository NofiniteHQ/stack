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

export const SUPPORTED_LANGUAGES = [
  { label: 'Plain Text', value: 'plaintext' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'Python', value: 'python' },
  { label: 'HTML', value: 'html' },
  { label: 'CSS', value: 'css' },
  { label: 'JSON', value: 'json' },
  { label: 'Markdown', value: 'markdown' },
  { label: 'SQL', value: 'sql' },
  { label: 'Bash', value: 'bash' },
  { label: 'Rust', value: 'rust' },
  { label: 'Go', value: 'go' },
  { label: 'C++', value: 'cpp' },
  { label: 'C#', value: 'csharp' },
  { label: 'Java', value: 'java' },
  { label: 'YAML', value: 'yaml' },
];

export const MarkonCodeBlock =
  CodeBlockLowlight.extend<CodeBlockLowlightOptions>({
    addNodeView() {
      return ({ node, getPos, editor }) => {
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

        SUPPORTED_LANGUAGES.forEach((lang) => {
          const option = document.createElement('option');
          option.value = lang.value;
          option.textContent = lang.label;
          if ((node.attrs.language || 'plaintext') === lang.value) {
            option.selected = true;
          }
          select.appendChild(option);
        });

        if (editor.isEditable) {
          select.addEventListener('change', () => {
            if (typeof getPos === 'function') {
              const pos = getPos();
              if (typeof pos === 'number') {
                editor.view.dispatch(
                  editor.view.state.tr.setNodeMarkup(pos, undefined, {
                    ...node.attrs,
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
          const codeText = node.textContent;
          if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(codeText).then(() => {
              copyBtn.innerHTML = `
              <svg class="w-3.5 h-3.5 text-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span class="text-primary font-medium">Copied!</span>
            `;
              setTimeout(() => {
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

        // Pre & Code contentDOM
        const pre = document.createElement('pre');
        pre.className =
          'p-3 overflow-x-auto text-default m-0 leading-relaxed font-mono';
        const code = document.createElement('code');
        code.className = `hljs language-${node.attrs.language || 'plaintext'}`;
        pre.appendChild(code);
        container.appendChild(pre);

        return {
          dom: container,
          contentDOM: code,
          update: (updatedNode) => {
            if (updatedNode.type.name !== 'codeBlock') return false;
            if (select.value !== (updatedNode.attrs.language || 'plaintext')) {
              select.value = updatedNode.attrs.language || 'plaintext';
            }
            code.className = `hljs language-${
              updatedNode.attrs.language || 'plaintext'
            }`;
            return true;
          },
        };
      };
    },
  });
