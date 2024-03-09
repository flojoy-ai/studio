import { toast } from "sonner";
import useWithPermission from "./useWithPermission";
import { useProjectStore } from "@/renderer/stores/project";
import { useShallow } from "zustand/react/shallow";

export const useSave = () => {
  const { withPermissionCheck } = useWithPermission();

  const saveProject = useProjectStore(useShallow((state) => state.saveProject));

  const handleSave = async () => {
    (await saveProject()).match(
      (path) => {
        if (path === undefined) {
          return;
        }
        toast.success(`App saved to ${path}.`);
      },
      (e) =>
        toast.error(`An error occurred while trying to save: ${e.message}`),
    );
  };

  return withPermissionCheck(handleSave);
};
