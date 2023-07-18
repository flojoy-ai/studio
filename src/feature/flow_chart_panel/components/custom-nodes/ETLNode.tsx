import { memo } from "react";
import { CustomNodeProps } from "../../types/CustomNodeProps";
import HandleComponent from "../HandleComponent";
import NodeWrapper from "../NodeWrapper";
import { nodeStatusAtom } from "@src/hooks/useFlowChartState";
import { useAtom } from "jotai";
import clsx from "clsx";

const ETLNode = ({
  data,
  width,
  height,
  handleRemove,
  children,
}: CustomNodeProps & {
  children?: React.ReactNode;
  width?: number;
  height?: number;
}) => {
  const [{ runningNode, failedNode }] = useAtom(nodeStatusAtom);

  return (
    <NodeWrapper data={data} handleRemove={handleRemove}>
      <div
        className={clsx(
          "w-40 h-40 border-2 border-accent1 rounded-2xl flex justify-center items-center bg-accent1/5",
          data.id === runningNode || data.selected
            ? "shadow-around shadow-accent1"
            : "",
          data.id === failedNode ? "shadow-around shadow-red-700" : ""
        )}
        style={{
          width,
          height,
        }}
      >
        {children ?? (
          <h2 className="font-sans font-extrabold text-2xl tracking-wider text-accent1">
            {data.label}
          </h2>
        )}
        <HandleComponent data={data} colorClass="!border-accent1" />
      </div>
    </NodeWrapper>
  );
};

export default memo(ETLNode);
