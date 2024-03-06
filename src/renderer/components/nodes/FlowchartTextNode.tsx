import { useProjectStore } from "@/renderer/stores/project";
import { TextData } from "@/renderer/types/block";
import { NodeProps } from "reactflow";
import TextNode from "@/renderer/components/common/TextNode";
import { useShallow } from "zustand/react/shallow";

const FlowchartTextNode = (props: NodeProps<TextData>) => {
  const { deleteTextNode, updateTextNodeText } = useProjectStore(
    useShallow((state) => ({
      deleteTextNode: state.deleteControlTextNode,
      updateTextNodeText: state.updateControlTextNodeText,
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
