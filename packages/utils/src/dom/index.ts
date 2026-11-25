/**
 * @license
 * Copyright (C) 2026 Nofinite
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Checks whether the current runtime environment has full browser DOM access.
 */
export function isBrowser(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined' &&
    typeof document.createElement === 'function'
  );
}

/**
 * Copies text to the system clipboard using the modern Async Clipboard API,
 * with fallback to execCommand('copy') where available.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!isBrowser() || !text) return false;

  if (window.navigator?.clipboard?.writeText) {
    try {
      await window.navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback
    }
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return Boolean(success);
  } catch {
    return false;
  }
}

/**
 * Safely scrolls an element into view if running in a browser environment.
 */
export function scrollIntoView(
  element: unknown,
  options?: ScrollIntoViewOptions
): void {
  if (!isBrowser() || !element) return;
  const el = element as HTMLElement;
  if (typeof el.scrollIntoView === 'function') {
    el.scrollIntoView(options);
  }
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Traps Tab and Shift+Tab keyboard focus within a container element for modal dialogs and drawers.
 */
export function trapFocus(container: unknown, event: unknown): void {
  if (!isBrowser() || !container || !event) return;

  const el = container as HTMLElement;
  const evt = event as KeyboardEvent;

  if (evt.key !== 'Tab') return;

  const focusables = Array.from(
    el.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  ).filter(
    (item) => !item.hasAttribute('disabled') && item.offsetParent !== null
  );

  if (focusables.length === 0) {
    evt.preventDefault();
    return;
  }

  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  if (evt.shiftKey) {
    if (
      document.activeElement === first ||
      !el.contains(document.activeElement)
    ) {
      evt.preventDefault();
      last.focus();
    }
  } else {
    if (
      document.activeElement === last ||
      !el.contains(document.activeElement)
    ) {
      evt.preventDefault();
      first.focus();
    }
  }
}
