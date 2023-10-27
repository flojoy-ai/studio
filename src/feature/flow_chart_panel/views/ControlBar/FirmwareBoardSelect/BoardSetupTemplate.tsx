import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@src/components/ui/dialog";
import { ArrowBigLeft } from "lucide-react";
import { ReactNode } from "react";

//create type for content, isSetupModalOpen and handleIsSetupModalOpen
type BoardSetupTemplateProps = {
  title: string | null;
  description: string;
  content: ReactNode;
  isSetupModalOpen: boolean;
  handleIsSetupModalOpen: (open: boolean) => void;
  handleBackClick?: () => void;
};

export const BoardSetupTemplate = ({
  title,
  description,
  content,
  isSetupModalOpen,
  handleIsSetupModalOpen,
  handleBackClick,
}: BoardSetupTemplateProps) => {
  return (
    <Dialog open={isSetupModalOpen} onOpenChange={handleIsSetupModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-left">
          <ArrowBigLeft
            onClick={handleBackClick}
            style={{ position: "absolute", top: 4, left: 4, cursor: "pointer" }}
          ></ArrowBigLeft>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};
