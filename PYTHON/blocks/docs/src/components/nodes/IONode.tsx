import { memo } from "react";
import { type CustomNodeProps } from "./types/nodeProps";
import NodeWrapper from "./components/NodeWrapper";
import { DodecahedronSVG } from "./assets/DodecahedronSVG";
import HandleComponent from "./components/HandleComponent";

const IONode = ({ data }: CustomNodeProps) => {
  return (
    <NodeWrapper>
      <div className="flex h-48 w-48 flex-col items-center">
        <DodecahedronSVG />
        <h2 className="m-0 text-center font-sans text-2xl font-extrabold tracking-wider text-accent4">
          {data.label}
        </h2>
        <HandleComponent data={data} variant="accent4" />
      </div>
    </NodeWrapper>
  );
};

export default memo(IONode);
