import { useAppStore } from "@/renderer/stores/app";
import { Project } from "@/renderer/types/project";

import { useShallow } from "zustand/react/shallow";
import { useLoadProject } from "@/renderer/stores/project";
import { tryParse } from "@/types/result";
import { fromPromise } from "neverthrow";
import { toast } from "sonner";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { parseElectronError } from "@/renderer/utils/parse-error";

export const useLoadApp = () => {
  const loadProject = useLoadProject();

  const setShowWelcomeScreen = useAppStore(
    useShallow((state) => state.setShowWelcomeScreen),
  );

  const openFilePicker = async () => {
    const res = await fromPromise(window.api.openFilePicker(), (e) =>
      parseElectronError((e as Error).message),
    );
    if (res.isErr()) {
      toast.error("Failed to open file", { description: res.error });
      return;
    }
    if (res.value === undefined) {
      return;
    }
    const { fileContent, filePath } = res.value;
    const loadRes = tryParse(Project)(JSON.parse(fileContent))
      .andThen((proj) => loadProject(proj, filePath))
      .map(() => setShowWelcomeScreen(false));

    if (loadRes.isOk()) {
      return;
    }

    if (loadRes.error instanceof ZodError) {
      toast.error("Project validation error", {
        description: fromZodError(loadRes.error).toString(),
      });
    } else {
      toast.error("Error loading project", {
        description: loadRes.error.message,
      });
    }
  };

  return openFilePicker;
};
