import React from "react";
import { Card, Button, Badge, Input } from "@nofinite/nui";

export const OverviewTab: React.FC = () => (
  <div className="grid gap-4 lg:grid-cols-3">
    <Card>
      <Card.Header>Buttons</Card.Header>
      <Card.Body className="flex flex-wrap gap-3">
        <Button>Default</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </Card.Body>
    </Card>

    <Card>
      <Card.Header>Badges</Card.Header>
      <Card.Body className="flex flex-wrap gap-2">
        <Badge variant="default">Default</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="outline">Info</Badge>
      </Card.Body>
    </Card>

    <Card>
      <Card.Header>Inputs</Card.Header>
      <Card.Body className="space-y-3">
        <Input placeholder="Type here" />
        <Input placeholder="Disabled" disabled />
      </Card.Body>
    </Card>
  </div>
);