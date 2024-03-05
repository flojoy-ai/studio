import { useCallback } from "react";
import { useAuth } from "@/renderer/context/auth.context";
import { toast } from "sonner";

const useWithPermission = () => {
  const { user } = useAuth();
  const withPermissionCheck = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function <S extends (...params: any[]) => void>(
      innerFn: S,
    ): ((...args: Parameters<S>) => void) & {
      withException: (...args: Parameters<S>) => void;
    } {
      const fn = function (...args: Parameters<S>) {
        if (user?.role !== "Admin") {
          toast.error("Action not allowed!");
          return;
        }
        return innerFn(...args);
      };

      fn.withException = (...args: Parameters<S>) => {
        return innerFn(...args);
      };

      return fn;
    },
    [user],
  );
  const isAdmin = useCallback(() => user?.role === "Admin", [user]);
  return { withPermissionCheck, isAdmin };
};

export default useWithPermission;
