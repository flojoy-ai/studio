import React, { CSSProperties, memo, useState, useMemo } from "react";
import clsx from "clsx";
import { BlockProps } from "@/renderer/types/block";
import NodeWrapper from "@/renderer/components/common/NodeWrapper";
import HandleComponent from "@/renderer/components/common/HandleComponent";
import NodeInput from "@/renderer/components/common/NodeInput";
import { useBlockStatus } from "@/renderer/hooks/useBlockStatus";
import { BlockLabel } from "@/renderer/components/common/block-label";
import { TVariant } from "@/renderer/types/tailwind";
import { variantClassMap } from "@/renderer/lib/utils";

type DefaultBlockProps = BlockProps & {
  width?: CSSProperties["width"];
  height?: number;
  children?: React.ReactNode;
  variant?: TVariant;
  showLabel?: boolean;
  className?: string;
  labelPosition?: "left" | "right" | "center";
  wrapperStyle?: CSSProperties;
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
  wrapperStyle,
}: DefaultBlockProps) => {
  const [isRenamingTitle, setIsRenamingTitle] = useState(false);
  const { blockRunning, blockError } = useBlockStatus(data.id);
  const maxInputOutput = useMemo(
    () => Math.max(data.inputs?.length ?? 0, data.outputs?.length ?? 0),
    [data.inputs?.length, data.outputs?.length],
  );

  return (
    <NodeWrapper
      nodeError={blockError}
      data={data}
      selected={selected}
      style={wrapperStyle}
    >
      <div
        className={clsx(
          `${variantClassMap[variant].border} relative flex min-h-[96px] items-center justify-center rounded-lg border-2 border-solid p-2`,
          {
            [`shadow-around ${variantClassMap[variant].shadow}`]:
              blockRunning || selected,
          },
          { "shadow-around shadow-red-700": blockError },
          className,
        )}
        style={{
          width: width,
          minHeight: height || maxInputOutput * 58 + 38,
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
