import React from "react";
import { Badge, Button } from "@nofinite/nui";

export const CTASection: React.FC = () => (
  <section className="rounded-2xl border border-[var(--nui-border-default)] bg-[var(--nui-bg-surface)] px-5 py-8 sm:px-8 sm:py-10">
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="max-w-2xl">
        <Badge variant="success">Ready to explore</Badge>
        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
          Build with documented NUI components
        </h2>
        <p className="mt-3 text-[var(--nui-fg-subtle)]">
          Showcase the library through real examples: forms, step flows,
          confirmations, badges, overlays, and structured data UI.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button size="lg">Browse components</Button>
        <Button size="lg" variant="outline">
          Read docs
        </Button>
      </div>
    </div>
  </section>
);