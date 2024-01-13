import { useAtomValue, useAtom } from "jotai";
import { toast } from "sonner";
import { useFlowChartGraph } from "./useFlowChartGraph";
import { projectAtom, projectPathAtom } from "./useFlowChartState";
import { useHasUnsavedChanges } from "./useHasUnsavedChanges";
import { makeAppFileContent, saveFileAs } from "@src/lib/save";
import { sendEventToMix } from "@src/services/MixpanelServices";
import { useAuth } from "../context/auth.context";
import { authenticate } from "../services/auth-service";

export const useSave = () => {
  const { user } = useAuth();
  const { nodes, edges, textNodes } = useFlowChartGraph();
  const { setHasUnsavedChanges } = useHasUnsavedChanges();
  const project = useAtomValue(projectAtom);
  const [projectPath, setProjectPath] = useAtom(projectPathAtom);

  const handleSave = async () => {
    try {
      authenticate(user);

      if (projectPath && "api" in window) {
        sendEventToMix("Saving Project");
        const fileContent = makeAppFileContent(
          project,
          nodes,
          edges,
          textNodes,
        );
        window.api.saveFile(projectPath, fileContent);

        toast.success("App saved!");
        setHasUnsavedChanges(false);
        return;
      }
      try {
        const path = await saveFileAs(project, nodes, edges, textNodes);
        setProjectPath(path);

        const message = path
          ? `Saved app to ${path}!`
          : "Saved app successfully!";
        toast.success(message);
        setHasUnsavedChanges(false);
      } catch {
        // exception just means user cancelled save
      }
    } catch (error) {
      //
    }
  };

  return handleSave;
};
