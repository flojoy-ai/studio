import { MenubarItem } from "@/components/ui/menubar";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import {
  Project,
  projectAtom,
  unsavedChangesAtom,
} from "@src/hooks/useFlowChartState";
import { ElementsData } from "@src/types";
import saveAs from "file-saver";
import { useAtom } from "jotai";
import { Edge, Node } from "reactflow";

const createFileBlob = (
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

  const str = JSON.stringify(fileContent, undefined, 4);

  return new Blob([str]);
};

const saveFileAs = async (
  project: Project,
  nodes: Node<ElementsData>[],
  edges: Edge[],
) => {
  if (!project.rfInstance) {
    throw new Error("Could not find flow chart instance to save");
  }

  const blob = createFileBlob(project, nodes, edges);
  saveAs(blob, "app.json");
};

export const SaveButton = () => {
  const { nodes, edges } = useFlowChartGraph();
  const [, setHasUnsavedChanges] = useAtom(unsavedChangesAtom);
  const [project, setProject] = useAtom(projectAtom);
  console.log(project);

  const handleSave = () => {
    if (!window.api.fileExists(project.path)) {
      saveFileAs(project, nodes, edges);
      setProject((prev) => (prev.path = project.path));
      setHasUnsavedChanges(false);
    } else {
      window.api.saveFile(project.path, JSON.stringify(project));
    }
  };

  return (
    <MenubarItem data-cy="btn-save" onClick={handleSave}>
      Save
    </MenubarItem>
  );
};

export const SaveAsButton = () => {
  const { nodes, edges } = useFlowChartGraph();
  const [, setHasUnsavedChanges] = useAtom(unsavedChangesAtom);

  const [project] = useAtom(projectAtom);

  const handleSave = () => {
    saveFileAs(project, nodes, edges);
    setHasUnsavedChanges(false);
  };

  return (
    <MenubarItem data-cy="btn-saveas" onClick={handleSave}>
      Save As
    </MenubarItem>
  );
};
