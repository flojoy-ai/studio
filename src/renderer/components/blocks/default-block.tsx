import React, { CSSProperties, memo, useState, useMemo } from "react";
import clsx from "clsx";
import { CustomNodeProps } from "@/renderer/types/node";
import NodeWrapper from "@/renderer/components/common/NodeWrapper";
import HandleComponent from "@/renderer/components/common/HandleComponent";
import NodeInput from "@/renderer/components/common/NodeInput";
import { useNodeStatus } from "@/renderer/hooks/useNodeStatus";
import { BlockLabel } from "../common/block-label";

type DefaultBlockProps = CustomNodeProps & {
  width?: CSSProperties["width"];
  height?: number;
  children?: React.ReactNode;
  variant?: "accent1" | "accent2" | "accent3" | "accent-boolean";
  SVGComponent?: React.JSX.Element;
  showLabel?: boolean;
  className?: string;
  labelPosition?: "left" | "right" | "center";
};

const DefaultBlock = ({
  selected,
  data,
  width,
  height,
  children,
  variant = "accent2",
  SVGComponent,
  showLabel = true,
  className,
  labelPosition,
}: DefaultBlockProps) => {
  const [isRenamingTitle, setIsRenamingTitle] = useState(false);
  const { nodeRunning, nodeError } = useNodeStatus(data.id);
  const maxInputOutput = useMemo(
    () => Math.max(data.inputs?.length ?? 0, data.outputs?.length ?? 0),
    [data.inputs?.length, data.outputs?.length],
  );

  return (
    <NodeWrapper nodeError={nodeError} data={data} selected={selected}>
      <div
        className={clsx(
          `border-${variant} relative flex min-h-[96px] items-center justify-center rounded-lg border-2 border-solid p-2`,
          { [`shadow-around shadow-${variant}`]: nodeRunning || selected },
          { "shadow-around shadow-red-700": nodeError },
          className,
        )}
        style={{
          width: width,
          minHeight: height || maxInputOutput * 38 + 32,
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
            SVGComponent ?? <BlockLabel label={data.label} variant={variant} />
          ))}
        <HandleComponent data={data} variant={variant} />
      </div>
      {showLabel && SVGComponent && (
        <BlockLabel
          label={data.label}
          variant={variant}
          labelPosition={labelPosition}
        />
      )}
    </NodeWrapper>
  );
};

export default memo(DefaultBlock);
