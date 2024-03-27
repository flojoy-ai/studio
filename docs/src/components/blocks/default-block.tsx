import React, { memo, useMemo, type CSSProperties } from "react";
import clsx from "clsx";
import BlockWrapper from "./block-wrapper";
import HandleComponent from "./handle-component";
import { BlockLabel } from "./block-label";
import { type TVariant } from "@/types/tailwind";
import { variantClassMap } from "@/utils/tailwind";
import type { NodeProps } from "reactflow";

type DefaultBlockProps = NodeProps & {
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
  const maxInputOutput = useMemo(
    () => Math.max(data.inputs?.length ?? 0, data.outputs?.length ?? 0),
    [data.inputs?.length, data.outputs?.length],
  );

  return (
    <BlockWrapper>
      <div
        className={clsx(
          `${variantClassMap[variant].border} relative flex min-h-[96px] items-center justify-center rounded-lg border-2 border-solid p-2`,
          {
            [`shadow-around ${variantClassMap[variant].shadow}`]: selected,
          },
          className,
        )}
        style={{
          width,
          minHeight: height || maxInputOutput * 58 + 38,
        }}
      >
        {children ?? <BlockLabel label={data.label} variant={variant} />}
        <HandleComponent data={data} variant={variant} />
      </div>
      {showLabel && children && (
        <BlockLabel
          label={data.label}
          variant={variant}
          labelPosition={labelPosition}
        />
      )}
    </BlockWrapper>
  );
};

export default memo(DefaultBlock);
