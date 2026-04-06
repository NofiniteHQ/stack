import React from "react";
import { featureCards } from "../../data";
import { FeatureCard } from "../ui";

export const FeatureCardsSection: React.FC = () => (
  <section className="space-y-6">
    <div className="max-w-2xl">
      <h2 className="text-3xl font-bold sm:text-4xl">Why teams reach for NUI</h2>
      <p className="mt-3 text-[var(--nui-fg-subtle)]">
        Promote the library through real capabilities: accessibility,
        composability, documented workflows, and practical application UI.
      </p>
    </div>

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {featureCards.map((item) => (
        <FeatureCard
          key={item.title}
          title={item.title}
          desc={item.desc}
          badge={item.badge}
          variant={item.variant}
        />
      ))}
    </div>
  </section>
);