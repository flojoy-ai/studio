import { memo } from "react";
import { CustomNodeProps } from "../../types/CustomNodeProps";
import NodeWrapper from "../NodeWrapper";
import { nodeStatusAtom } from "@src/hooks/useFlowChartState";
import { useAtom } from "jotai";
import clsx from "clsx";
import { CustomHandle } from "../CustomHandle";
import { Position } from "reactflow";

const LogicNode = ({
  data,
  handleRemove,
  children,
}: CustomNodeProps & { children?: React.ReactNode }) => {
  const [{ runningNode, failedNode }] = useAtom(nodeStatusAtom);

  const input = data.inputs?.[0];
  if (!input) {
    throw new Error("Logic node must have an input");
  }

  return (
    <NodeWrapper data={data} handleRemove={handleRemove}>
      <div
        className={clsx(
          "flex h-24 w-24 rotate-45 items-center justify-center rounded-xl border-2 border-accent3 bg-accent3/5",
          data.id === runningNode || data.selected
            ? "shadow-around shadow-accent3"
            : "",
          data.id === failedNode ? "shadow-around shadow-red-700" : ""
        )}
      >
        {children ?? (
          <>
            <h2 className="-rotate-45 font-sans text-2xl font-extrabold tracking-wider text-accent3">
              {data.label}
            </h2>
            <CustomHandle
              position={Position.Bottom}
              type="target"
              param={input}
              colorClass="!border-accent3"
              style={{ left: 3, bottom: -3 }}
            />
          </>
        )}
      </div>
    </NodeWrapper>
  );
};

export default memo(LogicNode);
