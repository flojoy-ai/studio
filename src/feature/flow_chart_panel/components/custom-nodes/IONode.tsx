import { memo } from "react";
import { CustomNodeProps } from "../../types/CustomNodeProps";
import HandleComponent from "../HandleComponent";
import NodeWrapper from "../NodeWrapper";
import { nodeStatusAtom } from "@src/hooks/useFlowChartState";
import { useAtom } from "jotai";
import clsx from "clsx";
import { DodecahedronSVG } from "@src/assets/DodecahedronSVG";

const IONode = ({ data, handleRemove }: CustomNodeProps) => {
  const [{ runningNode, failedNode }] = useAtom(nodeStatusAtom);

  return (
    <NodeWrapper data={data} handleRemove={handleRemove}>
      <div
        className={clsx(
          "flex w-48 flex-col items-center overflow-auto",
          data.id === runningNode || data.selected
            ? "shadow-around shadow-accent4"
            : "",
          data.id === failedNode ? "shadow-around shadow-red-700" : ""
        )}
      >
        <DodecahedronSVG />
        <h2 className="text-center font-sans text-2xl font-extrabold tracking-wider text-accent4">
          {data.label}
        </h2>
        <HandleComponent data={data} colorClass="!border-accent4" />
      </div>
    </NodeWrapper>
  );
};

export default memo(IONode);
