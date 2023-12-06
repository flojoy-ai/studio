import type { CustomNodeProps } from "./types/nodeProps";
import { memo } from "react";
import NodeWrapper from "./components/NodeWrapper";
import HandleComponent from "./components/HandleComponent";
import { textWrap } from "@/utils/textWrap";

const DataNode = ({ data }: CustomNodeProps) => {
  return (
    <NodeWrapper>
      <div
        className="flex min-h-[96px] items-center justify-center rounded-full border-2 border-solid border-accent2 p-2"
        style={{
          width: textWrap(208, 24, data.label),
        }}
      >
        <h2 className="m-0 text-center font-sans text-2xl font-extrabold tracking-wider text-accent2">
          {data.label}
        </h2>
        <HandleComponent data={data} variant="accent2" />
      </div>
    </NodeWrapper>
  );
};

export default memo(DataNode);
