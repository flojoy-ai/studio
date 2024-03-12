import clsx from "clsx";
import { forwardRef, type HTMLAttributes } from "react";
import { Handle, type HandleProps } from "reactflow";
import { ParamTooltip } from "./param-tooltip";
import { cva, type VariantProps } from "class-variance-authority";

const handle = cva(undefined, {
  variants: {
    variant: {
      blue: "!border-blue-500",
      red: "!border-red-400",
      accent1: "!border-accent1 !bg-accent1",
      accent2: "!border-accent2 !bg-accent2",
      accent3: "!border-accent3 !bg-accent3",
      accent4: "!border-accent4 !bg-accent4",
      accent6: "!border-accent6 !bg-accent6",
      accent5: "!border-accent5 !bg-accent5",
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
          "!h-10 !w-4 !rounded-none !border-2 transition-colors duration-150",
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
