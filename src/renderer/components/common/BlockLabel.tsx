import { cn } from "@/renderer/lib/utils";
import { textWrap } from "@/renderer/utils/TextWrap";

type BlockLabelProps = {
  label: string;
  className?: string;
};

export const BlockLabel = ({ label, className }: BlockLabelProps) => {
  return (
    <h2
      style={{ width: textWrap(208, 24, label) }}
      className={cn(
        "m-0 pt-3 text-center font-sans text-3xl font-semibold tracking-wider",
        className,
      )}
    >
      {label}
    </h2>
  );
};
