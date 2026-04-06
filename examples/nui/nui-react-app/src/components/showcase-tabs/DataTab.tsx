import React from "react";
import { users } from "../../data";
import { UsersTable } from "../ui";

export const DataTab: React.FC = () => (
  <div className="overflow-x-auto">
    <UsersTable users={users} />
  </div>
);