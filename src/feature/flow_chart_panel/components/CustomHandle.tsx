import clsx from "clsx";
import { forwardRef, HTMLAttributes } from "react";
import { Handle, HandleProps } from "reactflow";
import { ParamTooltip } from "./ParamTooltip";

type CustomHandleProps = HandleProps &
  Omit<HTMLAttributes<HTMLDivElement>, "id"> & {
    colorClass: string;
    param: {
      name: string;
      type: string;
      id: string;
      desc?: string;
    };
  };

const HandleWrapper = forwardRef<HTMLDivElement, CustomHandleProps>(
  ({ colorClass, param, type, ...props }, ref) => {
    return (
      <Handle
        className={clsx(
          "!h-3 !w-3 !border-2 !bg-white transition-colors duration-150 dark:!bg-black",
          colorClass
        )}
        type={type}
        id={param.id}
        ref={ref}
        {...props}
      />
    );
  }
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
