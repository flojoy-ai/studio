import { memo } from "react";
import { type CustomNodeProps } from "./types/nodeProps";
import NodeWrapper from "./components/NodeWrapper";
import { LogicHandleComponent } from "./components/LogicHandleComponent";

const LogicNode = ({
  data,
  children,
}: CustomNodeProps & { children?: React.ReactNode }) => {
  return (
    <NodeWrapper>
      <div className="flex h-24 w-24 rotate-45 items-center justify-center rounded-xl border-2 border-solid border-accent3 bg-accent3/5">
        {children ?? (
          <h2 className="m-0 -rotate-45 text-center font-sans text-2xl font-extrabold tracking-wider text-accent3">
            {data.label}
          </h2>
        )}
        <LogicHandleComponent data={data} variant="accent3" />
      </div>
    </NodeWrapper>
  );
};

export default memo(LogicNode);
