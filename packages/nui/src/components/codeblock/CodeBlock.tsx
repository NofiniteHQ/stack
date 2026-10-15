import React, { useState, useMemo } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '../../utils';
import { Select } from '../select/Select';
import { common, createLowlight } from 'lowlight';

const lowlight = createLowlight(common);

export interface CodeBlockProps {
  language: string;
  onLanguageChange?: (lang: string) => void;
  code: string;
  children?: React.ReactNode;
  className?: string;
  readOnlyLanguage?: boolean;
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

export const LANG_OPTIONS = [
  // Web Development
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },

  // Backend & Systems
  { value: 'python', label: 'Python' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },

  // Data, Shell & Config
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'plaintext', label: 'Plain Text' },
];

const tokenColorMap: Record<string, string> = {
  'hljs-keyword': 'text-primary font-semibold',
  'hljs-built_in': 'text-secondary font-medium',
  'hljs-type': 'text-primary font-medium',
  'hljs-literal': 'text-warning font-medium',
  'hljs-number': 'text-warning',
  'hljs-string': 'text-success',
  'hljs-regexp': 'text-success',
  'hljs-symbol': 'text-warning',
  'hljs-class': 'text-info font-semibold',
  'hljs-title': 'text-info font-semibold',
  'hljs-function': 'text-info font-medium',
  'hljs-params': 'text-default',
  'hljs-comment': 'text-muted italic',
  'hljs-doctag': 'text-muted italic',
  'hljs-meta': 'text-muted',
  'hljs-attr': 'text-info',
  'hljs-attribute': 'text-info',
  'hljs-variable': 'text-danger',
  'hljs-name': 'text-primary font-semibold',
  'hljs-tag': 'text-default',
};

function renderAst(node: any, i: number): React.ReactNode {
  if (node.type === 'text') return node.value;
  if (node.type === 'element') {
    const classes = node.properties?.className || [];
    const colorClass = classes
      .map((c: string) => tokenColorMap[c] || '')
      .join(' ')
      .trim();
    return React.createElement(
      node.tagName,
      { key: i, className: colorClass || undefined },
      node.children?.map(renderAst)
    );
  }
  return null;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  language,
  onLanguageChange,
  code,
  children,
  className,
  readOnlyLanguage = false,
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightedCode = useMemo(() => {
    // If the user passes raw text in `code` but doesn't pass children, we highlight `code`.
    // If they pass something else in `children`, we render that.
    if (children && typeof children !== 'string') return children;
    const codeToHighlight = typeof children === 'string' ? children : code;

    const normLang = normalizeLanguage(language);

    try {
      const ast = lowlight.highlight(normLang, codeToHighlight);
      return ast.children.map(renderAst);
    } catch (e) {
      // Fallback if language is missing
      return codeToHighlight;
    }
  }, [code, children, language]);

  const currentNormLang = normalizeLanguage(language);

  return (
    <div className={cn('code-block group', className)}>
      <div className="code-header select-none">
        <div className="flex items-center">
          {readOnlyLanguage ? (
            <span className="code-lang px-2 py-1">{currentNormLang}</span>
          ) : (
            <Select
              data={LANG_OPTIONS}
              value={currentNormLang}
              onChange={onLanguageChange}
              className="w-auto min-h-0 h-auto py-1 px-2 text-xs font-semibold uppercase tracking-wider bg-transparent border-none shadow-none hover:text-default hover:bg-transparent text-muted focus-visible:ring-0"
            />
          )}
        </div>
        <button
          onClick={copyToClipboard}
          className="code-copy-btn btn btn-ghost btn-xs flex items-center justify-center p-1.5 transition-colors"
          title="Copy code"
        >
          {copied ? (
            <Check size={14} className="text-success" />
          ) : (
            <Copy size={14} />
          )}
        </button>
      </div>
      <pre className="code-pre p-4 overflow-x-auto m-0 leading-relaxed font-mono">
        <code>{highlightedCode}</code>
      </pre>
    </div>
  );
};
