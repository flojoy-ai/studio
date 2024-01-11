export type User = {
  name: string;
  role: "Admin" | "Moderator";
  password?: string;
  logged?: boolean;
};
