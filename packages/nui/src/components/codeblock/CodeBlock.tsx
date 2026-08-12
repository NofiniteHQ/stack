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

const LANG_OPTIONS = [
  { value: 'text', label: 'Plain Text' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'python', label: 'Python' },
  { value: 'bash', label: 'Bash' },
  { value: 'json', label: 'JSON' },
  { value: 'rust', label: 'Rust' },
  { value: 'go', label: 'Go' },
];

const tokenColorMap: Record<string, string> = {
  'hljs-keyword': 'text-purple-600 dark:text-purple-400 font-semibold',
  'hljs-built_in': 'text-purple-600 dark:text-purple-400',
  'hljs-type': 'text-purple-600 dark:text-purple-400',
  'hljs-literal': 'text-purple-600 dark:text-purple-400',
  'hljs-number': 'text-orange-600 dark:text-orange-400',
  'hljs-string': 'text-green-600 dark:text-green-400',
  'hljs-regexp': 'text-green-600 dark:text-green-400',
  'hljs-symbol': 'text-orange-600 dark:text-orange-400',
  'hljs-class': 'text-blue-600 dark:text-blue-400 font-semibold',
  'hljs-title': 'text-blue-600 dark:text-blue-400 font-semibold',
  'hljs-function': 'text-blue-600 dark:text-blue-400 font-semibold',
  'hljs-params': 'text-default',
  'hljs-comment': 'text-gray-500 italic',
  'hljs-doctag': 'text-gray-500 italic',
  'hljs-meta': 'text-gray-500',
  'hljs-attr': 'text-cyan-600 dark:text-cyan-400',
  'hljs-attribute': 'text-cyan-600 dark:text-cyan-400',
  'hljs-variable': 'text-red-600 dark:text-red-400',
  'hljs-name': 'text-blue-600 dark:text-blue-400 font-semibold',
  'hljs-tag': 'text-default',
};

function renderAst(node: any, i: number): React.ReactNode {
  if (node.type === 'text') return node.value;
  if (node.type === 'element') {
    const classes = node.properties?.className || [];
    const colorClass = classes.map((c: string) => tokenColorMap[c] || '').join(' ').trim();
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
    
    try {
      const ast = lowlight.highlight(language === 'text' ? 'plaintext' : language || 'plaintext', codeToHighlight);
      return ast.children.map(renderAst);
    } catch (e) {
      // Fallback if language is missing
      return codeToHighlight;
    }
  }, [code, children, language]);

  return (
    <div className={cn("relative rounded-lg bg-surface-raised border border-default shadow-sm overflow-hidden group font-mono text-sm", className)}>
      <div className="flex items-center justify-between px-3 py-2 bg-surface border-b border-default select-none">
        <div className="flex items-center">
          {readOnlyLanguage ? (
            <span className="text-xs font-semibold uppercase text-muted tracking-wider px-2 py-1">{language || 'text'}</span>
          ) : (
            <Select 
              data={LANG_OPTIONS}
              value={language || 'text'}
              onChange={onLanguageChange}
              className="w-auto min-h-0 h-auto py-1 px-2 text-xs font-semibold uppercase tracking-wider bg-transparent border-none shadow-none hover:text-default hover:bg-transparent text-muted focus-visible:ring-0"
            />
          )}
        </div>
        <button 
          onClick={copyToClipboard}
          className="text-muted hover:text-default bg-transparent border border-transparent rounded-md transition-all flex items-center justify-center p-1.5"
          title="Copy code"
        >
          {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto m-0 text-default bg-subtle leading-relaxed">
        <code>{highlightedCode}</code>
      </pre>
    </div>
  );
};
