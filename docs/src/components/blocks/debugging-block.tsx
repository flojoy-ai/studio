import { memo } from "react";
import DefaultBlock from "./default-block";
import { useBlockIcon } from "@/hooks/useBlockIcon";
import type { NodeProps } from "reactflow";

export type DebuggingCategory = "DEBUGGING";

const DebuggingBlock = (props: NodeProps) => {
  const { SvgIcon } = useBlockIcon(props.type.toLowerCase(), props.data.func);
  return (
    <DefaultBlock {...props} variant="accent5">
      {SvgIcon && <SvgIcon />}
    </DefaultBlock>
  );
};

export default memo(DebuggingBlock);
