import clsx from "clsx";
import { HTMLAttributes } from "react";
import { Handle, HandleProps } from "reactflow";

export const CustomHandle = ({
  colorClass,
  ...props
}: HandleProps &
  Omit<HTMLAttributes<HTMLDivElement>, "id"> & { colorClass: string }) => {
  return (
    <Handle
      className={clsx(
        "!w-3 !h-3 !border-2 !bg-white dark:!bg-black",
        colorClass
      )}
      {...props}
    />
  );
};
