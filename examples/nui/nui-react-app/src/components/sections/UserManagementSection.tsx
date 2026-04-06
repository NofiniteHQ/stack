import React from "react";
import { Card, Badge, Button, Accordion, nui } from "@nofinite/nui";
import { users, faqItems } from "../../data";
import { UsersTable } from "../ui";

export const UserManagementSection: React.FC = () => {
  const handleInvite = (): void => {
    nui.success("Invite sent.");
  };

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

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
      <Card className="border-[var(--nui-border-default)]">
        <Card.Header>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold">User management demo</h2>
              <p className="text-sm text-[var(--nui-fg-subtle)]">
                Structured data, badges, row actions, and responsive overflow.
              </p>
            </div>
            <Badge variant="info">{users.length} users</Badge>
          </div>
        </Card.Header>

        <Card.Body className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button size="sm" onClick={handleInvite}>
              Invite user
            </Button>
            <Button size="sm" variant="outline">
              Export list
            </Button>
          </div>

          <div className="overflow-x-auto">
            <UsersTable users={users} onDelete={handleDelete} showActions />
          </div>
        </Card.Body>
      </Card>

      <Card className="border-[var(--nui-border-default)] bg-[var(--nui-bg-surface)]">
        <Card.Header>
          <h2 className="text-2xl font-bold">Common questions</h2>
        </Card.Header>
        <Card.Body>
          <Accordion items={faqItems} multiple />
        </Card.Body>
      </Card>
    </section>
  );
};