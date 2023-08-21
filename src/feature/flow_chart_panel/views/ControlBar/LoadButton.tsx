import { MenubarItem } from "@/components/ui/menubar";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import { useSocket } from "@src/hooks/useSocket";
import { useFilePicker } from "use-file-picker";
import { useAtom } from "jotai";
import { projectAtom, projectPathAtom } from "@src/hooks/useFlowChartState";
import { useHasUnsavedChanges } from "@src/hooks/useHasUnsavedChanges";

export const LoadButton = () => {
  const { loadFlowExportObject } = useFlowChartGraph();
  const {
    states: { setProgramResults },
  } = useSocket();
  const [, setProject] = useAtom(projectAtom);
  const [, setProjectPath] = useAtom(projectPathAtom);
  const { setHasUnsavedChanges } = useHasUnsavedChanges();

  const [openFileSelector] = useFilePicker({
    readAs: "Text",
    accept: [".json"],
    maxFileSize: 50,
    onFilesRejected: ({ errors }) => {
      console.error("Errors when trying to load file: ", errors);
    },
    onFilesSuccessfulySelected: ({ plainFiles, filesContent }) => {
      const path = plainFiles[0].path;
      // Just pick the first file that was selected
      const parsedFileContent = JSON.parse(filesContent[0].content);
      const flow = parsedFileContent.rfInstance;
      setProject(parsedFileContent);
      setProjectPath(path);
      setHasUnsavedChanges(false);
      loadFlowExportObject(flow);
      setProgramResults([]);
    },
  });

  return (
    <MenubarItem onClick={openFileSelector} id="load-app-btn">
      Load
    </MenubarItem>
  );
};
