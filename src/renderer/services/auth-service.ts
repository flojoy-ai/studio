import { Roles, User } from "@root/types/auth";
import { toast } from "sonner";

export const checkPermission = (user: User | null) => {
  if (!user || user.role === Roles.admin) {
    return true;
  }
  return false;
};

export const authenticate = (user: User | null) => {
  const hasPermission = checkPermission(user);
  if (!hasPermission) {
    toast.error("Action not allowed!");
    throw new Error("Action not allowed!");
  }
};
