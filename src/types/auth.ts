export const allRoles = ["admin", "viewer"] as const;
export type Role = (typeof allRoles)[number];

export type User = {
  name: string;
  role: Role;
  password?: string;
  logged?: boolean;
};
