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
          "flex h-40 w-40 items-center justify-center rounded-2xl border-2 border-accent1 bg-accent1/5",
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
          <h2 className="font-sans text-2xl font-extrabold tracking-wider text-accent1">
            {data.label}
          </h2>
        )}
        <HandleComponent data={data} colorClass="!border-accent1" />
      </div>
    </NodeWrapper>
  );
};

export default memo(ETLNode);
