export enum Roles {
  admin = "Admin",
  viewer = "Viewer",
}

export type User = {
  name: string;
  role: Roles;
  password?: string;
  logged?: boolean;
};
