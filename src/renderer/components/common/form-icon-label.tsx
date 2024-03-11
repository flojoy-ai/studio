import { FormLabel } from "@/renderer/components/ui/form";
import { LucideIcon } from "lucide-react";
import { HTMLProps } from "react";

type Props = HTMLProps<HTMLLabelElement> & {
  icon: LucideIcon;
};

export const FormIconLabel = ({ icon: Icon, children, ...props }: Props) => {
  return (
    <FormLabel className="flex items-center gap-2" {...props}>
      <Icon size={20} className="stroke-muted-foreground" />
      <div className="font-bold">{children}</div>
    </FormLabel>
  );
};
