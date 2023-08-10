import { Button, ButtonProps } from "@src/components/ui/button";
import { cn } from "@src/lib/utils";
import { LucideIcon, LucideProps } from "lucide-react";

type IconButtonProps = ButtonProps & {
  icon: LucideIcon;
  iconProps?: LucideProps;
};

export const IconButton = ({
  icon: Icon,
  iconProps,
  children,
  ...props
}: IconButtonProps) => {
  const size = iconProps?.size ?? 20;

  return (
    <Button {...props}>
      <Icon
        className={cn("stroke-muted-foreground", iconProps?.className)}
        size={size}
      />
      <div className="px-1" />
      {children}
    </Button>
  );
};
