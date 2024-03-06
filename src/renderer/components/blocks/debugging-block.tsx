import { memo } from "react";
import { BlockProps } from "@/renderer/types/block";
import DefaultBlock from "./default-block";
import { useBlockIcon } from "@/renderer/hooks/useBlockIcon";

export type DebuggingCategory = "DEBUGGING";

const DebuggingBlock = (props: BlockProps) => {
  const { SvgIcon } = useBlockIcon(props.type.toLowerCase(), props.data.func);
  return (
    <DefaultBlock {...props} variant="accent5">
      {SvgIcon && <SvgIcon />}
    </DefaultBlock>
  );
};

export default memo(DebuggingBlock);
