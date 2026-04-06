'use client';
import React from "react";
import { Button, useTheme } from "@nofinite/nui";

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Button size="sm" variant="outline" onClick={toggleTheme}>
      {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </Button>
  );
};

export const Header: React.FC = () => (
  <header className="sticky top-0 z-50 border-b border-(--nui-border-default) bg-[var(--nui-bg-surface)/90] backdrop-blur">
    <div className="mx-auto flex flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 min-w-0">
        {/* <Logo /> */}
        <div className="min-w-0">
          <p className="text-2xl font-semibold truncate">NUI</p>
          <p className="text-md text-(--nui-fg-subtle) truncate">
            Open source React UI components
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
        <Button
          variant="ghost"
          size="sm"
          className="inline-flex" // always visible
          onClick={() => window.open('https://opensource.nofinite.com/docs/nui', '_blank')}
        >
          Docs
        </Button>

        <ThemeSwitcher />
      </div>
    </div>
  </header>
);