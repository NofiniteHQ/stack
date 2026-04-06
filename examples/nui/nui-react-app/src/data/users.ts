import type { User } from "../types";


export const users: User[] = [
  { id: 1, name: 'Akshay', role: 'Admin', status: 'Active', plan: 'Core' },
  {
    id: 2,
    name: 'Rohit',
    role: 'Developer',
    status: 'Pending',
    plan: 'Starter',
  },
  { id: 3, name: 'Sneha', role: 'Designer', status: 'Active', plan: 'Core' },
  { id: 4, name: 'Vijay', role: 'Manager', status: 'Inactive', plan: 'Team' },
];
