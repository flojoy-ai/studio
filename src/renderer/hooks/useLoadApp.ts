import { useSocket } from "@/renderer/hooks/useSocket";
import { sendEventToMix } from "@/renderer/services/MixpanelServices";
import { useProjectStore } from "@/renderer/stores/project";
import { useMetadata, useManifest } from "@/renderer/stores/manifest";
import { useAppStore } from "@/renderer/stores/app";
import { toast } from "sonner";
import { Project } from "@/renderer/types/project";

import { useShallow } from "zustand/react/shallow";

export const useLoadApp = () => {
  const loadProject = useProjectStore(useShallow((state) => state.loadProject));

  const { resetProgramResults } = useSocket();

  const setShowWelcomeScreen = useAppStore(
    useShallow((state) => state.setShowWelcomeScreen),
  );

  const manifest = useManifest();
  const metadata = useMetadata();

  const openFilePicker = () => {
    window.api
      .openFilePicker()
      .then((result) => {
        if (!result) return;
        if (!manifest || !metadata) {
          toast.error(
            "Manifest and metadata are still loading, can't load app yet.",
          );
          return;
        }

        const { fileContent, filePath } = result;
        sendEventToMix("Selected Files");
        const project = JSON.parse(fileContent) as Project;

        loadProject(project, manifest, metadata, filePath);

        resetProgramResults();
        setShowWelcomeScreen(false);
      })
      .catch((errors) => {
        console.error("Errors when trying to load file: ", errors);
      });
  };

  return openFilePicker;
};
