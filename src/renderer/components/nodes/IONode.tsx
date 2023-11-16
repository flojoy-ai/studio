import { memo, useState } from "react";
import clsx from "clsx";
import { CustomNodeProps } from "@src/types/node";
import NodeWrapper from "@src/components/common/NodeWrapper";
import { DodecahedronSVG } from "@src/assets/DodecahedronSVG";
import HandleComponent from "@src/components/common/HandleComponent";
import NodeInput from "@src/components/common/NodeInput";

const IONode = (props: CustomNodeProps) => {
  const {
    isRunning,
    nodeProps: { data },
    nodeError,
  } = props;

  const [isRenamingTitle, setIsRenamingTitle] = useState(false);
  return (
    <NodeWrapper wrapperProps={props}>
      <div
        className={clsx(
          "flex h-48 w-48 flex-col items-center",
          { "shadow-around shadow-accent4": isRunning || data.selected },
          { "shadow-around shadow-red-700": nodeError },
        )}
      >
        <DodecahedronSVG />

        {isRenamingTitle ? (
          <NodeInput
            title={data.label}
            id={data.id}
            setIsRenamingTitle={setIsRenamingTitle}
          />
        ) : (
          <h2
            onDoubleClick={() => setIsRenamingTitle(true)}
            className="m-0 text-center font-sans text-2xl font-extrabold tracking-wider text-accent4"
          >
            {data.label}
          </h2>
        )}
        <HandleComponent data={data} variant="accent4" />
      </div>
    </NodeWrapper>
  );
};

export default memo(IONode);
