import React from "react";
import { Card, Badge } from "@nofinite/nui";
import type { FeatureCardData } from "../../types";


interface FeatureCardProps extends FeatureCardData { }

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  desc,
  badge,
  variant,
}) => (
  <Card
    hover
    className="h-full border-(--nui-border-default) bg-(--nui-bg-surface)"
  >
    <Card.Header>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Badge variant={variant}>{badge}</Badge>
      </div>
    </Card.Header>
    <Card.Body className="text-sm leading-6 text-(--nui-fg-subtle)">
      {desc}
    </Card.Body>
  </Card>
);