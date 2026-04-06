import React from "react";
import { Card, Button, nui } from "@nofinite/nui";

export const FeedbackTab: React.FC = () => {
  const handleDelete = async (name: string): Promise<void> => {
    const confirmed = await nui.confirm({
      title: `Remove ${name}?`,
      description: "This action cannot be undone.",
      confirmLabel: "Remove user",
      cancelLabel: "Cancel",
    });

    if (confirmed) {
      nui.success(`${name} removed.`);
    }
  };

  const handleShowAlert = (): void => {
    nui.alert({
      title: "Saved draft",
      description: "Your work has been saved.",
      variant: "info",
    });
  };

  const handleTriggerToast = (): void => {
    nui.success("Background sync complete.");
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <Card.Header>Alert</Card.Header>
        <Card.Body className="space-y-3">
          <p className="text-sm text-[var(--nui-fg-subtle)]">
            Good for acknowledgement flows.
          </p>
          <Button onClick={handleShowAlert}>Show alert</Button>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>Confirm</Card.Header>
        <Card.Body className="space-y-3">
          <p className="text-sm text-[var(--nui-fg-subtle)]">
            Useful for destructive or high-impact actions.
          </p>
          <Button variant="outline" onClick={() => handleDelete("Demo user")}>
            Open confirm
          </Button>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>Toast</Card.Header>
        <Card.Body className="space-y-3">
          <p className="text-sm text-[var(--nui-fg-subtle)]">
            Trigger lightweight status feedback from application logic.
          </p>
          <Button variant="ghost" onClick={handleTriggerToast}>
            Trigger toast
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};