import { Button } from "@/renderer/components/ui/button";
import { LucideIcon } from "lucide-react";

type ContextMenuActionProps = {
  onClick: () => void;
  children: React.ReactNode;
  icon: LucideIcon;
  testId: string;
};

export const ContextMenuAction = ({
  onClick,
  children,
  icon,
  testId,
}: ContextMenuActionProps) => {
  const Icon = icon;
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      data-testid={testId}
      size="sm"
      className="flex w-full justify-start gap-2"
    >
      <Icon size={14} />
      {children}
    </Button>
  );
};
