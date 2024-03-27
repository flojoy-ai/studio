import { variantClassMap } from "@/utils/tailwind";
import { type TVariant } from "@/types/tailwind";
import { textWrap } from "@/utils/textWrap";
import clsx from "clsx";

type BlockLabelProps = {
  label: string;
  variant?: TVariant;
  labelPosition?: "left" | "right" | "center";
};

export const BlockLabel = ({
  label,
  variant = "accent2",
  labelPosition,
}: BlockLabelProps) => {
  return (
    <div className="flex w-full items-center justify-center p-1">
      <h2
        style={{ width: textWrap(208, 24, label) }}
        className={clsx(
          `${variantClassMap[variant].text} m-0 text-center font-sans text-3xl font-semibold tracking-wider`,
          {
            [`text-${labelPosition}`]: labelPosition,
          },
        )}
      >
        {label}
      </h2>
    </div>
  );
};
