import { useCallback } from "react";
import { useAuth } from "../context/auth.context";
import { toast } from "sonner";

const useWithPermission = () => {
  const { user } = useAuth();
  const withPermissionCheck = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function <S extends (...params: any[]) => void>(
      innerFn: S,
    ): (...args: Parameters<S>) => void {
      return function (...args: Parameters<S>) {
        if (user?.role !== "admin") {
          toast.error("Action not allowed!");
          return;
        }
        return innerFn(...args);
      };
    },
    [user],
  );
  const isAdmin = useCallback(() => user?.role === "admin", [user]);
  return { withPermissionCheck, isAdmin };
};

export default useWithPermission;
