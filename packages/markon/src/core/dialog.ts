/**
 * @nofinite/markon - Custom Modal Box Utility
 * 100% powered by native <dialog class="modal"> and @nofinite/nuicss semantic superclasses.
 * Fully framework-agnostic with native focus trapping, backdrop blur, and escape handling.
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

  const title = options.title || 'Edit';
  const label = options.label || 'Value';
  const initialValue = options.initialValue || '';
  const placeholder = options.placeholder || '';
  const confirmText = options.confirmText || 'Save';
  const cancelText = options.cancelText || 'Cancel';

  dialog.innerHTML = `
    <div class="modal-box max-w-md w-full">
      <div class="modal-header">
        <h3 class="modal-title text-base font-semibold text-default">${title}</h3>
        <button type="button" class="modal-close" data-action="cancel" aria-label="Close">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <form method="dialog" class="modal-body space-y-3">
        <div>
          <label class="block text-xs font-medium text-muted mb-1.5">${label}</label>
          <input type="text" class="markon-modal-input input w-full text-sm font-sans" value="${escapeHtml(
            initialValue
          )}" placeholder="${escapeHtml(placeholder)}" />
        </div>
      </form>
      <div class="modal-footer">
        <button type="button" class="btn btn-ghost btn-sm" data-action="cancel">${cancelText}</button>
        <button type="button" class="btn btn-primary btn-sm" data-action="confirm">${confirmText}</button>
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

  dialog.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target === dialog) {
      handleCancel();
      return;
    }
    const actionBtn = target.closest<HTMLElement>('[data-action]');
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
