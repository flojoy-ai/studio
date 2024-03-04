import { useAppStore } from "@/renderer/stores/app";
import { Project } from "@/renderer/types/project";

import { useShallow } from "zustand/react/shallow";
import { useLoadProject } from "@/renderer/stores/project";
import { tryParse } from "@/types/result";
import { fromPromise, ok } from "neverthrow";
import { toast } from "sonner";

export const useLoadApp = () => {
  const loadProject = useLoadProject();

  const setShowWelcomeScreen = useAppStore(
    useShallow((state) => state.setShowWelcomeScreen),
  );

  const openFilePicker = async () => {
    const res = await fromPromise(
      window.api.openFilePicker(),
      (e) => e as Error,
    );
    if (res.isErr()) {
      toast.error("Failed to open file", { description: res.error.message });
      return;
    }
    if (res.value === undefined) {
      return ok(undefined);
    }
    const { fileContent, filePath } = res.value;
    tryParse(Project)(JSON.parse(fileContent)).match(
      (proj) => {
        loadProject(proj, filePath);
        setShowWelcomeScreen(false);
      },
      (e) =>
        toast.error("Project validation error", { description: e.message }),
    );
  };

  return openFilePicker;
};
