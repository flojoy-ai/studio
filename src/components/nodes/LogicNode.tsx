import { memo } from "react";
import clsx from "clsx";
import { CustomNodeProps } from "@src/types/node";
import NodeWrapper from "@/components/common/NodeWrapper";
import { LogicHandleComponent } from "@/components/common/LogicHandleComponent";

const LogicNode = (props: CustomNodeProps) => {
  const {
    isRunning,
    nodeError,
    nodeProps: { data },
    children,
  } = props;

  return (
    <NodeWrapper wrapperProps={props}>
      <div
        className={clsx(
          "flex h-24 w-24 rotate-45 items-center justify-center rounded-xl border-2 border-solid border-accent3 bg-accent3/5",
          { "shadow-around shadow-accent3": isRunning || data.selected },
          { "shadow-around shadow-red-700": nodeError },
        )}
      >
        {children ?? (
          <h2
            contentEditable={true}
            className="m-0 -rotate-45 text-center font-sans text-2xl font-extrabold tracking-wider text-accent3"
          >
            {data.label}
          </h2>
        )}
        <LogicHandleComponent data={data} variant="accent3" />
      </div>
    </NodeWrapper>
  );
};

export default memo(LogicNode);
