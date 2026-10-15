/**
 * @nofinite/markon - Interactive Link Popover
 * Framework-agnostic floating action card for viewing, copying, editing, and unlinking hyperlinks.
 * 100% styled with @nofinite/nuicss tokens and @floating-ui/dom positioning.
 */

export interface LinkPopoverOptions {
  href: string;
  onCopy?: (url: string) => void;
  onEdit?: (url: string) => void;
  onUnlink?: () => void;
}

/**
 * Strips protocols and trailing slashes for clean presentation in badges and cards.
 */
export function formatDisplayUrl(url: string): string {
  if (!url) return '';
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

/**
 * Returns the semantic HTML markup for the link action popover card.
 */
export function renderLinkPopoverHtml(href: string): string {
  const displayUrl = formatDisplayUrl(href);
  return `
    <a href="${href}" target="_blank" rel="noopener noreferrer" class="link text-primary font-medium flex items-center gap-1.5 px-2 py-0.5 max-w-[240px] truncate hover:underline text-xs" title="${href}">
      <span class="truncate">${displayUrl || href}</span>
      <svg width="12" height="12" class="w-3 h-3 shrink-0 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        <polyline points="15 3 21 3 21 9"/>
        <line x1="10" y1="14" x2="21" y2="3"/>
      </svg>
    </a>
    <span class="w-px h-4 bg-border/60 mx-0.5 self-center shrink-0"></span>
    <button type="button" class="btn btn-ghost btn-sm btn-icon h-7 w-7 text-xs" data-link-action="copy" title="Copy URL">
      <svg width="14" height="14" class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
      </svg>
    </button>
    <button type="button" class="btn btn-ghost btn-sm btn-icon h-7 w-7 text-xs" data-link-action="edit" title="Edit Link">
      <svg width="14" height="14" class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
      </svg>
    </button>
    <button type="button" class="btn btn-ghost btn-sm btn-icon h-7 w-7 text-xs text-danger hover:bg-danger/10" data-link-action="unlink" title="Remove Link">
      <svg width="14" height="14" class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        <line x1="2" y1="2" x2="22" y2="22"/>
      </svg>
    </button>
  `;
}
