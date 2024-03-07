import { variantClassMap } from "@/renderer/lib/utils";
import { EdgeData } from "@/renderer/types/block";
import { TVariant } from "@/renderer/types/tailwind";
import React, { SVGProps, memo } from "react";
import { EdgeLabelRenderer, EdgeProps, getSmoothStepPath } from "reactflow";
type EdgeVariant =
  | "dataframe"
  | "boolean"
  | "scalar"
  | "text"
  | "vector"
  | "matrix"
  | "orderedpair"
  | "orderedtriple"
  | "string"
  | "any";

const outputToLabelMap: Record<
  EdgeVariant,
  {
    label: string;
    variant: TVariant;
    dashArray?: boolean;
    pathCount?: number;
  }
> = {
  dataframe: { label: "df", variant: "accent5" },
  orderedpair: { label: "X Y", variant: "accent5", pathCount: 2 },
  orderedtriple: { label: "X Y Z", variant: "accent5", pathCount: 3 },
  vector: { label: "V", variant: "accent5", dashArray: true },
  text: { label: "Text", variant: "accent4", dashArray: true },
  string: { label: "Text", variant: "accent4", dashArray: true },
  scalar: { label: "Scalar", variant: "accent2", dashArray: true },
  matrix: { label: "M", variant: "accent5" },
  boolean: { label: "Bool", variant: "accent6", dashArray: true },
  any: { label: "DC", variant: "accent1", dashArray: true },
};
export const CustomEdge = (props: EdgeProps<EdgeData>) => {
  const { sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition } =
    props;

  const [, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const outputType =
    props.data?.outputType &&
    props.data?.outputType.toLowerCase() in outputToLabelMap
      ? (props.data?.outputType?.toLowerCase() as EdgeVariant)
      : "any";

  const edgeElement = outputToLabelMap[outputType as EdgeVariant];

  const arr = Array.from<typeof edgeElement>({
    length: edgeElement.pathCount ?? 1,
  }).fill(edgeElement);

  return (
    <>
      {arr.map((el, index) => {
        const calculatedSourceY =
          arr.length > 1 ? generateCoordinates(arr.length, sourceY) : [sourceY];

        const calculatedTargetY =
          arr.length > 1 ? generateCoordinates(arr.length, targetY) : [targetY];
        const [path] = getSmoothStepPath({
          sourceX,
          sourceY: calculatedSourceY[index],
          sourcePosition,
          targetX,
          targetY: calculatedTargetY[index],
          targetPosition,
        });
        return (
          <CustomPath
            key={props.id}
            id={props.id}
            d={path}
            strokeWidth={arr.length > 1 ? 1 : 6}
            variant={el.variant}
            dashArray={el.dashArray}
          />
        );
      })}
      <EdgeLabelRenderer>
        <div
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
          className={`nodrag nopan absolute rounded-sm bg-background p-1 text-2xl font-bold italic tracking-widest text-accent5`}
        >
          {edgeElement.label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

function generateCoordinates(count: number, middlePoint: number) {
  if (count === 1) {
    return [middlePoint];
  }

  const coordinates: number[] = [];
  const interval = 9; // Adjust this value as needed

  let offset = Math.floor(count / 2) * interval;
  if (count % 2 === 0) {
    offset -= interval / 2;
  }

  for (let i = 0; i < count; i++) {
    coordinates.push(middlePoint - offset);
    offset -= interval;
  }

  return coordinates.reverse();
}

const CustomPath = ({
  d,
  variant,
  dashArray,
  ...props
}: SVGProps<SVGPathElement> & {
  variant: TVariant;
  dashArray?: boolean;
}) => {
  return (
    <path
      d={d}
      fill="none"
      strokeWidth={6}
      className={`${variantClassMap[variant].stroke} nopan cursor-pointer`}
      strokeDasharray={dashArray ? "8,8" : "0"}
      style={{
        pointerEvents: "all",
      }}
      {...props}
    />
  );
};

export default memo(CustomEdge);
