import { type TVariant } from "@/types/tailwind";
import clsx from "clsx";

type TransformSvgProps = {
  operatorString: string;
  variant: TVariant;
};

const TransformSvg = ({ operatorString, variant }: TransformSvgProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="120"
      height="120"
      viewBox="-18.43 29.15 120 120"
    >
      <rect width="100%" height="100%" fill="transparent"></rect>
      <rect
        width="120"
        height="120"
        x="-60"
        y="-60"
        fill="#FFF"
        rx="0"
        ry="0"
        transform="translate(60 60)"
        vectorEffect="non-scaling-stroke"
        visibility="hidden"
      ></rect>
      <path
        fillOpacity="0"
        className={`stroke-${variant}`}
        strokeWidth="2"
        d="M33.388 3.044L-29.91 39.17c-2.333 1.331-5.235-.354-5.235-3.04v-72.252c0-2.686 2.902-4.37 5.235-3.04l63.3 36.126c2.353 1.344 2.353 4.737 0 6.08z"
        transform="matrix(1.63 0 0 1.44 41.5 90)"
        vectorEffect="non-scaling-stroke"
      ></path>
      <text
        className={clsx(
          "text-center font-sans text-4xl font-bold tracking-wider",
          `fill-${variant}`,
        )}
        transform="translate(43.85 90.5)"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        <tspan x="0" y="0" dx="-20%">
          {operatorString}
        </tspan>
      </text>
    </svg>
  );
};

export default TransformSvg;
