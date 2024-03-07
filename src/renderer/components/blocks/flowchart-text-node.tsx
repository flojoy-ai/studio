import { useProjectStore } from "@/renderer/stores/project";
import { TextData } from "@/renderer/types/block";
import { NodeProps } from "reactflow";
import TextNode from "@/renderer/components/common/text-node";
import { useShallow } from "zustand/react/shallow";

const FlowchartTextNode = (props: NodeProps<TextData>) => {
  const { deleteTextNode, updateTextNodeText } = useProjectStore(
    useShallow((state) => ({
      deleteTextNode: state.deleteTextNode,
      updateTextNodeText: state.updateTextNodeText,
    })),
  );

  return (
    <TextNode
      {...props}
      deleteTextNode={deleteTextNode}
      updateTextNodeText={updateTextNodeText}
    />
  );
};

export default FlowchartTextNode;
