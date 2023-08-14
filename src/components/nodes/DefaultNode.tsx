import { memo } from "react";
import clsx from "clsx";
import { CustomNodeProps } from "@/types/node";
import NodeWrapper from "@/components/common/NodeWrapper";
import HandleComponent from "@/components/common/HandleComponent";

const DefaultNode = (props: CustomNodeProps) => {
  const {
    nodeProps: { data },
    height,
    width,
    isRunning = false,
    nodeError = null,
    children,
  } = props;

  return (
    <NodeWrapper wrapperProps={props}>
      <div
        className={clsx(
          "flex h-40 w-40 items-center justify-center rounded-2xl border-2 border-solid border-accent1 bg-accent1/5",
          { "shadow-around shadow-accent1": isRunning || data.selected },
          { "shadow-around shadow-red-700": nodeError }
        )}
        style={{
          width,
          height,
        }}
      >
        {children ?? (
          <h2 className="m-0 text-center font-sans text-2xl font-extrabold tracking-wider text-accent1">
            {data.label}
          </h2>
        )}
        <HandleComponent data={data} variant="accent1" />
      </div>
    </NodeWrapper>
  );
};

export default memo(DefaultNode);
