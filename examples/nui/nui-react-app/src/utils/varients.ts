import type { BadgeVariant } from "@nofinite/nui";
import type { User } from "../types";

export const statusVariant = (status: User['status']): BadgeVariant => {
  switch (status) {
    case 'Active':
      return 'success';
    case 'Pending':
      return 'warning';
    default:
      return 'default';
  }
};

export const planVariant = (plan: User['plan']): BadgeVariant => {
  switch (plan) {
    case 'Core':
      return 'info';
    case 'Team':
      return 'success';
    default:
      return 'default';
  }
};
