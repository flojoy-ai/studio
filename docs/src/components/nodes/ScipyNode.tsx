import { memo } from "react";
import NodeWrapper from "./components/NodeWrapper";
import { type CustomNodeProps } from "./types/nodeProps";
import { ScipySvg } from "./assets/ArithmeticSVG";
import HandleComponent from "./components/HandleComponent";

const NumpyNode = ({ data }: CustomNodeProps) => {
  return (
    <NodeWrapper>
      <div className="flex h-40 w-60 items-center justify-center rounded-2xl border-2 border-solid border-blue-500 bg-accent1/5">
        <div className="flex flex-col items-center">
          <ScipySvg className="h-16 w-16" />
          <h2 className="m-0 text-center font-sans text-2xl tracking-wider text-blue-500">
            <span>sp.</span>
            <span className="font-extrabold">{data.label}</span>
          </h2>
        </div>
        <HandleComponent data={data} variant="blue" />
      </div>
    </NodeWrapper>
  );
};

export default memo(NumpyNode);
