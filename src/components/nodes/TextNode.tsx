import { memo } from "react";
import { Input } from "../ui/input";
import { textNodesAtom } from "@src/hooks/useFlowChartGraph";
import { useSetAtom } from "jotai";
import { useNodeId } from "reactflow";

type TextNodeProps = {
  data: {
    text: string;
  };
};

const TextNode = ({ data }: TextNodeProps) => {
  const setTextNodes = useSetAtom(textNodesAtom);
  const nodeId = useNodeId();

  const handleChange = (e) => {
    console.log(e.target.value);
    setTextNodes((prev) =>
      prev.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              data: {
                ...n.data,
                text: e.target.value,
              },
            }
          : n,
      ),
    );
  };

  return (
    <div className="h-60 w-60 border-accent1">
      <Input
        className="text-center"
        placeholder="Enter text here"
        value={data.text}
        onChange={handleChange}
      />
    </div>
  );
};

export default memo(TextNode);
