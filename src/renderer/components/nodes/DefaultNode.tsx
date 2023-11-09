import { memo, useState } from "react";
import clsx from "clsx";
import { CustomNodeProps } from "@src/types/node";
import NodeWrapper from "@src/components/common/NodeWrapper";
import HandleComponent from "@src/components/common/HandleComponent";
import { textWrap } from "@src/utils/TextWrap";
import NodeInput from "@src/components/common/NodeInput";

const DefaultNode = (props: CustomNodeProps) => {
  const {
    nodeProps: { data },
    height,
    width,
    isRunning = false,
    nodeError = null,
    children,
  } = props;
  const [isRenamingTitle, setIsRenamingTitle] = useState(false);

  return (
    <NodeWrapper wrapperProps={props}>
      <div
        className={clsx(
          "flex min-h-[160px] items-center justify-center break-words rounded-2xl border-2 border-solid border-accent1 bg-accent1/5 p-2",
          { "shadow-around shadow-accent1": isRunning || data.selected },
          { "shadow-around shadow-red-700": nodeError },
        )}
        style={{
          width: width ?? textWrap(160, 24, data.label),
          minHeight: height,
        }}
        onDoubleClick={() => setIsRenamingTitle(true)}
      >
        {children ??
          (isRenamingTitle ? (
            <NodeInput
              title={data.label}
              id={data.id}
              setIsRenamingTitle={setIsRenamingTitle}
            />
          ) : (
            <h2 className="m-0 text-center font-sans text-2xl font-extrabold tracking-wider text-accent1">
              {data.label}
            </h2>
          ))}
        <HandleComponent data={data} variant="accent1" />
      </div>
    </NodeWrapper>
  );
};

export default memo(DefaultNode);
