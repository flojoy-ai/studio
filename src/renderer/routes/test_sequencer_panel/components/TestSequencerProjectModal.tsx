import { Dialog, DialogContent } from "@/renderer/components/ui/dialog";
import { Button } from "@/renderer/components/ui/button";
import { Dispatch, SetStateAction } from "react";
import { Input } from "@/renderer/components/ui/input";

export const TestSequencerProjectModal = ({
  isProjectModalOpen,
  handleProjectModalOpen,
}: {
  isProjectModalOpen: boolean;
  handleProjectModalOpen: Dispatch<SetStateAction<boolean>>;
}) => {



  return (
    <Dialog
      open={isProjectModalOpen}
      onOpenChange={handleProjectModalOpen}
    >
      <DialogContent>
        <h2 className="mb-2 pt-3 text-center text-lg font-bold text-accent1 ">
          Project Manager 
        </h2>
        <Input placeholder="Project Name" />
        <Input placeholder="Project Description" />
        <Button variant={"default"}> New Project </Button>
      </DialogContent>
    </Dialog>
  );
};
