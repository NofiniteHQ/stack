import React from "react";
import { Badge } from "@nofinite/nui";

export const Footer: React.FC = () => (
  <footer className="border-t border-(--nui-border-default) bg-(--nui-bg-surface)">
    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-sm text-(--nui-fg-subtle) sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
      <p>Built with NUI components and NUI CSS tokens.</p>
      <div className="flex flex-wrap gap-2">
        <Badge variant="default">@nofinite/nui</Badge>
        <Badge variant="warning">@nofinite/nuicss</Badge>
      </div>
    </div>
  </footer>
);