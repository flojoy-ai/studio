export const Roles = {
  admin: "Admin",
  viewer: "Viewer",
} as const;

export type User = {
  name: string;
  role: (typeof Roles)[keyof typeof Roles];
  password?: string;
  logged?: boolean;
};
