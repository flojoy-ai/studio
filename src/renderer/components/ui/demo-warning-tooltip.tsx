import { FC, ReactNode } from "react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@src/components/ui/tooltip";
import { IS_CLOUD_DEMO } from "@src/data/constants";

export const DemoWarningTooltip: FC<{
  children: ReactNode;
  tooltipContent: ReactNode;
}> = ({ children, tooltipContent }) => {
  if (IS_CLOUD_DEMO) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>{children}</TooltipTrigger>
          <TooltipContent>{tooltipContent}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  return children;
};
