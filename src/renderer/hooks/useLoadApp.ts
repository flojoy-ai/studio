import { useFlowChartGraph } from "@/renderer/hooks/useFlowChartGraph";
import { useSocket } from "@/renderer/hooks/useSocket";
import { useSetAtom } from "jotai";
import {
  projectAtom,
  projectPathAtom,
  showWelcomeScreenAtom,
} from "@/renderer/hooks/useFlowChartState";
import { sendEventToMix } from "@/renderer/services/MixpanelServices";
import { useFlowchartStore } from "../stores/flowchart";

export const useLoadApp = () => {
  const { loadFlowExportObject } = useFlowChartGraph();
  const { resetProgramResults } = useSocket();
  const setProject = useSetAtom(projectAtom);
  const setProjectPath = useSetAtom(projectPathAtom);
  const resetHasUnsavedChanges = useFlowchartStore(
    (state) => state.resetHasUnsavedChanges,
  );
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
        resetHasUnsavedChanges();

        const textNodes = parsedFileContent.textNodes;
        loadFlowExportObject(flow, textNodes);
        resetProgramResults();
        setShowWelcomeScreen(false);
      })
      .catch((errors) => {
        console.error("Errors when trying to load file: ", errors);
      });
  };

  return openFilePicker;
};
