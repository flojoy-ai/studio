import { memo } from "react";
import { CustomNodeProps } from "../../types/CustomNodeProps";
import HandleComponent from "../HandleComponent";
import NodeWrapper from "../NodeWrapper";
import { nodeStatusAtom } from "@src/hooks/useFlowChartState";
import { useAtom } from "jotai";
import clsx from "clsx";

const DataNode = ({ data, handleRemove }: CustomNodeProps) => {
  const [{ runningNode, failedNode }] = useAtom(nodeStatusAtom);

  return (
    <NodeWrapper data={data} handleRemove={handleRemove}>
      <div
        className={clsx(
          "w-52 h-24 border-2 border-accent2 rounded-full flex justify-center items-center",
          data.id === runningNode || data.selected
            ? "shadow-around shadow-accent2"
            : "",
          data.id === failedNode ? "shadow-around shadow-red-700" : ""
        )}
      >
        <h2 className="font-sans font-extrabold text-2xl tracking-wider text-accent2">
          {data.label}
        </h2>
        <HandleComponent data={data} colorClass="!border-accent2" />
      </div>
    </NodeWrapper>
  );
};

export default memo(DataNode);
