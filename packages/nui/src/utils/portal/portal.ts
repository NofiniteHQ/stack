import { createPortal } from 'react-dom';
import type React from 'react';

/**
 * Portal Component
 * ----------------
 * Safely escapes the current React DOM hierarchy and renders children directly into `document.body`.
 * Essential for building overlays, modals, tooltips, and dropdowns that need to break out of 
 * `overflow: hidden` containers and manage global z-index layering.
 * * Note: In SSR environments, the parent consuming this component should ensure it is only 
 * rendered on the client (e.g., using a `mounted` state) to prevent hydration errors.
 *
 * @param props.children - The React nodes to be portaled to the document body.
 * @returns A React Portal directly targeting `document.body`.
 */
export function Portal({ children }: { children: React.ReactNode }) {
  return createPortal(children, document.body);
}