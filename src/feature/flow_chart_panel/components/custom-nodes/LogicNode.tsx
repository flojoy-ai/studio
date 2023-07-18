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

  return (
    <NodeWrapper data={data} handleRemove={handleRemove}>
      <div
        className={clsx(
          "w-24 h-24 border-2 border-accent3 rounded-xl flex justify-center items-center bg-accent3/5 rotate-45",
          data.id === runningNode || data.selected
            ? "shadow-around shadow-accent3"
            : "",
          data.id === failedNode ? "shadow-around shadow-red-700" : ""
        )}
      >
        {children ?? (
          <>
            <h2 className="font-sans font-extrabold text-2xl tracking-wider text-accent3 -rotate-45">
              {data.label}
            </h2>
            <CustomHandle
              position={Position.Bottom}
              type="target"
              id={data.inputs?.[0].id}
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
