import React, { CSSProperties, memo, useState, useMemo } from "react";
import clsx from "clsx";
import { BlockProps } from "@/renderer/types/block";
import NodeWrapper from "@/renderer/components/common/NodeWrapper";
import HandleComponent from "@/renderer/components/common/HandleComponent";
import NodeInput from "@/renderer/components/common/NodeInput";
import { useNodeStatus } from "@/renderer/hooks/useNodeStatus";
import { BlockLabel } from "@/renderer/components/common/block-label";
import { getVariantClass } from "@/renderer/lib/utils";
import { TVariant } from "@/renderer/types/tailwind";

type DefaultBlockProps = BlockProps & {
  width?: CSSProperties["width"];
  height?: number;
  children?: React.ReactNode;
  variant?: TVariant;
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
  variant = "accent1",
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
          {
            [`shadow-around ${getVariantClass(variant).shadow}`]:
              nodeRunning || selected,
          },
          { "shadow-around shadow-red-700": nodeError },
          className,
        )}
        style={{
          width,
          minHeight: height || maxInputOutput * 38 + 32,
        }}
        onDoubleClick={() => setIsRenamingTitle(true)}
      >
        {isRenamingTitle ? (
          <NodeInput
            title={data.label}
            id={data.id}
            setIsRenamingTitle={setIsRenamingTitle}
          />
        ) : (
          children ?? <BlockLabel label={data.label} variant={variant} />
        )}
        <HandleComponent data={data} variant={variant} />
      </div>
      {showLabel && children && (
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
