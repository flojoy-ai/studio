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
          "flex h-24 w-52 items-center justify-center rounded-full border-2 border-accent2",
          data.id === runningNode || data.selected
            ? "shadow-around shadow-accent2"
            : "",
          data.id === failedNode ? "shadow-around shadow-red-700" : ""
        )}
      >
        <h2 className="font-sans text-2xl font-extrabold tracking-wider text-accent2">
          {data.label}
        </h2>
        <HandleComponent data={data} colorClass="!border-accent2" />
      </div>
    </NodeWrapper>
  );
};

export default memo(DataNode);
