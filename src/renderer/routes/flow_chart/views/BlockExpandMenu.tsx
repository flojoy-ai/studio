import { BlockResult } from "@/renderer/routes/common/types/ResultsType";
import { Node } from "reactflow";
import { BlockData } from "@/renderer/types";
import BlockModal from "./BlockModal";

type BlockExpandMenuProps = {
  modalIsOpen: boolean;
  setModalOpen: (open: boolean) => void;
  blockResults: Record<string, BlockResult>;
  selectedNode: Node<BlockData> | null;
  pythonString: string;
  blockFilePath: string;
  blockFullPath: string;
};

export const BlockExpandMenu = ({
  blockResults,
  ...props
}: BlockExpandMenuProps) => {
  const { selectedNode } = props;
  // const onSelectionChange = () => {
  //   if (!selectedNode) {
  //     setIsExpandMode(false);
  //   }
  // };

  // useOnSelectionChange({ onChange: onSelectionChange });

  return (
    <div className="relative" data-testid="node-modal">
      {selectedNode && (
        <BlockModal
          {...props}
          nd={blockResults[selectedNode.id] ?? null}
          selectedNode={selectedNode}
          data-testid="expand-menu"
        />
      )}
    </div>
  );
};
