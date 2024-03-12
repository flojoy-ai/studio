import { type BlockProps } from "./types/block";
import { memo } from "react";
import DefaultBlock from "./default-block";
import { useBlockIcon } from "@/hooks/useBlockIcon";

const VisorBlock = (props: BlockProps) => {
  const { SvgIcon } = useBlockIcon(props.type.toLowerCase(), props.data.func);

  return (
    <>
      <DefaultBlock {...props} variant="accent5">
        {SvgIcon && <SvgIcon />}
      </DefaultBlock>
    </>
  );
};

export default memo(VisorBlock);
