export enum Roles {
  admin = "Admin",
  codeOnly = "Code-only",
}

export type User = {
  name: string;
  role: Roles;
  password?: string;
  logged?: boolean;
};
