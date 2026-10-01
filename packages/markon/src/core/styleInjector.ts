/**
 * @nofinite/markon - Core Style Auto-Injector
 * Guarantees zero-config reset-proof typography, bubble menu pill containers,
 * slash command dropdown cards, and popovers across any web surface.
 */

export const MARKON_CORE_CSS = `
/* Markon Container */
.markon-editor {
  position: relative;
  width: 100%;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl, 0.75rem);
  box-shadow: var(--shadow-sm);
  color: var(--fg-default);
  font-family: var(--font-sans, ui-sans-serif, system-ui, -apple-system, sans-serif);
  overflow: hidden;
  transition: border-color var(--transition-fast, 0.15s) ease, box-shadow var(--transition-fast, 0.15s) ease;
}

.markon-editor:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-subtle, rgba(29, 78, 216, 0.15));
}

.markon-editor .editor-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background-color: var(--bg-subtle);
  border-bottom: 1px solid var(--border-default);
  position: sticky;
  top: 0;
  z-index: 10;
  user-select: none;
}

.markon-editor .editor-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  font-size: var(--text-xs, 0.75rem);
  color: var(--fg-muted);
  border-top: 1px solid var(--border-default);
  background-color: var(--bg-subtle);
  user-select: none;
}

/* ProseMirror Canvas Reset-Proof Typography */
.markon-editor .ProseMirror {
  outline: none;
  min-height: 220px;
  padding: 16px 20px;
  color: var(--fg-default);
  font-family: var(--font-sans, ui-sans-serif, system-ui, -apple-system, sans-serif);
  font-size: var(--text-base, 1rem);
  line-height: var(--leading-normal, 1.625);
  word-break: break-word;
}

.markon-editor .ProseMirror > *:first-child {
  margin-top: 0;
}

.markon-editor .ProseMirror > *:last-child {
  margin-bottom: 0;
}

.markon-editor .ProseMirror h1 {
  font-size: var(--text-3xl, 1.875rem) !important;
  font-weight: var(--weight-bold, 700) !important;
  line-height: var(--leading-tight, 1.25) !important;
  letter-spacing: var(--tracking-tight, -0.025em);
  color: var(--fg-default);
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.markon-editor .ProseMirror h2 {
  font-size: var(--text-2xl, 1.5rem) !important;
  font-weight: var(--weight-bold, 700) !important;
  line-height: var(--leading-snug, 1.35) !important;
  letter-spacing: var(--tracking-tight, -0.02em);
  color: var(--fg-default);
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
}

.markon-editor .ProseMirror h3 {
  font-size: var(--text-xl, 1.25rem) !important;
  font-weight: var(--weight-semibold, 600) !important;
  line-height: var(--leading-snug, 1.4) !important;
  color: var(--fg-default);
  margin-top: 1rem;
  margin-bottom: 0.375rem;
}

.markon-editor .ProseMirror h4 {
  font-size: var(--text-lg, 1.125rem) !important;
  font-weight: var(--weight-semibold, 600) !important;
  line-height: var(--leading-normal, 1.45) !important;
  color: var(--fg-default);
  margin-top: 0.875rem;
  margin-bottom: 0.25rem;
}

.markon-editor .ProseMirror p {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  line-height: var(--leading-normal, 1.625);
  color: var(--fg-default);
}

.markon-editor .ProseMirror blockquote {
  border-left: 3px solid var(--color-primary);
  background-color: var(--color-primary-subtle, rgba(29, 78, 216, 0.05));
  border-radius: 0 var(--radius-md, 0.375rem) var(--radius-md, 0.375rem) 0;
  padding: 0.625rem 1rem;
  margin: 1rem 0;
  font-style: italic;
  color: var(--fg-subtle, var(--fg-muted));
}

.markon-editor .ProseMirror blockquote p {
  margin: 0;
}

.markon-editor .ProseMirror hr {
  border: none;
  border-top: 1px solid var(--border-default);
  margin: 1.5rem 0;
}

.markon-editor .ProseMirror code:not(pre code) {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.875em;
  background-color: var(--bg-subtle);
  color: var(--color-primary);
  padding: 0.15em 0.4em;
  border-radius: var(--radius-sm, 0.25rem);
  border: 1px solid var(--border-subtle, var(--border-default));
}

.markon-editor .ProseMirror pre {
  background-color: var(--bg-inset, #090d16);
  color: var(--fg-default, #f8fafc);
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: var(--text-sm, 0.875rem);
  line-height: 1.5;
  padding: 1rem 1.25rem;
  border-radius: var(--radius-lg, 0.5rem);
  border: 1px solid var(--border-default);
  overflow-x: auto;
  margin: 1rem 0;
}

.markon-editor .ProseMirror ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin: 0.75rem 0;
}

.markon-editor .ProseMirror ol {
  list-style-type: decimal;
  padding-left: 1.5rem;
  margin: 0.75rem 0;
}

.markon-editor .ProseMirror li {
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}

.markon-editor .ProseMirror a {
  color: var(--color-primary);
  text-decoration: underline;
  text-underline-offset: 2px;
  cursor: pointer;
}

.markon-editor .ProseMirror a:hover {
  color: var(--color-primary-hover);
}

.markon-editor .ProseMirror table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  border-radius: var(--radius-md, 0.375rem);
  overflow: hidden;
  border: 1px solid var(--border-default);
}

.markon-editor .ProseMirror th,
.markon-editor .ProseMirror td {
  border: 1px solid var(--border-default);
  padding: 0.625rem 0.875rem;
  text-align: left;
  vertical-align: top;
}

.markon-editor .ProseMirror th {
  background-color: var(--bg-subtle);
  font-weight: var(--weight-semibold, 600);
  font-size: var(--text-sm, 0.875rem);
  color: var(--fg-default);
}

/* Floating Bubble Menu (Glassmorphic Pill) */
.markon-bubble-menu {
  position: fixed;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 6px;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl, 0.75rem);
  box-shadow: var(--shadow-xl, 0 20px 25px -5px rgba(0, 0, 0, 0.15));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  width: max-content;
  white-space: nowrap;
  user-select: none;
  font-family: var(--font-sans, ui-sans-serif, system-ui, -apple-system, sans-serif);
}

.markon-bubble-menu .markon-bubble-block-group {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding-right: 4px;
  margin-right: 4px;
  border-right: 1px solid var(--border-default);
}

.markon-bubble-menu button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: var(--radius-md, 0.375rem);
  color: var(--fg-default);
  cursor: pointer;
  padding: 4px 6px;
  font-size: var(--text-xs, 0.75rem);
  line-height: 1;
  transition: background-color var(--transition-fast, 0.15s) ease, color var(--transition-fast, 0.15s) ease;
}

.markon-bubble-menu button:hover {
  background-color: var(--bg-subtle);
}

.markon-bubble-menu button.btn-active {
  background-color: var(--color-primary-subtle, rgba(29, 78, 216, 0.15));
  color: var(--color-primary);
  font-weight: var(--weight-bold, 700);
}

/* Floating Slash Command Dropdown Menu */
.markon-slash-menu {
  position: fixed;
  z-index: 9999;
  width: 280px;
  max-height: 300px;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl, 0.75rem);
  box-shadow: var(--shadow-xl, 0 20px 25px -5px rgba(0, 0, 0, 0.18));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 4px;
  overflow-y: auto;
  overflow-x: hidden;
  user-select: none;
  font-family: var(--font-sans, ui-sans-serif, system-ui, -apple-system, sans-serif);
}

.markon-slash-menu::-webkit-scrollbar {
  width: 5px;
}

.markon-slash-menu::-webkit-scrollbar-track {
  background: transparent;
}

.markon-slash-menu::-webkit-scrollbar-thumb {
  background: var(--border-strong, #94a3b8);
  border-radius: var(--radius-full, 9999px);
}

.markon-slash-menu::-webkit-scrollbar-thumb:hover {
  background: var(--fg-muted, #64748b);
}

.markon-slash-menu .dropdown-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 6px 10px;
  border-radius: var(--radius-lg, 0.5rem);
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition: background-color var(--transition-fast, 0.15s) ease;
}

.markon-slash-menu .dropdown-item:hover,
.markon-slash-menu .dropdown-item.btn-active {
  background-color: var(--bg-subtle);
}

.markon-slash-menu .dropdown-item .item-title {
  font-size: var(--text-xs, 0.75rem);
  font-weight: var(--weight-semibold, 600);
  color: var(--fg-default);
  line-height: 1.25;
}

.markon-slash-menu .dropdown-item .item-desc {
  font-size: 0.7rem;
  color: var(--fg-muted);
  line-height: 1.3;
  margin-top: 2px;
}

/* Popover Menus */
.markon-popover-menu,
.markon-typography-menu,
.markon-font-family-menu,
.markon-font-size-menu,
.markon-color-menu,
.markon-table-menu {
  position: fixed;
  z-index: 9999;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl, 0.75rem);
  box-shadow: var(--shadow-xl, 0 20px 25px -5px rgba(0, 0, 0, 0.18));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 4px;
  font-family: var(--font-sans, ui-sans-serif, system-ui, -apple-system, sans-serif);
}

/* Drag Handle */
.markon-drag-handle {
  position: absolute;
  z-index: 20;
  width: 18px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  color: var(--fg-muted);
  border-radius: var(--radius-sm, 0.25rem);
  user-select: none;
  transition: opacity var(--transition-fast, 0.15s) ease, background-color var(--transition-fast, 0.15s) ease, color var(--transition-fast, 0.15s) ease;
}

.markon-drag-handle:hover {
  color: var(--fg-default);
  background-color: var(--bg-subtle);
}

.markon-drop-indicator {
  position: absolute;
  left: 24px;
  right: 12px;
  height: 2px;
  background-color: var(--color-primary);
  border-radius: var(--radius-full, 9999px);
  z-index: 30;
  pointer-events: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  transform: translateY(-50%);
}
`;

/**
 * Injects Markon core styles into the document head if not already present.
 */
export function ensureMarkonStyles(): void {
  if (typeof document === 'undefined') return;
  const STYLE_ID = 'markon-core-styles';
  if (!document.getElementById(STYLE_ID)) {
    const styleEl = document.createElement('style');
    styleEl.id = STYLE_ID;
    styleEl.textContent = MARKON_CORE_CSS;
    document.head.appendChild(styleEl);
  }
}
