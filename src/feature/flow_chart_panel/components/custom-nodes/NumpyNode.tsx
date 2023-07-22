import { memo } from "react";
import { CustomNodeProps } from "../../types/CustomNodeProps";
import HandleComponent from "../HandleComponent";
import NodeWrapper from "../NodeWrapper";
import { nodeStatusAtom } from "@src/hooks/useFlowChartState";
import { useAtom } from "jotai";
import clsx from "clsx";
import { NumpySvg } from "@src/assets/ArithmeticSVG";

const NumpyNode = ({ data, handleRemove }: CustomNodeProps) => {
  const [{ runningNode, failedNode }] = useAtom(nodeStatusAtom);

  return (
    <NodeWrapper data={data} handleRemove={handleRemove}>
      <div
        className={clsx(
          "flex h-40 w-60 items-center justify-center rounded-2xl border-2 border-blue-500 bg-accent1/5",
          data.id === runningNode || data.selected
            ? "shadow-around shadow-blue-500"
            : "",
          data.id === failedNode ? "shadow-around shadow-red-700" : ""
        )}
      >
        <div className="flex flex-col items-center">
          <NumpySvg className="h-16 w-16" />
          <h2 className="font-sans text-2xl tracking-wider text-blue-500">
            <span>np.</span>
            <span className="font-extrabold">{data.label}</span>
          </h2>
        </div>
        <HandleComponent data={data} colorClass="!border-blue-500" />
      </div>
    </NodeWrapper>
  );
};

export default memo(NumpyNode);
