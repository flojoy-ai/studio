import { memo } from "react";
import DefaultBlock from "./default-block";
import { useBlockIcon } from "@/hooks/useBlockIcon";
import type { NodeProps } from "reactflow";

export type AICategory = "AI_ML";

const AIBlock = (props: NodeProps) => {
  const { SvgIcon } = useBlockIcon(
    props.type.toLowerCase().replaceAll("_", "-"),
    props.data.func,
  );

  return (
    <DefaultBlock {...props} variant="accent6">
      {SvgIcon && <SvgIcon />}
    </DefaultBlock>
  );
};

export default memo(AIBlock);
