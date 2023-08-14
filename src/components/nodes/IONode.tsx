import { memo } from "react";
import clsx from "clsx";
import { CustomNodeProps } from "@src/types/node";
import NodeWrapper from "@/components/common/NodeWrapper";
import { DodecahedronSVG } from "@/assets/DodecahedronSVG";
import HandleComponent from "@/components/common/HandleComponent";

const IONode = (props: CustomNodeProps) => {
  const {
    isRunning,
    nodeProps: { data },
    nodeError,
  } = props;

  return (
    <NodeWrapper wrapperProps={props}>
      <div
        className={clsx(
          "flex h-48 w-48 flex-col items-center",
          { "shadow-around shadow-accent4": isRunning || data.selected },
          { "shadow-around shadow-red-700": nodeError }
        )}
      >
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
