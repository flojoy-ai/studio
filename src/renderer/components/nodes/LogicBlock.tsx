import { memo, useState } from "react";
import clsx from "clsx";
import { BlockProps } from "@/renderer/types/block";
import NodeWrapper from "@/renderer/components/common/NodeWrapper";
import { LogicHandleComponent } from "@/renderer/components/common/LogicHandleComponent";
import BlockLabelInput from "@/renderer/components/common/NodeInput";
import { useNodeStatus } from "@/renderer/hooks/useNodeStatus";

const LogicBlock = ({
  selected,
  data,
  children,
}: BlockProps & { children?: React.ReactNode }) => {
  const [isRenamingTitle, setIsRenamingTitle] = useState(false);
  const { nodeRunning, nodeError } = useNodeStatus(data.id);

  return (
    <NodeWrapper nodeError={nodeError} data={data} selected={selected}>
      <div
        className={clsx(
          "flex h-24 w-24 rotate-45 items-center justify-center rounded-xl border-2 border-solid border-accent3 bg-accent3/5",
          { "shadow-around shadow-accent3": nodeRunning || selected },
          { "shadow-around shadow-red-700": nodeError },
        )}
        onDoubleClick={() => setIsRenamingTitle(true)}
      >
        {children ??
          (isRenamingTitle ? (
            <div className="-rotate-45">
              <BlockLabelInput
                title={data.label}
                id={data.id}
                setIsRenamingTitle={setIsRenamingTitle}
              />
            </div>
          ) : (
            <h2 className="m-0 -rotate-45 text-center font-sans text-2xl font-extrabold tracking-wider text-accent3">
              {data.label}
            </h2>
          ))}
        <LogicHandleComponent data={data} variant="accent3" />
      </div>
    </NodeWrapper>
  );
};

export default memo(LogicBlock);
