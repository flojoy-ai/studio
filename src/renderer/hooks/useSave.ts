import { useAtomValue, useAtom } from "jotai";
import { toast } from "sonner";
import { useFlowChartGraph } from "./useFlowChartGraph";
import { projectAtom, projectPathAtom } from "./useFlowChartState";
import { makeAppFileContent, saveFileAs } from "@/renderer/lib/save";
import { sendEventToMix } from "@/renderer/services/MixpanelServices";
import useWithPermission from "./useWithPermission";
import { useFlowchartStore } from "../stores/flowchart";

export const useSave = () => {
  const { withPermissionCheck } = useWithPermission();
  const { nodes, edges, textNodes } = useFlowChartGraph();

  const resetHasUnsavedChanges = useFlowchartStore(
    (state) => state.resetHasUnsavedChanges,
  );

  const project = useAtomValue(projectAtom);
  const [projectPath, setProjectPath] = useAtom(projectPathAtom);

  const handleSave = async () => {
    if (projectPath && "api" in window) {
      sendEventToMix("Saving Project");
      const fileContent = makeAppFileContent(project, nodes, edges, textNodes);
      window.api.saveFile(projectPath, fileContent);

      toast.success("App saved!");
      resetHasUnsavedChanges();
      return;
    }
    try {
      const path = await saveFileAs(project, nodes, edges, textNodes);
      setProjectPath(path);

      const message = path
        ? `Saved app to ${path}!`
        : "Saved app successfully!";
      toast.success(message);
      resetHasUnsavedChanges();
    } catch {
      // exception just means user cancelled save
    }
  };

  return withPermissionCheck(handleSave);
};
