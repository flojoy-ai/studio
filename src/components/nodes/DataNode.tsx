import { memo, useState } from "react";
import clsx from "clsx";
import { CustomNodeProps } from "@src/types/node";
import NodeWrapper from "@/components/common/NodeWrapper";
import HandleComponent from "@/components/common/HandleComponent";
import { textWrap } from "@src/utils/TextWrap";
import { useFlowChartGraph } from "@hooks/useFlowChartGraph";

const DataNode = (props: CustomNodeProps) => {
  const {
    nodeProps: { data },
    isRunning,
    nodeError,
    node,
  } = props;
  const [isRenamingTitle, setIsRenamingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(data.label);
  const { handleTitleChange } = useFlowChartGraph();

  return (
    <NodeWrapper wrapperProps={props}>
      <div
        className={clsx(
          "flex min-h-[96px] items-center justify-center rounded-full border-2 border-solid border-accent2 p-2",
          { "shadow-around shadow-accent2": isRunning || data.selected },
          { "shadow-around shadow-red-700": nodeError },
        )}
        style={{
          width: textWrap(208, 24, data.label),
        }}
      >
        {isRenamingTitle ? (
          <input
            type="text"
            value={newTitle}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                setIsRenamingTitle(false);
              }
            }}
            onChange={(e) => {
              setNewTitle(e.target.value);
              handleTitleChange(e.target.value, node);
            }}
          />
        ) : (
          <h2
            onDoubleClick={() => setIsRenamingTitle(true)}
            className="m-0 text-center font-sans text-2xl font-extrabold tracking-wider text-accent2"
          >
            {data.label}
          </h2>
        )}
        <HandleComponent data={data} variant="accent2" />
      </div>
    </NodeWrapper>
  );
};

export default memo(DataNode);
