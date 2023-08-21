import { MenubarItem } from "@/components/ui/menubar";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import {
  Project,
  projectAtom,
  projectPathAtom,
} from "@src/hooks/useFlowChartState";
import { useHasUnsavedChanges } from "@src/hooks/useHasUnsavedChanges";
import { ElementsData } from "@src/types";
import saveAs from "file-saver";
import { useAtom } from "jotai";
import { Edge, Node } from "reactflow";
import { toast } from "sonner";

const getFileContent = (
  project: Project,
  nodes: Node<ElementsData>[],
  edges: Edge[],
) => {
  const fileContent = {
    ...project,
    rfInstance: {
      ...project.rfInstance,
      nodes,
      edges,
    },
  };
  return JSON.stringify(fileContent, undefined, 4);
};

const saveFileAs = async (
  project: Project,
  nodes: Node<ElementsData>[],
  edges: Edge[],
): Promise<string | undefined> => {
  if (!project.rfInstance) {
    throw new Error("Could not find flow chart instance to save");
  }

  const fileContent = getFileContent(project, nodes, edges);

  // in electron
  if ("api" in window) {
    const path = await window.api.saveFileAs(fileContent);
    return path;
  }

  const blob = new Blob([fileContent]);
  saveAs(blob, "app.json");
};

export const SaveButton = () => {
  const { nodes, edges } = useFlowChartGraph();
  const { setHasUnsavedChanges } = useHasUnsavedChanges();
  const [project] = useAtom(projectAtom);
  const [projectPath, setProjectPath] = useAtom(projectPathAtom);

  const handleSave = async () => {
    if (projectPath && "api" in window) {
      const fileContent = getFileContent(project, nodes, edges);
      window.api.saveFile(projectPath, fileContent);

      toast.success("App saved!");
    } else {
      const path = await saveFileAs(project, nodes, edges);
      setProjectPath(path);

      const message = path
        ? `Saved app to ${path}!`
        : "Saved app successfully!";
      toast.success(message);
    }
    setHasUnsavedChanges(false);
  };

  return (
    <MenubarItem data-cy="btn-save" onClick={handleSave}>
      Save
    </MenubarItem>
  );
};

export const SaveAsButton = () => {
  const { nodes, edges } = useFlowChartGraph();
  const { setHasUnsavedChanges } = useHasUnsavedChanges();
  const [, setProjectPath] = useAtom(projectPathAtom);

  const [project] = useAtom(projectAtom);

  const handleSave = async () => {
    const path = await saveFileAs(project, nodes, edges);

    setProjectPath(path);
    setHasUnsavedChanges(false);

    const message = path ? `Saved app to ${path}!` : "Saved app successfully!";
    toast.success(message);
  };

  return (
    <MenubarItem data-cy="btn-saveas" onClick={handleSave}>
      Save As
    </MenubarItem>
  );
};
