import { useSocket } from "@/renderer/hooks/useSocket";
import { useSetAtom } from "jotai";
import { showWelcomeScreenAtom } from "@/renderer/hooks/useFlowChartState";
import { sendEventToMix } from "@/renderer/services/MixpanelServices";
import { useProjectStore } from "../stores/project";
import { useFullManifest, useFullMetadata } from "./useManifest";
import { toast } from "sonner";

export const useLoadApp = () => {
  const loadProject = useProjectStore((state) => state.loadProject);

  const { resetProgramResults } = useSocket();
  const setShowWelcomeScreen = useSetAtom(showWelcomeScreenAtom);

  const manifest = useFullManifest();
  const metadata = useFullMetadata();

  const openFilePicker = () => {
    window.api
      .openFilePicker()
      .then((result) => {
        if (!result) return;
        if (!manifest || !metadata) {
          toast.error(
            "Manifest and metadata are still loading, can't load app yet.",
          );
        }

        const { fileContent, filePath } = result;
        sendEventToMix("Selected Files");
        const project = JSON.parse(fileContent);

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
