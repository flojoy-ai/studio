import { FormLabel } from "@/renderer/components/ui/form";
import { cn } from "@/renderer/lib/utils";
import { LucideIcon } from "lucide-react";
import { HTMLProps } from "react";

type Props = HTMLProps<HTMLLabelElement> & {
  icon: LucideIcon;
  className?: string;
};

export const FormIconLabel = ({
  icon: Icon,
  children,
  className,
  ...props
}: Props) => {
  return (
    <FormLabel className={cn("flex items-center gap-2", className)} {...props}>
      <Icon size={20} className="stroke-muted-foreground" />
      <div className="font-bold">{children}</div>
    </FormLabel>
  );
};
