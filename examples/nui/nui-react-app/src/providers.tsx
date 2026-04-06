'use client';

import { NUIProvider, ToastProvider, DialogProvider } from '@nofinite/nui';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NUIProvider defaultTheme="system">
      <ToastProvider>
        <DialogProvider />
        {children}
      </ToastProvider>
    </NUIProvider>
  );
}