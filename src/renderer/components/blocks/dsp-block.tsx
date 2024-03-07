import { memo } from "react";
import { BlockProps } from "@/renderer/types/block";
import DefaultBlock from "./default-block";
import { useBlockIcon } from "@/renderer/hooks/useBlockIcon";

export type DSPCategory = "DSP";

const DSPBlock = (props: BlockProps) => {
  const { SvgIcon } = useBlockIcon(props.type.toLowerCase(), props.data.func);
  return (
    <DefaultBlock {...props} variant="accent2">
      {SvgIcon && <SvgIcon />}
    </DefaultBlock>
  );
};

export default memo(DSPBlock);
