import { memo, useMemo } from "react";
import { CustomNodeProps } from "@/renderer/types/node";
import TypeCasting from "@/renderer/assets/blocks/etl/type-casting";
import DefaultBlock from "./default-block";
import ExtractSvg from "@/renderer/assets/blocks/etl/extract-svg";
import LoadSvg from "@/renderer/assets/blocks/etl/load-svg";
import { cn } from "@/renderer/lib/utils";

export type ETLCategory = "EXTRACT" | "TRANSFORM" | "LOAD" | "TYPE_CASTING";

const etlCategorySVGMap: Record<
  ETLCategory,
  React.FC<{ blockName: string }>
> = {
  EXTRACT: ExtractSvg,
  LOAD: LoadSvg,
  TRANSFORM: ExtractSvg,
  TYPE_CASTING: TypeCasting,
};

const ETLBlock = (props: CustomNodeProps) => {
  const SelectedETLSvg = useMemo(
    () =>
      props.type in etlCategorySVGMap
        ? etlCategorySVGMap[props.type]
        : etlCategorySVGMap.EXTRACT,
    [props.type],
  );
  return (
    <DefaultBlock
      {...props}
      showLabel={props.type !== "TYPE_CASTING"}
      className={cn({
        "p-5": props.type === "LOAD",
      })}
    >
      <SelectedETLSvg blockName={props.data.func} />
    </DefaultBlock>
  );
};

export default memo(ETLBlock);
