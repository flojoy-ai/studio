import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/renderer/lib/utils";

const statusVariants = cva(
  "inline-flex h-full w-full items-center justify-center rounded-md text-primary-foreground",
  {
    variants: {
      variant: {
        default: "bg-secondary",
        warning: "bg-yellow-500",
        error: "bg-red-500",
        ok: "bg-green-500",
        action: "bg-blue-500",
        outline: "text-foreground",
        bold: "font-semibold text-primary-foreground",
        big: "text-lg w-full m-1",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface StatusProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusVariants> {}

function Status({ className, variant, ...props }: StatusProps): JSX.Element {
  return (
    <div className={cn(statusVariants({ variant }), className)} {...props} />
  );
}

export { Status, statusVariants };
