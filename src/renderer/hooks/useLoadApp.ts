import { useFlowChartGraph } from "@/renderer/hooks/useFlowChartGraph";
import { useSocket } from "@/renderer/hooks/useSocket";
import { useSetAtom } from "jotai";
import {
  projectAtom,
  projectPathAtom,
  showWelcomeScreenAtom,
} from "@/renderer/hooks/useFlowChartState";
import { useHasUnsavedChanges } from "@/renderer/hooks/useHasUnsavedChanges";
import { sendEventToMix } from "@/renderer/services/MixpanelServices";

export const useLoadApp = () => {
  const { loadFlowExportObject } = useFlowChartGraph();
  const {
    states: { setProgramResults },
  } = useSocket();
  const setProject = useSetAtom(projectAtom);
  const setProjectPath = useSetAtom(projectPathAtom);
  const { setHasUnsavedChanges } = useHasUnsavedChanges();
  const setShowWelcomeScreen = useSetAtom(showWelcomeScreenAtom);

  const openFilePicker = () => {
    window.api
      .openFilePicker()
      .then((result) => {
        if (!result) return;
        const { fileContent, filePath } = result;
        sendEventToMix("Selected Files");
        const parsedFileContent = JSON.parse(fileContent);
        const flow = parsedFileContent.rfInstance;
        setProject(parsedFileContent);
        setProjectPath(filePath);
        setHasUnsavedChanges(false);
        const textNodes = parsedFileContent.textNodes;
        loadFlowExportObject(flow, textNodes);
        setProgramResults([]);
        setShowWelcomeScreen(false);
      })
      .catch((errors) => {
        console.error("Errors when trying to load file: ", errors);
      });
  };

  return openFilePicker;
};
