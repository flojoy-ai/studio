export const allRoles = ["Admin", "Operator"] as const;
export type Role = (typeof allRoles)[number];

export type User = {
  name: string;
  role: Role;
  password?: string;
  logged?: boolean;
};
