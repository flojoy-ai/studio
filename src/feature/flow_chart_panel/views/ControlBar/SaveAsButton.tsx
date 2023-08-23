import { MenubarItem } from "@/components/ui/menubar";
import { useControlsState } from "@src/hooks/useControlsState";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { ElementsData } from "@src/types";
import saveAs from "file-saver";
import { Edge, Node, ReactFlowJsonObject } from "reactflow";

export const SaveAsButton = () => {
  const { nodes, textNodes, edges } = useFlowChartGraph();

  const { rfInstance } = useFlowChartState();

  const { ctrlsManifest } = useControlsState();

  const saveAsDisabled = !("showSaveFilePicker" in window);

  const createFileBlob = (
    rf: ReactFlowJsonObject<ElementsData>,
    nodes: Node<ElementsData>[],
    edges: Edge[],
  ) => {
    const updatedRf = {
      ...rf,
      nodes,
      edges,
    };

    const fileContent = {
      rfInstance: updatedRf,
      ctrlsManifest,
      textNodes,
    };

    const fileContentJsonString = JSON.stringify(fileContent, undefined, 4);

    return new Blob([fileContentJsonString]);
  };

  const saveFileAs = async (nodes: Node<ElementsData>[], edges: Edge[]) => {
    if (rfInstance) {
      const blob = createFileBlob(rfInstance, nodes, edges);
      saveAs(blob, "app.json");
    }
  };

  return (
    <MenubarItem
      data-cy="btn-saveas"
      disabled={saveAsDisabled}
      onClick={() => saveFileAs(nodes, edges)}
    >
      Save As
    </MenubarItem>
  );
};
