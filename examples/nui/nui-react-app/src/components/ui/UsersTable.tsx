import React from "react";
import { Table, Badge, Button, nui, type TableColumn } from "@nofinite/nui";
import type { User } from "../../types";
import { planVariant, statusVariant } from "../../utils/varients";



interface UsersTableProps {
  users: User[];
  onDelete?: (name: string) => void;
  showActions?: boolean;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  onDelete,
  showActions = false,
}) => {
  const baseColumns: TableColumn<User>[] = [
    {
      key: "name",
      label: "Name",
      render: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: "role",
      label: "Role",
      render: (row) => (
        <span className="text-(--nui-fg-subtle)">{row.role}</span>
      ),
    },
    {
      key: "plan",
      label: "Plan",
      render: (row) => (
        <Badge variant={planVariant(row.plan)}>{row.plan}</Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
      ),
    },
  ];

  const actionsColumn: TableColumn<User> = {
    key: "actions",
    label: "Actions",
    render: (row) => (
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => nui.success(`Editing ${row.name}`)}
        >
          Edit
        </Button>
        <Button
          size="sm"
          variant="danger"
          onClick={() => onDelete?.(row.name)}
        >
          Remove
        </Button>
      </div>
    ),
  };

  const columns: TableColumn<User>[] = showActions
    ? [...baseColumns, actionsColumn]
    : baseColumns;

  return <Table columns={columns} data={users} rowKey="id" />;
};