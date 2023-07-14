import { useMantineTheme } from "@mantine/core";
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
          "w-48 h-48 flex flex-col items-center",
          data.id === runningNode || data.selected
            ? "shadow-around shadow-accent4"
            : "",
          data.id === failedNode ? "shadow-around shadow-red-700" : ""
        )}
      >
        <DodecahedronSVG />
        <h2 className="font-sans font-extrabold text-2xl tracking-wider text-accent4">
          {data.label}
        </h2>
        <HandleComponent
          data={data}
          className="!border-accent4 !bg-white dark:!bg-black"
        />
      </div>
    </NodeWrapper>
  );
};

export default memo(IONode);
