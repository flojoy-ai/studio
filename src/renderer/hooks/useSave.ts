import { toast } from "sonner";
import useWithPermission from "./useWithPermission";
import { useProjectStore } from "@/renderer/stores/project";
import { useShallow } from "zustand/react/shallow";

export const useSave = () => {
  const { withPermissionCheck } = useWithPermission();

  const saveProject = useProjectStore(useShallow((state) => state.saveProject));

  const handleSave = async () => {
    const pathRes = await saveProject();
    if (pathRes.isErr()) {
      toast.error(
        `An error occurred while trying to save: ${pathRes.error.message}`,
      );
      return;
    }

    toast.success(`App saved to ${pathRes.value}.`);
  };

  return withPermissionCheck(handleSave);
};
