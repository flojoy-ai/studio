import { memo } from "react";
import clsx from "clsx";
import { CustomNodeProps } from "@src/types/node";
import NodeWrapper from "@/components/common/NodeWrapper";
import HandleComponent from "@/components/common/HandleComponent";

const DataNode = (props: CustomNodeProps) => {
  const {
    nodeProps: { data },
    isRunning,
    nodeError,
  } = props;
  return (
    <NodeWrapper wrapperProps={props}>
      <div
        className={clsx(
          "flex h-24 w-52 items-center justify-center rounded-full border-2 border-solid border-accent2",
          { "shadow-around shadow-accent2": isRunning || data.selected },
          { "shadow-around shadow-red-700": nodeError }
        )}
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
