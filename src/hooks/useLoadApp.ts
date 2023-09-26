import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import { useSocket } from "@src/hooks/useSocket";
import { useFilePicker } from "use-file-picker";
import { useSetAtom } from "jotai";
import {
  projectAtom,
  projectPathAtom,
  showWelcomeScreenAtom,
  useFlowChartState,
} from "@src/hooks/useFlowChartState";
import { useHasUnsavedChanges } from "@src/hooks/useHasUnsavedChanges";
import { sendEventToMix } from "@src/services/MixpanelServices";

export const useLoadApp = () => {
  const { loadFlowExportObject } = useFlowChartGraph();
  const { isMicrocontrollerMode } = useFlowChartState();
  const {
    states: { setProgramResults },
  } = useSocket();
  const setProject = useSetAtom(projectAtom);
  const setProjectPath = useSetAtom(projectPathAtom);
  const { setHasUnsavedChanges } = useHasUnsavedChanges();
  const setShowWelcomeScreen = useSetAtom(showWelcomeScreenAtom);

  const [openFileSelector] = useFilePicker({
    readAs: "Text",
    accept: (isMicrocontrollerMode) ? [".fjm"] : [".json"],
    maxFileSize: 50,
    onFilesRejected: ({ errors }) => {
      console.error("Errors when trying to load file: ", errors);
    },
    onFilesSuccessfulySelected: ({ plainFiles, filesContent }) => {
      sendEventToMix("Selected Files", "");
      const path = plainFiles[0].path;
      // Just pick the first file that was selected
      const parsedFileContent = JSON.parse(filesContent[0].content);
      const flow = parsedFileContent.rfInstance;
      setProject(parsedFileContent);
      setProjectPath(path);
      setHasUnsavedChanges(false);
      const textNodes = parsedFileContent.textNodes;
      loadFlowExportObject(flow, textNodes);
      setProgramResults([]);
      setShowWelcomeScreen(false);
    },
  });

  return openFileSelector;
};
