import { memo } from "react";
import { type BlockProps } from "./types/block";
import TypeCasting from "@/assets/blocks/etl/type-casting";
import DefaultBlock from "./default-block";
import clsx from "clsx";
import { useBlockIcon } from "@/hooks/useBlockIcon";

export type ETLCategory = "EXTRACT" | "TRANSFORM" | "LOAD" | "TYPE_CASTING";

const ETLBlock = (props: BlockProps) => {
  const { SvgIcon } = useBlockIcon(
    props.type.toLowerCase().replaceAll("_", "-"),
    props.data.func,
  );

  if (props.type === "TYPE_CASTING") {
    return <TypeCastingBlock {...props} />;
  }
  return (
    <DefaultBlock
      {...props}
      className={clsx({
        "p-5": props.type === "LOAD",
      })}
      variant="accent1"
    >
      {SvgIcon && <SvgIcon />}
    </DefaultBlock>
  );
};

export default memo(ETLBlock);

const TypeCastingBlock = (props: BlockProps) => {
  return (
    <DefaultBlock {...props} variant="accent1" showLabel={false}>
      <TypeCasting blockName={props.data.func} />
    </DefaultBlock>
  );
};
