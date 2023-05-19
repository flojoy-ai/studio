import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { ElementsData } from "../types/CustomNodeProps";
import { Node, useOnSelectionChange } from "reactflow";
import { useEffect } from "react";
import NodeModal from "./NodeModal";
import { Box } from "@mantine/core";
import { ResultIO } from "@src/feature/results_panel/types/ResultsType";
import { useFlowChartTabState } from "../FlowChartTabState";
import PYTHON_FUNCTIONS from "../manifest/pythonFunctions.json";

type NodeExpandMenuProps = {
  modalIsOpen: boolean;
  closeModal: () => void;
  nodeLabel: any;
  nodeType: any;
  nd: ResultIO;
  defaultLayout: any;
  clickedElement: Node<ElementsData> | null;
  pythonString: string;
};

export const NodeExpandMenu = ({
  closeModal,
  nodeLabel,
  nodeType,
  nd,
  defaultLayout,
  clickedElement,
  pythonString,
}: NodeExpandMenuProps) => {
  const { isExpandMode, setIsExpandMode } = useFlowChartState();

  const canEditNode = clickedElement
    ? Object.keys(clickedElement.data.ctrls).length > 0
    : false;

  const onSelectionChange = () => {
    if (!clickedElement || !canEditNode) {
      setIsExpandMode(false);
    }
  };

  useOnSelectionChange({ onChange: onSelectionChange });

  return (
    <Box pos="relative" data-testid="node-modal">
      {clickedElement && canEditNode && isExpandMode && (
        <NodeModal
          modalIsOpen={isExpandMode}
          closeModal={closeModal}
          nodeLabel={nodeLabel}
          nodeType={nodeType}
          nd={nd!}
          defaultLayout={defaultLayout}
          clickedElement={clickedElement}
          pythonString={pythonString}
        />
      )}
    </Box>
  );
};
