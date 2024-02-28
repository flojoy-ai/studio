import clsx from "clsx";
import { forwardRef, HTMLAttributes } from "react";
import { Handle, HandleProps } from "reactflow";
import { ParamTooltip } from "./ParamTooltip";
import { cva, VariantProps } from "class-variance-authority";

const handle = cva(undefined, {
  variants: {
    variant: {
      blue: "!border-blue-500",
      red: "!border-red-400",
      accent1: "!border-accent1",
      accent2: "!border-accent2 !bg-accent2",
      accent3: "!border-accent3",
      accent4: "!border-accent4",
      "accent-boolean": "!border-accent-boolean !bg-accent-boolean",
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
          "!h-7 !w-3 !rounded-none !border-2 transition-colors duration-150",
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

export const CustomHandle = ({
  type,
  param,
  nodeId,
  ...props
}: CustomHandleProps & { nodeId: string }) => {
  return (
    <ParamTooltip
      param={param}
      annotation={`(${type === "target" ? "input" : "output"})`}
      offsetX={32}
      offsetY={-288}
      nodeId={nodeId}
    >
      <HandleWrapper type={type} param={param} {...props} />
    </ParamTooltip>
  );
};
