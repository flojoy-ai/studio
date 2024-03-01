import { sendEventToMix } from "@/renderer/services/MixpanelServices";
import { useMetadata, useManifest } from "@/renderer/stores/manifest";
import { useAppStore } from "@/renderer/stores/app";
import { toast } from "sonner";
import { Project } from "@/renderer/types/project";

import { useShallow } from "zustand/react/shallow";
import { useLoadProject } from "@/renderer/stores/project";

export const useLoadApp = () => {
  const loadProject = useLoadProject();

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

        loadProject(project, filePath);
        setShowWelcomeScreen(false);
      })
      .catch((errors) => {
        console.error("Errors when trying to load file: ", errors);
      });
  };

  return openFilePicker;
};
