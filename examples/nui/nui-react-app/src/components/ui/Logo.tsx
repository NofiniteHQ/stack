import React from "react";

export const Logo: React.FC = () => (
  <div className="grid h-10 w-10 place-items-center rounded-xl bg-(--nui-accent) text-white shadow-sm">
    <svg
      width="20"
      height="20"
      viewBox="0 0 28 28"
      fill="none"
      aria-label="NUI logo"
    >
      <rect width="28" height="28" rx="8" fill="currentColor" />
      <path
        d="M7 20V8l10 12V8"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);