/**
 * @nofinite/markon - Custom Modal Box Utility
 * 100% aligned with @nofinite/nuix and @nofinite/nuicss native <dialog class="modal"> architecture.
 * Fully collision-proof and dead-center aligned with glassmorphic backdrop blur.
 */

export interface MarkonModalOptions {
  title: string;
  label?: string;
  initialValue?: string;
  placeholder?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: (val: string) => void;
  onCancel?: () => void;
}

export function openMarkonModal(options: MarkonModalOptions): void {
  if (typeof document === 'undefined') return;

  const dialog = document.createElement('dialog');
  dialog.className = 'modal';

  // Force dead-center alignment and collision boundaries regardless of document scroll or container styles
  dialog.style.cssText =
    'position: fixed !important; inset: 0px !important; margin: auto !important; height: fit-content !important; max-height: calc(100vh - 2rem) !important; max-width: 28rem !important; width: calc(100% - 2rem) !important; padding: 0px !important; border: none !important; background: transparent !important; z-index: 9999 !important; overflow: visible !important;';

  const title = options.title || 'Edit';
  const label = options.label || 'Value';
  const initialValue = options.initialValue || '';
  const placeholder = options.placeholder || '';
  const confirmText = options.confirmText || 'Save';
  const cancelText = options.cancelText || 'Cancel';

  dialog.innerHTML = `
    <div class="modal-box w-full max-w-md bg-surface border border-default rounded-2xl shadow-2xl p-6 font-sans flex flex-col max-h-[85vh] overflow-y-auto animate-in zoom-in-95 fade-in duration-150">
      <div class="modal-header flex items-center justify-between pb-3 border-b border-default mb-4">
        <h3 class="modal-title text-base font-semibold text-default m-0">${escapeHtml(
          title
        )}</h3>
        <button type="button" class="modal-close text-muted hover:text-default p-1 rounded-md hover:bg-subtle transition-colors cursor-pointer inline-flex items-center justify-center" data-action="cancel" aria-label="Close">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <form method="dialog" class="modal-body py-2 space-y-3">
        <div>
          <label class="block text-xs font-medium text-muted mb-1.5">${escapeHtml(
            label
          )}</label>
          <input type="text" class="markon-modal-input input w-full text-sm font-sans" value="${escapeHtml(
            initialValue
          )}" placeholder="${escapeHtml(placeholder)}" />
        </div>
      </form>
      <div class="modal-footer flex items-center justify-end gap-3 pt-4 border-t border-default mt-4">
        <button type="button" class="btn btn-ghost btn-sm" data-action="cancel">${escapeHtml(
          cancelText
        )}</button>
        <button type="button" class="btn btn-primary btn-sm" data-action="confirm">${escapeHtml(
          confirmText
        )}</button>
      </div>
    </div>
  `.trim();

  document.body.appendChild(dialog);

  const input = dialog.querySelector<HTMLInputElement>('.markon-modal-input');
  let confirmed = false;

  const closeDialog = () => {
    try {
      if (typeof dialog.close === 'function') {
        dialog.close();
      } else {
        dialog.removeAttribute('open');
      }
    } catch {
      // dialog already closed
    }
    dialog.remove();
  };

  const handleConfirm = () => {
    confirmed = true;
    const value = input ? input.value : '';
    closeDialog();
    options.onConfirm(value);
  };

  const handleCancel = () => {
    closeDialog();
    options.onCancel?.();
  };

  // Backdrop click dismissal (matching nuix delegation pattern)
  dialog.addEventListener('click', (e) => {
    const box = dialog.querySelector('.modal-box');
    if (box && !box.contains(e.target as Node)) {
      handleCancel();
      return;
    }
    const actionBtn = (e.target as HTMLElement).closest<HTMLElement>(
      '[data-action]'
    );
    if (!actionBtn) return;
    const action = actionBtn.getAttribute('data-action');
    if (action === 'confirm') {
      e.preventDefault();
      handleConfirm();
    } else if (action === 'cancel') {
      e.preventDefault();
      handleCancel();
    }
  });

  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleConfirm();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  });

  dialog.addEventListener('close', () => {
    if (!confirmed) {
      options.onCancel?.();
    }
    dialog.remove();
  });

  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
  } else {
    dialog.setAttribute('open', '');
  }

  // Auto-focus and select text for effortless editing
  requestAnimationFrame(() => {
    if (input) {
      input.focus();
      input.select();
    }
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
