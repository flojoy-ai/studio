import { Node } from "reactflow";
import { BlockData } from "@/renderer/types/block";
import BlockModal from "./BlockModal";

type BlockExpandMenuProps = {
  modalIsOpen: boolean;
  setModalOpen: (open: boolean) => void;
  selectedNode: Node<BlockData> | null;
  pythonString: string;
  blockFilePath: string;
  blockFullPath: string;
};

export const BlockExpandMenu = ({ ...props }: BlockExpandMenuProps) => {
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
          selectedNode={selectedNode}
          data-testid="expand-menu"
        />
      )}
    </div>
  );
};
