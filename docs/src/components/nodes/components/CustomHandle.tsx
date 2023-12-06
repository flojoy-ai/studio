import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import { forwardRef, type HTMLAttributes } from "react";
import { Handle, type HandleProps } from "reactflow";
import { ParamTooltip } from "./ParamTooltip";

const handle = cva(undefined, {
  variants: {
    variant: {
      blue: "!border-blue-500",
      accent1: "!border-accent1",
      accent2: "!border-accent2",
      accent3: "!border-accent3",
      accent4: "!border-accent4",
    },
  },
});

export type HandleVariantProps = VariantProps<typeof handle>;

type CustomHandleProps = HandleProps &
  Omit<HTMLAttributes<HTMLDivElement>, "id"> & {
    param: {
      name: string;
      type: string;
      id: string;
      desc: string | null;
    };
  } & HandleVariantProps;

const HandleWrapper = forwardRef<HTMLDivElement, CustomHandleProps>(
  ({ variant, param, type, className, ...props }, ref) => {
    return (
      <Handle
        className={clsx(
          "!h-4 !w-4 !border-2 !bg-white transition-colors duration-150 dark:!bg-black",
          handle({ variant }),
          className,
        )}
        type={type}
        id={param?.id}
        ref={ref}
        {...props}
      />
    );
  },
);

HandleWrapper.displayName = "HandleWrapper";

export const CustomHandle = ({ type, param, ...props }: CustomHandleProps) => {
  return (
    <ParamTooltip
      param={param}
      annotation={`(${type === "target" ? "input" : "output"})`}
      offsetX={32}
      offsetY={-128}
    >
      <HandleWrapper type={type} param={param} {...props} />
    </ParamTooltip>
  );
};
