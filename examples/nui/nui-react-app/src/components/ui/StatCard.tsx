import React from "react";
import type { StatItem } from "../../types";

interface StatCardProps extends StatItem {
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, className }) => (
  <div
    className={`
      rounded-xl border border-(--nui-border-default)
      bg-(--nui-bg-surface)
      px-4 py-3
      transition-shadow hover:shadow-md
      min-w-[120px] flex flex-col
      ${className || ""}
    `}
  >
    <p className="text-xs font-medium text-(--nui-fg-subtle) truncate">
      {label}
    </p>
    <p className="mt-1 text-lg font-semibold text-(--nui-fg-default) truncate">
      {value}
    </p>
  </div>
);