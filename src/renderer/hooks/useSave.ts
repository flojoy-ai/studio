import { toast } from "sonner";
import useWithPermission from "./useWithPermission";
import { useProjectStore } from "../stores/project";

export const useSave = () => {
  const { withPermissionCheck } = useWithPermission();

  const saveProject = useProjectStore((state) => state.saveProject);

  const handleSave = async () => {
    const pathRes = await saveProject();
    if (!pathRes.ok) {
      toast.error(
        `An error occurred while trying to save: ${pathRes.error.message}`,
      );
      return;
    }

    toast.success(`App saved to ${pathRes.value}.`);
  };

  return withPermissionCheck(handleSave);
};
